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
        year_low (Optional[int]): Low of the year number to filter by.
        year_high (Optional[int]): High of the year number to filter by.
        box_low (Optional[int]): Low of the box office number to filter by.
        box_heigh (Optional[int]): High of the box office number to filter by.
    """

    def __init__(
        self,
        distributor_id: Optional[List[int]] = None,
        country_ids: Optional[List[int]] = None,
        year_low: Optional[int] = None,
        year_high: Optional[int] = None,
        box_low: Optional[int] = None,
        box_high: Optional[int] = None,
    ):
        self.distributor_id = distributor_id
        self.country_ids = country_ids
        self.year_low = year_low
        self.year_high = year_high
        self.box_low = box_low
        self.box_high = box_high
