# UK Box Office

UK Box Office data is the most detailed and searchable source for box office data in the UK.
The backend runs Flask built with Python, the frontend is built with React using chart.js to visualise the data.

[Use the application.](https://boxofficedata.co.uk)

[Read about the project.](https://rae.li/uk-box-office-data-studio-to-flask.html)

## Get Started

- Run locally: `docker-compose up`
- Make migrations: `docker exec web flask db upgrade`

Seeding data requires you to have a `archive.csv` of box office data in `src/berenice/data/`.
You can find the entire dataset to use [here](https://boxofficedata.co.uk/opendata).
It will take a long time to seed the data, so you might try the `--year` flag to only seed a single year.

- Seed films: `docker exec web flask seed-films`
- Seed box office: `docker exec web flask seed-box-office`
  - Additionally takes `--year` option for a specific year: `--year 2007`

### Codespaces

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=408136770)

You can run the backend of this application in Github codespaces.

- Open in Codespaces
- `cd src/berenice`
- `flask run`

## Structure

- `src/berenice/` - Flask app
- `src/berenice/ukbo/api` - API endpoints
- `src/berenice/ukbo/services` - Services
- `src/berenice/ukbo/etl` - ETL Pipelines / CLI Tasks
- `src/sophronia/` - React app

## Tasks

These run weekly on a Wednesday, if they fail you can run them manually:

- Fetch new box office data `docker exec web flask weekly-etl`
- Build a new box office forecast `docker exec web flask forecast`

## Utilities

- Fetch new box office data from a specific link (works as a backup): `docker exec web flask backup-etl {link to file}`
- Delete and rollback the last week of data: `docker exec web flask rollback-etl`
- Delete and rollback a specific year of data: `docker exec web flask rollback-year --year 2007`
