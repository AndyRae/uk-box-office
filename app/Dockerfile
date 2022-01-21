# syntax=docker/dockerfile:1
FROM python:3.9.5-slim-buster
# Set an environment variable with the directory
# where we'll be running the app
ENV APP /app
# Create the directory and instruct Docker to operate
# from there from now on
RUN mkdir $APP
WORKDIR $APP

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE 1
ENV FLASK_APP=app
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
