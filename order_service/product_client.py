import httpx

class ProductClient:
    def __init__(self, base_url: str):
        self.base_url = base_url

    # Синхронные методы – для вызовов из обычных def (как в main.py)
    def check_product(self, product_id: int):
        """Получить товар по ID"""
        with httpx.Client() as client:
            resp = client.get(f"{self.base_url}/products/{product_id}")
            resp.raise_for_status()
            return resp.json()

    def update_stock(self, product_id: int, delta: int):
        """Изменить остаток товара"""
        with httpx.Client() as client:
            resp = client.patch(
                f"{self.base_url}/products/{product_id}/stock",
                json={"delta": delta},
                timeout=5.0
            )
            resp.raise_for_status()
            return resp.json()

    # Асинхронные методы (если понадобятся, но не используются в текущем main.py)
    async def check_product_async(self, product_id: int):
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.base_url}/products/{product_id}")
            resp.raise_for_status()
            return resp.json()

    async def update_stock_async(self, product_id: int, delta: int):
        async with httpx.AsyncClient() as client:
            resp = await client.patch(
                f"{self.base_url}/products/{product_id}/stock",
                json={"delta": delta},
                timeout=5.0
            )
            resp.raise_for_status()
            return resp.json()