from typing import Optional, Union

from flask import Response, abort, jsonify
from sqlalchemy.sql import func, text
from ukbo import models, services
from ukbo.dto import DistributorSchema
from ukbo.extensions import db


def get_distributor(year: Optional[str] = None) -> Response:
    """
    Gets distributor market share data.

    Args:
        year (str, optional): The year for which to retrieve the market share data.
        If not provided, all years are included.

    Returns:
        Returns (JSON): List of distributors and their market share.
    """
    query = db.session.query(
        models.DistributorMarketShare.year,
        models.Distributor,
        models.DistributorMarketShare.market_share,
        func.sum(models.DistributorMarketShare.gross),
    )

    query = query.join(models.Distributor)

    if year is not None:
        query = query.filter(models.DistributorMarketShare.year == year)

    # Group by distributor and year, and calculate the total market share for each distributor in each year
    query = query.group_by(
        models.DistributorMarketShare.year,
        models.Distributor,
        models.DistributorMarketShare.market_share,
    ).filter(models.DistributorMarketShare.year > 2001)

    # Filter to get only the top distributors with market share greater than 1%
    query = query.having(models.DistributorMarketShare.market_share > 0.1)

    data = query.all()

    if data is None:
        abort(404)

    distributor_schema = DistributorSchema()  # type: ignore

    # Prepare the response data
    distributor_data = {}  # type: ignore
    for entry in data:
        year = entry[0]
        distributor = entry[1]
        market_share = entry[2]
        gross = entry[3]

        distributor_dict = distributor_data.setdefault(
            distributor.id,
            {"distributor": distributor_schema.dump(distributor), "years": []},
        )

        distributor_dict["years"].append(
            {
                "year": year,
                "gross": gross,
                "market_share": market_share,
            }
        )

    response_data = list(distributor_data.values())

    return jsonify(results=response_data)


def load_market_share_data(
    year: Optional[int], entity_type: str = "distributor"
) -> None:
    """
    Abstract load function to load market share data into the corresponding table.

    Args:
        entity_type (str, optional): The type of entity for which to load market share data.
            Possible values are "distributor" and "country". Defaults to "distributor".

    Raises:
        ValueError: If the provided entity_type is not one of the supported values.

    Returns:
        None

    Notes:
        - This function loads market share data into the respective table based on the entity_type.
        - It calculates the market share for distributors or countries for each year and stores the results in the database.
        - If entity_type is not provided, the function defaults to loading data for distributors.

    Example:
        To load market share data for countries:
        >>> load_market_share_data(entity_type="country")

        To load market share data for distributors (default):
        >>> load_market_share_data()
    """
    if entity_type == "distributor":
        data = services.distributor.market_share(year)
    elif entity_type == "country":
        data = services.country.market_share(year)
    else:
        raise ValueError("Invalid entity type.")

    if not data:
        return None

    # Perform calculations and insert the results into the denormalized table
    for row in data:
        m_year, entity, total_gross = row
        market_share_percentage = _calculate_market_share(
            total_gross, str(m_year)
        )

        _insert_market_share_data(
            int(m_year),
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
    Abstract insert function to insert market share data into the corresponding table.

    Args:
        year (int): The year for which the market share data is being inserted.
        entity (Union[models.Distributor, models.Country]): The entity (distributor or country)
            for which the market share data is being inserted.
        market_share (float): The market share percentage for the specified entity and year.
        gross (int): The total gross amount for the specified entity and year.
        entity_type (str): The type of entity for which the data is being inserted.
            Possible values are "distributor" and "country".

    Raises:
        ValueError: If the provided entity_type is not one of the supported values.

    Returns:
        None

    Example:
        To insert market share data for a distributor:
        >>> distributor = get_distributor_by_id(1)
        >>> _insert_market_share_data(2023, distributor, 15.2, 1000000, "distributor")
    """
    if entity_type == "distributor":
        market_share_data = models.DistributorMarketShare(
            year=year,
            distributor_id=entity.id,
            market_share=market_share,
            gross=gross,
        )
    elif entity_type == "country":
        market_share_data = models.CountryGroupMarketShare(
            year=year,
            # country_id=entity.id,
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
    Calculate the market share percentage for a given gross in a specific year.

    Args:
        gross (int): The gross amount of a specific entity (e.g., distributor or country)
            for the given year.
        year (str): The year for which the market share percentage is being calculated.

    Returns:
        float: The market share percentage of the specified gross for the given year.

    Example:
        To calculate the market share for a distributor's gross in the year 2023:
        >>> distributor_gross = 2000000
        >>> market_share_percentage = _calculate_market_share(distributor_gross, "2023")
        >>> print(market_share_percentage)
        12.34
    """
    total_gross = (
        db.session.query(func.sum(models.Week.week_gross))
        .filter(func.extract("year", models.Week.date) == year)
        .scalar()
    )

    return 0.0 if total_gross is None else (gross / total_gross) * 100.0


def delete_data(year: Optional[int]) -> None:
    """
    Deletes market share data in the database.
    If no year is provided, the entire db is deleted.

    Args:
        year (int) (optional): The year for which the market share table is being deleted.

    Returns:
        None
    """
    # Distributor market share
    query = db.session.query(models.DistributorMarketShare)
    if year:
        query = query.filter(models.DistributorMarketShare.year == year)
    data = query.all()

    for i in data:
        db.session.delete(i)

    # Country Market Share
    query = db.session.query(models.CountryGroupMarketShare)
    if year:
        query = query.filter(models.CountryGroupMarketShare.year == year)
    data = query.all()

    for i in data:
        db.session.delete(i)

    db.session.commit()
