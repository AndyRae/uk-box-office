# syntax=docker/dockerfile:1
FROM python:3
WORKDIR /app
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=uk_box_office_flask
ENV FLASK_ENV=development
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD [ "flask", "run", "--host=0.0.0.0"]
