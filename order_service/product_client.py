import httpx

class ProductClient:
    def __init__(self, base_url: str):
        self.base_url = base_url

    # === СИНХРОННЫЕ методы (для обычных def функций) ===
    def update_stock_sync(self, product_id: int, delta: int):
        """Синхронное изменение остатка товара"""
        with httpx.Client() as client:
            resp = client.patch(
                f"{self.base_url}/products/{product_id}/stock",
                json={"delta": delta},
                timeout=5.0
            )
            resp.raise_for_status()
            return resp.json()

    def check_product_sync(self, product_id: int):
        """Синхронная проверка товара (возвращает данные)"""
        with httpx.Client() as client:
            resp = client.get(f"{self.base_url}/products/{product_id}")
            resp.raise_for_status()
            return resp.json()

    # === АСИНХРОННЫЕ методы (если понадобятся в async функциях) ===
    async def update_stock(self, product_id: int, delta: int):
        async with httpx.AsyncClient() as client:
            resp = await client.patch(
                f"{self.base_url}/products/{product_id}/stock",
                json={"delta": delta},
                timeout=5.0
            )
            resp.raise_for_status()
            return resp.json()

    async def get_product(self, product_id: int):
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.base_url}/products/{product_id}")
            resp.raise_for_status()
            return resp.json()