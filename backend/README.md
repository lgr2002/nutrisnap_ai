# NutriSnap AI Backend

FastAPI backend for NutriSnap AI meal estimation.

## Features

- Health check endpoint
- Meal estimate endpoint
- OpenAI text/vision meal estimation
- Rule-based fallback estimator
- AI mode control for cost management

## Local setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001