from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, HTMLResponse, RedirectResponse
import httpx

app = FastAPI(
    title="Shop Microservices API Gateway",
    description="Единая точка входа для всех сервисов магазина лампочек",
    version="1.0.0"
)

PRODUCT_SERVICE = "http://product-service:8000"
ORDER_SERVICE = "http://order-service:8001"

# Прокси-клиент
client = httpx.AsyncClient(timeout=30.0)


@app.get("/", response_class=HTMLResponse, include_in_schema=False)
def home():
    return """
    <html>
    <head><title>Shop Microservices</title>
    <style>
        body { font-family: Arial; margin: 50px; }
        a { display: block; margin: 15px; font-size: 20px; }
    </style></head>
    <body>
        <h1>Магазин лампочек</h1>
        <a href="/docs">Swagger API Documentation</a>
        <br>
        <h2>Прямые ссылки:</h2>
        <a href="/docs">Все API (общий Swagger)</a>
    </body>
    </html>
    """


@app.api_route("/products/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"], tags=["Products"])
@app.api_route("/products", methods=["GET", "POST", "PUT", "DELETE", "PATCH"], tags=["Products"])
async def proxy_products(request: Request, path: str = ""):
    url = f"{PRODUCT_SERVICE}/products/{path}" if path else f"{PRODUCT_SERVICE}/products"
    return await proxy(request, url)


@app.api_route("/internal/{path:path}", methods=["GET", "POST"], tags=["Internal"], include_in_schema=False)
async def proxy_internal(request: Request, path: str):
    return await proxy(request, f"{PRODUCT_SERVICE}/internal/{path}")


@app.api_route("/cart/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"], tags=["Cart"])
@app.api_route("/cart", methods=["GET", "POST", "PUT", "DELETE", "PATCH"], tags=["Cart"])
async def proxy_cart(request: Request, path: str = ""):
    url = f"{ORDER_SERVICE}/cart/{path}" if path else f"{ORDER_SERVICE}/cart"
    return await proxy(request, url)


@app.api_route("/orders/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"], tags=["Orders"])
@app.api_route("/orders", methods=["GET", "POST", "PUT", "DELETE", "PATCH"], tags=["Orders"])
async def proxy_orders(request: Request, path: str = ""):
    url = f"{ORDER_SERVICE}/orders/{path}" if path else f"{ORDER_SERVICE}/orders"
    return await proxy(request, url)


async def proxy(request: Request, url: str):
    method = request.method
    params = dict(request.query_params)
    headers = {k: v for k, v in request.headers.items() if k.lower() not in ["host", "content-length"]}
    body = await request.body()

    try:
        resp = await client.request(
            method=method,
            url=url,
            params=params,
            headers=headers,
            content=body
        )
        return JSONResponse(
            content=resp.json() if resp.content else None,
            status_code=resp.status_code
        )
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=502)
