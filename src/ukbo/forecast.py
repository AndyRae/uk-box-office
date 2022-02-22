import pandas as pd
from prophet import Prophet

from ukbo import db, models


class Forecast:
    def __init__(self) -> None:
        self.df: pd.DataFrame = None
        self.prediction: pd.DataFrame = None
        self.prediction_weeks = 26

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
            [i.as_df() for i in data], columns=["ds", "y", "releases"]
        )
        df.drop(columns=["releases"], inplace=True)

        self.df = df

    def forecast_model(self) -> None:
        """
        Builds the model
        """
        m = Prophet().fit(self.df)

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
