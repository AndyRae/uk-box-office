from typing import List

from slugify import slugify  # type: ignore
from ukbo import models
from ukbo.extensions import db


def add_film(
    film: str,
    distributor: models.Distributor,
    countries: List[models.Country],
) -> models.Film:
    """
    Checks the database if the film exists - returns the class
    If not - creates it, adds it to the database and returns it
    """
    film = film.strip()

    if instance := models.Film.query.filter_by(
        name=film, distributor=distributor
    ).first():
        return instance

    new = models.Film(name=film, distributor=distributor, countries=countries)
    try:
        new.save()
    except Exception:
        # Film exists but with a different distributor
        print(f"Duplicate {film}")
        db.session.rollback()
        slug = slugify(f"{film}-{distributor.name}")
        new.slug = slug
        new.save()
    return new
