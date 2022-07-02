# UK Box Office

UK Box Office data is the most detailed and searchable source for box office data in the UK.
A Python application built in Flask, using chart.js to visualise the data.

[Use the application.](https://boxofficedata.co.uk)

[Read about the project.](https://rae.li/uk-box-office-data-studio-to-flask.html)

## Get Started

* Run locally: `docker-compose up`
* Make migrations: `docker exec web flask init-db`

Requires you to have a `archive.csv` of box office data:

* Seed films: `docker exec web flask seed-films`
* Seed box office: `docker exec web flask seed-box-office`
  * Additionally takes `--year` option for a specific year: `--year 2007`

## Tasks

These run weekly on a Wednesday, if they fail you can run them manually:

* Fetch new box office data `docker exec web flask weekly-etl`
* Build a new box office forecast `docker exec web flask forecast`
* Build static reports data `docker exec web flask build-static`

## Utilities

* Fetch new box office data from a specific link (works as a backup): `docker exec web flask backup-etl {link to file}`
* Delete and rollback the last week of data: `docker exec web flask rollback-etl`
* Delete and rollback a specific year of data: `docker exec web flask rollback-year --year 2007`

## API

There is rate limited API access available at: [boxofficedata.co.uk/api](https://boxofficedata.co.uk/api)

It currently only filters by date for box office data only, with the parameters as:

`start_date` date in `YYYY-MM-DD` format.

`end_date` date in `YYYY-MM-DD` format.

`start` pagination number for the API, there are 150 records per page.

For example, to query data between `01/01/2007` and `18/01/2007`:

`https://boxofficedata.co.uk/api?start_date=2007-01-01&end_date=2007-01-18&start=1`
