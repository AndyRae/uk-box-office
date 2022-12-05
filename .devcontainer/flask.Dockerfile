FROM mcr.microsoft.com/devcontainers/python:3.10-bullseye

ENV PYTHONUNBUFFERED 1
ENV FLASK_APP="ukbo:create_app('dev')"

ENV PYTHONDONTWRITEBYTECODE 1
ENV SOURCE_URL = "https://www.bfi.org.uk/industry-data-insights/weekend-box-office-figures"
ENV SECRET_KEY = "test"

ENV SQLALCHEMY_TRACK_MODIFICATIONS=False
ENV DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres
ENV POSTGRES_DB=postgres
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres


ENV APP /app
# Create the directory and instruct Docker to operate
# from there from now on
RUN mkdir $APP
WORKDIR $APP

COPY src/berenice/requirements.txt requirements.txt
RUN pip install -r requirements.txt

