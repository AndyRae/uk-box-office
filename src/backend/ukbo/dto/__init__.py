"""

This package contains the DTOs for the UKBO.

DTOs are used to serialize the data that is sent to the API.

"""

from .CountrySchema import CountrySchema
from .DistributorSchema import DistributorSchema
from .EventSchema import EventSchema
from .FilmSchema import FilmSchema, FilmSchemaStrict, FilmSchemaValues
from .FilmWeekSchema import FilmWeekSchema, FilmWeekSchemaArchive
from .WeekSchema import WeekSchema
