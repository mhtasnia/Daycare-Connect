FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt


FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/core

RUN useradd -m appuser && mkdir /app
WORKDIR /app


COPY --from=builder /usr/local /usr/local


COPY . .


RUN chown -R appuser:appuser /app && \
    chmod -R 755 /app

RUN python manage.py collectstatic --noinput


USER appuser

EXPOSE 8000

CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]
