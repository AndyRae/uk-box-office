# UK Box Office

UK Box Office data is the most detailed and searchable source for box office data in the UK.
The backend runs Flask built with Python, the frontend is built with Next.js in Typescript, using chart.js for visualisation.

The Next.js app uses the [application directory](https://beta.nextjs.org/docs/getting-started).

[Use the application.](https://boxofficedata.co.uk)

[Read about the project.](https://rae.li/posts/uk-box-office-data-studio-to-flask)

## Get Started

### Codespaces

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=408136770)

This codespace will run the services needed for the application; the backend, frontend, and database.

Run backend:

- `cd src/backend; flask run`
- Change the Port Visibility to `Public`

Run frontend:

- `cd src/frontend; npm start`

### Run Locally

- With Docker: `docker-compose up`

### Seeding Data

Seeding data requires you to have a `archive.csv` of box office data in `src/backend/data/`.
You can find the entire dataset to use [here](https://boxofficedata.co.uk/opendata).
It will take a long time to seed the data, so you should try the `--year` flag to only seed a single year.

- Make database migrations, inside `src/backend` `flask db upgrade`
- Seed films: `flask seed-films`
- Seed box office: `flask seed-box-office`
  - Additionally takes `--year` option for a specific year: `--year 2007`
- Seed Admissions: `flask seed-admissions` (requires `admissions.csv`)

## Structure

- `src/backend/` - Flask app
- `src/backend/ukbo/api` - API endpoints
- `src/backend/ukbo/services` - Services
- `src/backend/ukbo/etl` - ETL Pipelines / CLI Tasks
- `src/frontend/` - Next.js app

## Tasks

These run weekly on a Wednesday, if they fail you can run them manually:

- Fetch new box office data `flask weekly-etl`
- Build a new box office forecast `flask forecast`

## Utilities

- Fetch new box office data from a specific link (works as a backup): `flask backup-etl {link to file} "01 January 2007"`
- Delete and rollback the last week of data: `flask rollback-etl`
- Delete and rollback a specific year of data: `flask rollback-year --year 2007`
- Update admissions manually: `flask update-admissions --year 2020 --month 1 --admissions 100`
