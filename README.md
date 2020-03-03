## Dashboard for UK Box Office data.

[Link to dashboard](https://boxoffice.rae.li)

[Reasons why](https://rae.li/uk-box-office-dashboard)

Data pipeline:

`helper.py` for functions.

`extract_archive.py` for extracting historical data.

`extract_week.py` for extracting weekly, for new data.

`transform_archive.py` for transforming the archive.

`load_week.py` for loading to the database.

Github site in `/docs/`
_Essentially an iframe for Google Data Studio, but you can't open source that bit._
