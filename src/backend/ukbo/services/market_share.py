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

    if entity_type == "distributors":
        query = query.join(models.distributors)
        query = query.join(models.Distributor)
        query = query.group_by(models.Distributor)
    elif entity_type == "countries":
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
        market_share_percentage = calculate_market_share(total_gross)

        insert_market_share_data(
            year, entity, market_share_percentage, entity_type
        )


def insert_market_share_data(
    year: int,
    entity: Union[models.Distributor, models.Country],
    market_share: float,
    entity_type: str,
) -> None:
    """
    Abstract insert function.
    """
    if entity_type == "distributor":
        market_share_data = models.DistributorMarketShareTable(
            year=year, distributor_id=entity.id, market_share=market_share
        )
    else:
        raise ValueError(
            "Invalid entity type. Supported values are 'distributor' and 'country'."
        )

    db.session.add(market_share_data)
    db.session.commit()


def calculate_market_share(gross: int) -> int:
    """ """
    return 0
