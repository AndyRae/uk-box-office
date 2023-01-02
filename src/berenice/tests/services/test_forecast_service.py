import datetime

import pandas as pd
import pytest
from ukbo import models, services


def test_init(app, add_test_week):
    with app.app_context():
        forecast = services.forecast.Forecast()
        assert forecast.df is None
        assert forecast.prediction is None
        assert forecast.prediction_weeks == 26


def test_run_forecast(app, add_test_weeks):
    with app.app_context():
        forecast = services.forecast.Forecast()
        forecast.run_forecast()
        assert forecast.df is not None
        assert forecast.prediction is not None
        assert forecast.prediction.shape[0] == 36
        assert forecast.prediction["yhat"].sum() > 0


def test_get_data(app, add_test_week):
    with app.app_context():
        forecast = services.forecast.Forecast()
        forecast.get_data()
        assert forecast.df is not None
        assert forecast.df.shape[0] == 1
        assert forecast.df["y"].sum() == 1000


def test_forecast_model(app, add_test_weeks):
    with app.app_context():
        forecast = services.forecast.Forecast()
        forecast.get_data()
        forecast.forecast_model()
        assert forecast.prediction is not None
        assert forecast.prediction.shape[0] == 36
        assert forecast.prediction["yhat"].sum() > 0


def test_process_results(app, add_test_week):
    with app.app_context():
        forecast = services.forecast.Forecast()

        forecast.prediction = pd.DataFrame(
            {
                "ds": pd.date_range("2022-01-01", periods=26),
                "yhat": [1000] * 26,
                "yhat_lower": [900] * 26,
                "yhat_upper": [1100] * 26,
            }
        )
        forecast.process_results()

        date = datetime.datetime(2022, 1, 1)

        week = models.Week.query.filter_by(date=date).first()

        assert week.forecast_high == 1100
        assert week.forecast_medium == 1000
        assert week.forecast_low == 900


def test_add_week(app, add_test_week):
    with app.app_context():
        forecast = services.forecast.Forecast()

        date = datetime.datetime(2022, 1, 1)

        series = pd.Series(
            {
                "ds": date,
                "yhat": 1000,
                "yhat_lower": 900,
                "yhat_upper": 1100,
            }
        )

        forecast.add_week(series)

        week = models.Week.query.filter_by(date=date).first()

        assert week.forecast_high == 1100
        assert week.forecast_medium == 1000
        assert week.forecast_low == 900
