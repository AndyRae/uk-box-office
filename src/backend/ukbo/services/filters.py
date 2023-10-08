from typing import List, Optional

import flask_sqlalchemy
from flask import jsonify
from sqlalchemy import func
from ukbo import models


class TimeFilter:
    """
    Class representing a filter based on a time period.

    Attributes:
        start (Optional[str]): Start date to filter by (YYYY-MM-DD).
        end (Optional[str]): End date to filter by (YYYY-MM-DD).
    """

    def __init__(self, start: Optional[str] = None, end: Optional[str] = None):
        self.start = start
        self.end = end


class SortFilter:
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

    def add_filter(
        self, query: flask_sqlalchemy.query.Query
    ) -> flask_sqlalchemy.query.Query:
        """ """
        if self.sort is not None:
            sort_option = self.sorting_options.get(self.sort)
            if sort_option is None:
                # Handle invalid sorting option
                return jsonify(error="Invalid sorting option"), 400
            # Join the table when sorting by gross
            query = query.join(models.Film_Week).group_by(models.Film.id)
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
        sort: Optional[str] = None,
    ):
        self.distributor_ids = distributor_ids
        self.country_ids = country_ids
        self.min_year = min_year
        self.max_year = max_year
        self.min_box = min_box
        self.max_box = max_box
        self.sort = sort
