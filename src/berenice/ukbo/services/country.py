from typing import List

from slugify import slugify  # type: ignore
from ukbo import models

from . import utils


def add_country(country: str) -> List[models.Country]:
    """
    Splits up the string of countries, and one by one.
    Maps it to the full country name.
    Checks the database if the country exists.
    If not - creates it, adds it to the database.
    Returns a list of the countries
    """
    new_countries: List[models.Country] = []
    if type(country) == float:
        return new_countries
    country = country.strip()
    countries = country.split("/")
    for i in countries:
        i = i.strip()
        i = utils.spellcheck_country(i)
        slug = slugify(i)
        db_country = models.Country.query.filter_by(slug=slug).first()

        if db_country and slug == db_country.slug:
            new_countries.append(db_country)
        else:
            new = models.Country.create(name=i, commit=False)
            new_countries.append(new)
    return new_countries
