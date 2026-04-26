import os
import httpx
from dotenv import load_dotenv

load_dotenv()

PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://127.0.0.1:8000")

def check_product(product_id: int):
    with httpx.Client() as client:
        r = client.get(f"{PRODUCT_SERVICE_URL}/internal/products/{product_id}/check")
        r.raise_for_status()
        return r.json()

def get_product(product_id: int):
    with httpx.Client() as client:
        r = client.get(f"{PRODUCT_SERVICE_URL}/products/{product_id}")
        r.raise_for_status()
        return r.json()

def update_stock(product_id: int, quantity: int):
    with httpx.Client() as client:
        product = get_product(product_id)
        new_stock = product["stock"] - quantity
        if new_stock < 0:
            new_stock = 0
        r = client.put(
            f"{PRODUCT_SERVICE_URL}/products/{product_id}",
            params={"stock_quantity": new_stock}
        )
        r.raise_for_status()
        return r.json()
