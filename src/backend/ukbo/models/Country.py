from typing import Any, Dict

from slugify import slugify  # type: ignore
from ukbo.extensions import db

from .models import PkModel


class Country(PkModel):  # type: ignore
    """

    This model stores a Country in the UKBO dataset.

    Attributes:
        name: Name of the country.
        slug: Slug of the country.

    """

    __tablename__ = "country"
    name = db.Column(db.String(160), unique=True, nullable=False)
    slug = db.Column(db.String(160), nullable=False, unique=True)

    def __init__(self, *args: str, **kwargs: str) -> None:
        if "slug" not in kwargs:
            kwargs["slug"] = slugify(kwargs.get("name", ""))
        super().__init__(*args, **kwargs)

    def __repr__(self) -> str:
        return self.name

    def __eq__(self, o: object) -> bool:
        return self.name == o
