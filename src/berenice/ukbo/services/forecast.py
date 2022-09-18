import datetime

import pandas as pd
from flask import Response, jsonify
from prophet import Prophet
from ukbo import db, models  # type: ignore

from . import utils


class Forecast:
    def __init__(self) -> None:
        self.df: pd.DataFrame = None
        self.prediction: pd.DataFrame = None
        self.prediction_weeks = 26

    def get(self) -> Response:
        """
        Get forecasted data
        """
        now = datetime.datetime.now()
        last_year = datetime.timedelta(days=365)
        start_date = now - last_year
        end_date = now + last_year

        data = utils.get_box_office_data(models.Week, start_date, end_date)
        return jsonify(data=[ix.as_dict() for ix in data])

    def run_forecast(self) -> None:
        """
        Wrapper for model
        """
        self.get_data()
        self.forecast_model()
        self.process_results()

    def get_data(self) -> None:
        """
        Fetches data from database to model
        """
        query = db.session.query(models.Week).order_by(models.Week.date.asc())
        data = query.all()

        df = pd.DataFrame(
            [i.as_df() for i in data],
            columns=["ds", "y", "weekend_gross", "releases", "cinemas"],
        )
        df.drop(columns=["weekend_gross", "releases", "cinemas"], inplace=True)

        self.df = df

    def forecast_model(self) -> None:
        """
        Builds the model
        """
        holidays = pd.DataFrame(
            {
                "holiday": ["lockdown1", "interval", "lockdown2"],
                "ds": pd.to_datetime(
                    ["2020-03-16", "2020-07-04", "2020-11-05"]
                ),
                "lower_window": [0, 0, 0],
                "upper_window": [110, 12, 193],
            }
        )
        changepoint_range = 0.963
        m = Prophet(
            holidays=holidays,
            changepoint_range=changepoint_range,
            weekly_seasonality=True,
        ).fit(self.df)

        future = m.make_future_dataframe(
            periods=self.prediction_weeks, freq="w"
        )

        self.prediction = m.predict(future)

    def process_results(self) -> None:
        """
        Add results to db
        """
        self.prediction.apply(self.add_week, axis=1)

    def add_week(self, series: pd.Series) -> None:
        """
        Updates each week of a dataframe with forecast data
        """

        week = models.Week.query.filter_by(date=series["ds"]).first()

        if week and series["ds"] == week.date:
            week.forecast_high = series["yhat_upper"]
            week.forecast_medium = series["yhat"]
            week.forecast_low = series["yhat_lower"]

            db.session.commit()
            return None

        new_week = {
            "date": series["ds"],
            "forecast_high": series["yhat_upper"],
            "forecast_medium": series["yhat"],
            "forecast_low": series["yhat_lower"],
        }

        new = models.Week(**new_week)
        db.session.add(new)
        db.session.commit()
