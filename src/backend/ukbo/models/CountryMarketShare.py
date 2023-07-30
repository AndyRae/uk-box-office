from ukbo.extensions import db

from .models import PkModel


class CountryMarketShare(PkModel):
    """
    Model for storing precomputed market share data for countries.
    """

    __tablename__ = "country_market_share"

    year = db.Column(db.Integer, nullable=False)
    country_id = db.Column(
        db.Integer, db.ForeignKey("country.id"), nullable=False
    )
    market_share = db.Column(db.Float, nullable=False)
    gross = db.Column(db.Integer, nullable=False)

    country = db.relationship("Country", back_populates="market_share_data")
    __table_args__ = (db.UniqueConstraint("country_id", "year"),)
