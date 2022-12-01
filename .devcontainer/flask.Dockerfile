FROM mcr.microsoft.com/devcontainers/python:3.10-bullseye

ENV PYTHONUNBUFFERED 1
ENV FLASK_APP="ukbo:create_app('dev')"

ENV APP /app
# Create the directory and instruct Docker to operate
# from there from now on
RUN mkdir $APP
WORKDIR $APP

COPY src/berenice/requirements.txt requirements.txt
RUN pip install -r requirements.txt

