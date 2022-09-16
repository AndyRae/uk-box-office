from slugify import slugify  # type: ignore
from ukbo import models


def add_distributor(distributor: str) -> models.Distributor:
    """
    Checks the database if the distributor exists - returns the class
    If not - creates it, adds it to the database and returns it
    """
    distributor = distributor.strip()
    slug = slugify(distributor)

    if instance := models.Distributor.query.filter_by(slug=slug).first():
        return instance
    return models.Distributor.create(name=distributor, commit=False)
