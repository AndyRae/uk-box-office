import pandas as pd
from prophet import Prophet
from ukbo import db, models  # type: ignore


class Forecast:
    """
    Forecast class.

    Uses Prophet to forecast the next 26 weeks of box office data.

    Attributes:
        df: Dataframe of data to model
        prediction: Dataframe of prediction
        prediction_weeks: Number of weeks to predict

    Methods:
        run_forecast: Runs the forecast
        get_data: Fetches data from database to model
        forecast_model: Builds the model
        process_results: Processes the results

    """

    def __init__(self) -> None:
        self.df: pd.DataFrame = None
        self.prediction: pd.DataFrame = None
        self.prediction_weeks = 26

    def run_forecast(self) -> None:
        """
        Runs the forecast

        Returns:
            None
        """
        self.get_data()
        self.forecast_model()
        self.process_results()

    def get_data(self) -> None:
        """
        Fetches data from database to model

        Returns:
            None
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

        Returns:
            None
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
        Add results to database

        Returns:
            None
        """
        self.prediction.apply(self.add_week, axis=1)

    def add_week(self, series: pd.Series) -> None:
        """
        Updates each week of a dataframe with forecast data

        Args:
            series: Series of data to update

        Returns:
            None
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
