from typing import Any, Dict

from slugify import slugify  # type: ignore
from ukbo.extensions import db

from .models import PkModel, SearchableMixin


class Distributor(SearchableMixin, PkModel):  # type: ignore

    __tablename__ = "distributor"
    __searchable__ = ["name"]
    name = db.Column(db.String(160), unique=True, nullable=False)
    films = db.relationship("Film", back_populates="distributor")
    weeks = db.relationship("Film_Week", backref="distributor", lazy="dynamic")
    slug = db.Column(db.String(160), nullable=False, unique=True)

    def __init__(self, *args: str, **kwargs: str) -> None:
        if "slug" not in kwargs:
            kwargs["slug"] = slugify(kwargs.get("name", ""))
        super().__init__(*args, **kwargs)

    def __repr__(self) -> str:
        return self.name

    def __eq__(self, o: object) -> bool:
        return self.name == o

    def as_dict(self) -> Dict[str, Any]:
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}