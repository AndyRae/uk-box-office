from typing import Any, Dict

from slugify import slugify  # type: ignore
from ukbo.extensions import db

from .models import PkModel


class Distributor(PkModel):  # type: ignore
    """

    This model stores a distributor in the UKBO database.

    Attributes:
        name: Name of the distributor.
        slug: Slug of the distributor.

    """

    __tablename__ = "distributor"
    name = db.Column(db.String(160), unique=True, nullable=False)
    slug = db.Column(db.String(160), nullable=False, unique=True)

    market_share_data = db.relationship(
        "DistributorMarketShare", back_populates="distributor"
    )

    def __init__(self, *args: str, **kwargs: str) -> None:
        if "slug" not in kwargs:
            kwargs["slug"] = slugify(kwargs.get("name", ""))
        super().__init__(*args, **kwargs)

    def __repr__(self) -> str:
        return self.name

    def __eq__(self, o: object) -> bool:
        return self.name == o
