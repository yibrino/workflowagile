FROM python:3.12-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY pyproject.toml /app/pyproject.toml

RUN pip install poetry && poetry config virtualenvs.create false && poetry install

COPY . /app

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
