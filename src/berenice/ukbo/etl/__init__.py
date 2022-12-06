"""

The ETL package contains the code for the ETL process of the UK Box Office data.

The ETL process is broken down into 4 steps:

Extract:
  The extract step is responsible for downloading the data from the source website.

Transform
  The transform step is responsible for cleaning the data and converting it into a format that is suitable for loading into the database.

Load
  The load step is responsible for loading the data into the database.

Tasks
  The tasks step is responsible for running the ETL process on a schedule.

Commands
  The commands step is responsible for running the ETL process on demand through the command line.

"""

from . import commands, extract, load, tasks, transform
