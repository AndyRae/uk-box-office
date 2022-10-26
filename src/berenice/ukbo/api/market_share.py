import json
import datetime
from flask import Blueprint, jsonify
from flask.wrappers import Response

market_share = Blueprint("marketshare", __name__)

@market_share.route("distributor")
def all() -> Response:
  """
  All time distributor market share
  """
  path = "./data/distributor_market_data.json"
  with open(path) as json_file:
      data = json.load(json_file)

  now = datetime.datetime.now()
  years = list(range(2001, now.year + 1))

  response = jsonify(results=data, years=years)
  response.headers.add("Access-Control-Allow-Origin", "*")

  return response