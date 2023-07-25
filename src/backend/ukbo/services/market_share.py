from datetime import datetime
from typing import Optional

from ukbo import models
from ukbo.extensions import db


def load_market_share_data(entity_type: str = "distributor") -> None:
    """
    Abstract load function.
    """
    # Existing market_share query logic, but without the JSON response
    query = db.session.query(models.Distributor)
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
    entity: models.Distributor,
    market_share: float,
    entity_type: str,
) -> None:
    """
    Abstract insert function.
    """
    if entity_type == "distributor":
        # Create a new entry in the distributor market share table
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
