# syntax=docker/dockerfile:1
FROM --platform=linux/amd64 python:3.10.5-bullseye
# Set an environment variable with the directory
# where we'll be running the app
ENV APP /app
# Create the directory and instruct Docker to operate
# from there from now on
RUN mkdir $APP
WORKDIR $APP

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE 1
ENV FLASK_APP=ukbo
ENV SOURCE_URL = "https://www.bfi.org.uk/industry-data-insights/weekend-box-office-figures"
ENV SECRET_KEY = "test"

ENV SQLALCHEMY_TRACK_MODIFICATIONS=False
ENV DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres
ENV POSTGRES_DB=postgres
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

COPY requirements.txt requirements.txt
RUN python3 -m pip install --upgrade pip
RUN pip install -r requirements.txt
COPY . $APP
