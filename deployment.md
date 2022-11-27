# Deployment

A quick note on how this project is deployed.

The application code lives in `/var/www/uk-box-office` on the server.

Gunicorn is used to run the Flask application, with the configuration in `/etc/systemd/system/gunicorn.service`.

The application is served by Nginx, with the configuration in `/etc/nginx/sites-available/ukbo`.

The application is deployed using a GitHub workflow in `.github/workflows/main.yml`.

The workflow runs on a push to the `main` branch, it builds the Node app, copies the Flask app, and scp's the code to server.
