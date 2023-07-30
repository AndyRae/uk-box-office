"""

This module contains the models for the UKBO database.

The models are used to create the database tables, and to query the database.

"""

from . import models
from .Country import Country
from .CountryMarketShare import CountryMarketShare
from .Distributor import Distributor
from .DistributorMarketShare import DistributorMarketShare
from .Event import Area, Event, State
from .Film import Film, countries, distributors
from .Film_Week import Film_Week
from .Week import Week
