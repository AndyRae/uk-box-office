# welp

## commands

run locally: `docker-compose up`

shell access: `docker exec -it <container name> /bin/bash`

These should all run weekly on a Wednesday, but if they fail you can run them manually:

* run etl task `docker exec web flask weekly-etl`
* run forecast task `docker exec web flask forecast`
* run build-static task `docker exec web flask build-static`
