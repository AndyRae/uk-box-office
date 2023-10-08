from typing import List, Optional

import flask_sqlalchemy
from flask import jsonify
from sqlalchemy import extract, func
from ukbo import models


def apply_filters(query, *filters):
    """
    Apply a list of filters to a SQLAlchemy query.

    This function takes a SQLAlchemy query object and a variable number of filter objects.
    It applies each filter to the query and, if any of the filters require a join with
    the 'models.Film_Week' table, it performs the join before applying the filters.

    Args:
        query (flask_sqlalchemy.query.Query): The SQLAlchemy query to which filters will be applied.
        *filters: Variable number of filter objects. Each filter must implement the
                  'requires_join' and 'add_filter' methods.

    Returns:
        flask_sqlalchemy.query.Query: The modified SQLAlchemy query with filters applied.
    """
    requires_join = any(filter.requires_join() for filter in filters)

    if requires_join:
        query = query.join(models.Film_Week).group_by(models.Film.id)

    for filter in filters:
        query = filter.add_filter(query)

    return query


class Filter:
    """
    Base class for filters.
    """

    def add_filter(
        self, query: flask_sqlalchemy.query.Query
    ) -> flask_sqlalchemy.query.Query:
        raise NotImplementedError(
            "Subclasses must implement add_filter method"
        )


class TimeFilter(Filter):
    """
    Class representing a filter based on a time period.

    Attributes:
        start (Optional[str]): Start date to filter by (YYYY-MM-DD).
        end (Optional[str]): End date to filter by (YYYY-MM-DD).
    """

    def __init__(self, start: Optional[str] = None, end: Optional[str] = None):
        self.start = start
        self.end = end


class SortFilter(Filter):
    """
    Class representing a sort filter.

    Attributes:
        sort: (Optional[str]): The field and type to sort by.
    """

    def __init__(self, sort: Optional[str] = None) -> None:
        self.sort = sort
        self.sorting_options = {
            "asc_name": models.Film.name.asc(),
            "desc_name": models.Film.name.desc(),
            "asc_gross": func.max(models.Film_Week.total_gross).asc(),
            "desc_gross": func.max(models.Film_Week.total_gross).desc(),
        }

    def requires_join(self) -> bool:
        """
        Determines if this film requires the join.
        """
        return self.sort in {"asc_gross", "desc_gross"}

    def add_filter(
        self, query: flask_sqlalchemy.query.Query
    ) -> flask_sqlalchemy.query.Query:
        """
        Adds filters and sorting to a query if they are present.

        Args:
            query: The query that will be executed.

        Returns: The query with filters applied.
        """
        if self.sort is not None:
            sort_option = self.sorting_options.get(self.sort)
            if sort_option is None:
                # Handle invalid sorting option
                return jsonify(error="Invalid sorting option"), 400
            query = query.order_by(sort_option)
        else:
            query = query.order_by(models.Film.name.asc())
        return query


class QueryFilter:
    """
    Class representing a filter based on metadata.

    Attributes:
        distributor_ids (Optional[int]): IDs of the distributor to filter by.
        country_ids (Optional[List[int]]): IDs of the countries to filter by.
        min_year (Optional[int]): Low of the year number to filter by.
        max_year (Optional[int]): High of the year number to filter by.
        min_box (Optional[int]): Low of the box office number to filter by.
        max_box (Optional[int]): High of the box office number to filter by.
        sort (Optional[str]): Field / order to sort by.
    """

    def __init__(
        self,
        distributor_ids: Optional[List[int]] = None,
        country_ids: Optional[List[int]] = None,
        min_year: Optional[int] = None,
        max_year: Optional[int] = None,
        min_box: Optional[int] = None,
        max_box: Optional[int] = None,
    ):
        self.distributor_ids = distributor_ids
        self.country_ids = country_ids
        self.min_year = min_year
        self.max_year = max_year
        self.min_box = min_box
        self.max_box = max_box

    def requires_join(self) -> bool:
        """
        Determine if this filter requires a join.
        """
        return (
            self.min_year is not None
            or self.max_year is not None
            or self.min_box is not None
            or self.max_box is not None
        )

    def add_filter(
        self, query: flask_sqlalchemy.query.Query
    ) -> flask_sqlalchemy.query.Query:
        """
        Adds filters and sorting to a query if they are present.

        Args:
            query: The query that will be executed.

        Returns: The query with filters applied.
        """
        if self.distributor_ids is not None:
            query = query.join(models.distributors).join(models.Distributor)
            query = query.filter(
                models.Distributor.id.in_(self.distributor_ids)
            )

        if self.country_ids is not None:
            query = query.join(models.countries).join(models.Country)
            query = query.filter(models.Country.id.in_(self.country_ids))

        if self.min_year is not None:
            query = query.filter(
                extract("year", models.Film_Week.date) >= self.min_year
            )

        if self.max_year is not None:
            query = query.filter(
                extract("year", models.Film_Week.date) <= self.max_year
            )

        if self.min_box is not None:
            query = query.having(
                func.max(models.Film_Week.total_gross) >= self.min_box
            )

        if self.max_box is not None:
            query = query.having(
                func.max(models.Film_Week.total_gross) <= self.max_box
            )

        return query
