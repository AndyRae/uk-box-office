from typing import List, Optional


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


class QueryFilter:
    """
    Class representing a filter based on metadata.

    Attributes:
        distributor_id (Optional[int]): ID of the distributor to filter by.
        country_ids (Optional[List[int]]): IDs of the countries to filter by.
        min_year (Optional[int]): Low of the year number to filter by.
        max_year (Optional[int]): High of the year number to filter by.
        min_box (Optional[int]): Low of the box office number to filter by.
        max_box (Optional[int]): High of the box office number to filter by.
        sort_asc (Optional[str]): Field to sort ascending by.
        sort_desc (Optional[str]): Field to sort descending by.
    """

    def __init__(
        self,
        distributor_id: Optional[List[int]] = None,
        country_ids: Optional[List[int]] = None,
        min_year: Optional[int] = None,
        max_year: Optional[int] = None,
        min_box: Optional[int] = None,
        max_box: Optional[int] = None,
        sort_asc: Optional[str] = None,
        sort_desc: Optional[str] = None,
    ):
        self.distributor_id = distributor_id
        self.country_ids = country_ids
        self.min_year = min_year
        self.max_year = max_year
        self.min_box = min_box
        self.max_box = max_box
        self.sort_asc = sort_asc
        self.sort_desc = sort_desc
