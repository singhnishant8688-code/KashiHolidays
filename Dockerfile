# ==============================================================================
# 1. Official Minimal Base Image (Build Stage - Reduced Attack Surface)
# ==============================================================================
FROM python:3.11-slim AS builder

# Environment variables set karein
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Dependencies install karein (Build-stage)
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt


# ==============================================================================
# 2. Final Production Stage (Minimal Security Footprint)
# ==============================================================================
FROM python:3.11-slim

WORKDIR /app

# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Non-Root User Banayein (Security Rule #1: Container ko 'root' se nahi chalana)
RUN adduser --disabled-password --gecos "" appuser

# Dependencies aur Code Copy Karein (Sath hi ownership change karein)
COPY --from=builder /root/.local /home/appuser/.local
COPY --chown=appuser:appuser . /app

# PATH update karein non-root user dependencies ke liye
ENV PATH=/home/appuser/.local/bin:$PATH

# Non-root User par Switch Karein
USER appuser

# Application Port Expose Karein
EXPOSE 8000

# Server Run Command (FastAPI with Uvicorn)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
