FROM python:3.12-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY pyproject.toml .

RUN pip install poetry && poetry config virtualenvs.create false && poetry install

COPY . /app

RUN ["python", "manage.py", "makemigrations"]
RUN ["python", "manage.py", "migrate"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
