from fastapi import FastAPI, Depends, HTTPException
from auth import get_current_admin
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import models
import database
import product_client

app = FastAPI(title="Order Service")

# Инициализируем клиент (предполагается, что переменная окружения PRODUCT_SERVICE_URL задана)
import os
product_client = product_client.ProductClient(os.getenv("PRODUCT_SERVICE_URL", "http://product-service:8001"))


class CartAdd(BaseModel):
    session_id: str
    product_id: int
    quantity: int = 1


class CartUpdate(BaseModel):
    quantity: int


class CartClear(BaseModel):
    session_id: str


class OrderCreate(BaseModel):
    session_id: str


class OrderStatus(BaseModel):
    status: str


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_or_create_cart(session_id: str, db: Session):
    cart = db.query(models.Cart).filter(models.Cart.session_id == session_id).first()
    if not cart:
        cart = models.Cart(session_id=session_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


# ===== КОРЗИНА =====
@app.post("/cart/items")
def add_to_cart(data: CartAdd, db: Session = Depends(get_db)):
    try:
        product = product_client.check_product(data.product_id)   # синхронный вызов
    except Exception:
        raise HTTPException(status_code=400, detail="Product not available")

    cart = get_or_create_cart(data.session_id, db)
    existing = db.query(models.CartItem).filter(
        models.CartItem.cart_id == cart.id,
        models.CartItem.product_id == data.product_id
    ).first()

    if existing:
        existing.quantity += data.quantity
    else:
        existing = models.CartItem(cart_id=cart.id, product_id=data.product_id, quantity=data.quantity)
        db.add(existing)

    db.commit()
    db.refresh(existing)
    return {"message": "Added", "product": product["name"], "quantity": existing.quantity}


@app.get("/cart")
def view_cart(session_id: str, db: Session = Depends(get_db)):
    cart = db.query(models.Cart).filter(models.Cart.session_id == session_id).first()
    if not cart or not cart.items:
        return {"items": [], "total": 0}

    items = []
    total = 0
    for item in cart.items:
        try:
            p = product_client.check_product(item.product_id)   # синхронный вызов
            items.append({"product_id": item.product_id, "name": p["name"], "price": p["price"], "quantity": item.quantity})
            total += p["price"] * item.quantity
        except Exception:
            pass
    return {"cart_id": cart.id, "items": items, "total": round(total, 2)}


@app.put("/cart/items/{item_id}")
def update_cart_item(item_id: int, data: CartUpdate, db: Session = Depends(get_db)):
    item = db.query(models.CartItem).filter(models.CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    if data.quantity <= 0:
        db.delete(item)
    else:
        item.quantity = data.quantity
    db.commit()
    return {"message": "Updated"}


@app.delete("/cart/items/{item_id}")
def remove_cart_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.CartItem).filter(models.CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(item)
    db.commit()
    return {"message": "Deleted"}


@app.delete("/cart")
def clear_cart(data: CartClear, db: Session = Depends(get_db)):
    cart = db.query(models.Cart).filter(models.Cart.session_id == data.session_id).first()
    if cart:
        db.query(models.CartItem).filter(models.CartItem.cart_id == cart.id).delete()
        db.commit()
    return {"message": "Cart cleared"}


@app.post("/orders")
def create_order(data: OrderCreate, db: Session = Depends(get_db)):
    cart = db.query(models.Cart).filter(models.Cart.session_id == data.session_id).first()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total = 0.0
    items_data = []

    for item in cart.items:
        try:
            p = product_client.check_product(item.product_id)
            items_data.append({
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": p["price"]
            })
            total += p["price"] * item.quantity
        except Exception:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} not available")

    order = models.Order(session_id=data.session_id, total_price=round(total, 2))
    db.add(order)
    db.commit()
    db.refresh(order)

    for d in items_data:
        db.add(models.OrderItem(order_id=order.id, **d))

    # Списание товара
    try:
        for d in items_data:
            product_client.update_stock(d["product_id"], -d["quantity"])
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Stock error: {str(e)}")

    # Очищаем корзину
    db.query(models.CartItem).filter(models.CartItem.cart_id == cart.id).delete()
    db.commit()

    return {"order_id": order.id, "total": order.total_price, "items_count": len(items_data)}


@app.get("/admin/orders")
def get_all_orders(admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    orders = db.query(models.Order).all()
    return [{"order_id": o.id, "status": o.status, "total": o.total_price, "created_at": str(o.created_at)} for o in orders]


@app.get("/orders")
def get_orders(session_id: str, db: Session = Depends(get_db)):
    orders = db.query(models.Order).filter(models.Order.session_id == session_id).all()
    return [{"order_id": o.id, "status": o.status, "total": o.total_price, "created_at": str(o.created_at)} for o in orders]


@app.put("/orders/{order_id}/status")
def update_order_status(order_id: int, data: OrderStatus, admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Not found")
    order.status = data.status
    db.commit()
    return {"order_id": order.id, "status": order.status}