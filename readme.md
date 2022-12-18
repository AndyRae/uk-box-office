# UK Box Office

UK Box Office data is the most detailed and searchable source for box office data in the UK.
The backend runs Flask built with Python, the frontend is built with React using chart.js to visualise the data.

[Use the application.](https://boxofficedata.co.uk)

[Read about the project.](https://rae.li/uk-box-office-data-studio-to-flask.html)

## Get Started

### Codespaces

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=408136770)

This codespace will run the services needed for the application; the backend, frontend, and database.

Run backend:

- `cd src/berenice; flask run`
- Change the Port Visibility to `Public`

Run frontend:

- `cd src/sophronia; npm start`

### Run Locally

- With Docker: `docker-compose up`

### Seeding Data

Seeding data requires you to have a `archive.csv` of box office data in `src/berenice/data/`.
You can find the entire dataset to use [here](https://boxofficedata.co.uk/opendata).
It will take a long time to seed the data, so you should try the `--year` flag to only seed a single year.

- Make database migrations, inside `src/berenice` `flask db upgrade`
- Seed films: `flask seed-films`
- Seed box office: `flask seed-box-office`
  - Additionally takes `--year` option for a specific year: `--year 2007`
- Seed Admissions: `flask seed-admissions` (requires `admissions.csv`)

## Structure

- `src/berenice/` - Flask app
- `src/berenice/ukbo/api` - API endpoints
- `src/berenice/ukbo/services` - Services
- `src/berenice/ukbo/etl` - ETL Pipelines / CLI Tasks
- `src/sophronia/` - React app

## Tasks

These run weekly on a Wednesday, if they fail you can run them manually:

- Fetch new box office data `flask weekly-etl`
- Build a new box office forecast `flask forecast`

## Utilities

- Fetch new box office data from a specific link (works as a backup): `flask backup-etl {link to file}`
- Delete and rollback the last week of data: `flask rollback-etl`
- Delete and rollback a specific year of data: `flask rollback-year --year 2007`
- Update admissions manually: `flask update-admissions --year 2020 --month 1 --admissions 100`
