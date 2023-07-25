from ukbo.extensions import db

from .models import PkModel


class DistributorMarketShareTable(PkModel):
    """
    Model for storing precomputed market share data for distributors.
    """

    __tablename__ = "distributor_market_share"

    year = db.Column(db.Integer, nullable=False)
    distributor_id = db.Column(
        db.Integer, db.ForeignKey("distributor.id"), nullable=False
    )
    market_share = db.Column(db.Float, nullable=False)
    gross = db.Column(db.Integer, nullable=False)

    distributor = db.relationship(
        "Distributor", back_populates="market_share_data"
    )
