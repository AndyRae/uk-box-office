from ukbo.extensions import db

from .models import PkModel


class CountryGroup(PkModel):
    """
    Model for storing country groups and their associations with countries.

    A country group represents an area of interest for market share,
    for example `USA+UK`, `UK`,  `Europe`.
    The rules to define these groups are driven in the service layer.
    """

    __tablename__ = "country_group"

    name = db.Column(db.String(100), nullable=False, unique=True)

    countries = db.relationship(
        "Country",
        secondary="country_group_countries",
        back_populates="groups",
    )
    market_share_data = db.relationship(
        "CountryGroupMarketShare", back_populates="country_group"
    )


class CountryGroupCountries(db.Model):
    """
    Many-to-many table linking CountryGroup and Country.
    """

    __tablename__ = "country_group_countries"

    country_group_id = db.Column(
        db.Integer, db.ForeignKey("country_group.id"), primary_key=True
    )
    country_id = db.Column(
        db.Integer, db.ForeignKey("country.id"), primary_key=True
    )
