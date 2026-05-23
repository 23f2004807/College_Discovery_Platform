"""Production entry for Gunicorn (Render, etc.)."""
from app import create_app

app = create_app()
