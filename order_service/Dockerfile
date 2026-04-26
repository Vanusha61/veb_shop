FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY .env .
COPY database.py .
COPY models.py .
COPY main.py .
COPY product_client.py .
COPY alembic.ini .
COPY alembic ./alembic

CMD ["sh", "-c", "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 8001"]
