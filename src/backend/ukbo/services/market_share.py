from datetime import datetime
from typing import Optional, Union

from sqlalchemy.sql import func
from ukbo import models
from ukbo.extensions import db


def load_market_share_data(entity_type: str = "distributor") -> None:
    """
    Abstract load function.
    """
    query = db.session.query(
        func.extract("year", models.Film_Week.date),
        models.Distributor,
        func.sum(models.Film_Week.week_gross),
    )
    query = query.join(models.Film)

    if entity_type == "distributor":
        query = query.join(models.distributors)
        query = query.join(models.Distributor)
        query = query.group_by(models.Distributor)
    elif entity_type == "country":
        query = query.join(models.countries)
        query = query.join(models.Country)
        query = query.group_by(models.Country)
    else:
        raise ValueError("Invalid entity type.")

    query = query.group_by(func.extract("year", models.Film_Week.date))
    query = query.order_by(func.extract("year", models.Film_Week.date).desc())

    data = query.all()

    if not data:
        return None

    # Perform calculations and insert the results into the denormalized table
    for row in data:
        year, entity, total_gross = row
        market_share_percentage = _calculate_market_share(
            total_gross, str(year)
        )

        _insert_market_share_data(
            int(year),
            entity,
            market_share_percentage,
            total_gross,
            entity_type,
        )


def _insert_market_share_data(
    year: int,
    entity: Union[models.Distributor, models.Country],
    market_share: float,
    gross: int,
    entity_type: str,
) -> None:
    """
    Abstract insert function.
    """
    if entity_type == "distributor":
        market_share_data = models.DistributorMarketShare(
            year=year,
            distributor_id=entity.id,
            market_share=market_share,
            gross=gross,
        )
    elif entity_type == "country":
        market_share_data = models.DistributorMarketShare(
            year=year,
            distributor_id=entity.id,
            market_share=market_share,
            gross=gross,
        )
    else:
        raise ValueError(
            "Invalid entity type. Supported values are 'distributor' and 'country'."
        )

    db.session.add(market_share_data)
    db.session.commit()


def _calculate_market_share(gross: int, year: str) -> float:
    """
    Calculate the market share a given gross has for a year.

    """
    total_gross = (
        db.session.query(func.sum(models.Week.week_gross))
        .filter(func.extract("year", models.Week.date) == year)
        .scalar()
    )

    return 0.0 if total_gross is None else (gross / total_gross) * 100.0


def clear_year(year: int) -> None:
    """
    Deletes a given year of market share.
    TODO: Add second table clear.
    """
    data = (
        db.session.query(models.DistributorMarketShare)
        .filter(models.DistributorMarketShare.year == year)
        .all()
    )
    for i in data:
        db.session.delete(i)

    db.session.commit()
