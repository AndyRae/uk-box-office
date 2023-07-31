from ukbo.extensions import db

from .models import PkModel


class CountryGroupMarketShare(PkModel):
    """
    Model for storing precomputed market share data for country groups.
    """

    __tablename__ = "country_group_market_share"

    year = db.Column(db.Integer, nullable=False)
    country_group_id = db.Column(
        db.Integer, db.ForeignKey("country_group.id"), nullable=False
    )
    market_share = db.Column(db.Float, nullable=False)
    gross = db.Column(db.Integer, nullable=False)

    country_group = db.relationship(
        "CountryGroup", back_populates="market_share_data"
    )

    __table_args__ = (db.UniqueConstraint("country_group_id", "year"),)
