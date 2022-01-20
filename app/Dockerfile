# syntax=docker/dockerfile:1
FROM python:3.9.5-slim-buster
WORKDIR /app
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE 1
ENV FLASK_APP=app
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . ./app
