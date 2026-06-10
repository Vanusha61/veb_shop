# Добавь этот код в product_service/main.py (ниже других эндпоинтов)
from fastapi import HTTPException

@app.patch("/products/{product_id}/stock")
async def adjust_stock(product_id: int, delta: int):
    # Здесь предполагается, что у тебя есть асинхронная ORM (например, databases)
    query = "UPDATE products SET stock = stock + :delta WHERE id = :product_id AND stock + delta >= 0 RETURNING id"
    result = await database.fetch_one(query, values={"delta": delta, "product_id": product_id})
    if not result:
        raise HTTPException(400, "Not enough stock or product not found")
    return {"ok": True}
