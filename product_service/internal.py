from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import database

router = APIRouter(prefix="/internal")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/products/{product_id}/check")
def check_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if not product.is_available or product.stock_quantity < 1:
        raise HTTPException(status_code=400, detail="Product not available")
    return {"available": True, "price": product.price, "name": product.name}
