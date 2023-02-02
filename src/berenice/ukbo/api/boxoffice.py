from flask import Blueprint, Response, request, send_file
from ukbo import services

boxoffice = Blueprint("boxoffice", __name__)


@boxoffice.route("/all", methods=["GET"])
def all() -> Response:
    """
    All box office data for a time period.
    If no time period is specified, all data is returned.

    Request arguments are passed to the service layer.

    Request Arguments (optional):
        start (str): Start date to filter by (YYYY-MM-DD).
        end (str): End date to filter by (YYYY-MM-DD).
        page (int): Page number to return.

    Returns:
        JSON response of box office data.
    """
    start = request.args.get("start", None)
    end = request.args.get("end", None)
    page = request.args.get("page", 1)

    return services.boxoffice.all(start, end, int(page))


@boxoffice.route("/topfilms", methods=["GET"])
def top() -> Response:
    """
    Top films for all time.

    Returns:
        JSON response of top films data.
    """
    return services.boxoffice.topfilms()


@boxoffice.route("/summary", methods=["GET"])
def summary() -> Response:
    """
    Summarised box office statistics for a time period grouped by year.
    The time range must be within one year due to SQL limitations.

    Request arguments are passed to the service layer.

    Request Arguments:
        start (str): Start date to filter by (YYYY-MM-DD).
        end (str): End date to filter by (YYYY-MM-DD).
        limit (int): Number of years to go backwards.

    Returns:
        JSON response of box office data grouped by year.
    """
    start = request.args.get("start", None)
    end = request.args.get("end", None)
    limit = request.args.get("limit", 1)
    if None in [start, end, limit]:
        return Response('{"error": "Missing arguments"}', status=400)
    return services.boxoffice.summary(start, end, int(limit))


@boxoffice.route("/previous", methods=["GET"])
def previous() -> Response:
    """
    Get previous year box office statistics for a time period.

    Request arguments are passed to the service layer.

    Request Arguments:
        start (str): Start date to filter by (YYYY-MM-DD).
        end (str): End date to filter by (YYYY-MM-DD).

    Returns:
        JSON response of box office data.
    """
    start = request.args.get("start", None)
    end = request.args.get("end", None)
    if None in [start, end]:
        return Response('{"error": "Missing arguments"}', status=400)
    return services.boxoffice.previous(start, end)


@boxoffice.route("previousyear", methods=["GET"])
def previous_year() -> Response:
    """
    Get only previous year box office statistics for a time period.

    Request arguments are passed to the service layer.

    Request Arguments:
        start (str): Start date to filter by (YYYY-MM-DD).
        end (str): End date to filter by (YYYY-MM-DD).

    Returns:
        JSON response of box office data.
    """
    start = request.args.get("start", None)
    end = request.args.get("end", None)
    if None in [start, end]:
        return Response('{"error": "Missing arguments"}', status=400)
    return services.boxoffice.previous_year(start, end)


@boxoffice.route("/topline", methods=["GET"])
def topline() -> Response:
    """
    Get topline box office data for a time period.
    Topline box office data is just the ``Week`` model data.

    Request arguments are passed to the service layer.

    Request Arguments:
        start (str): Start date to filter by (YYYY-MM-DD).
        end (str): End date to filter by (YYYY-MM-DD).
    Optional Request Arguments:
        page (int): Page number to return.

    Returns:
        JSON response of box office data.
    """
    start = request.args.get("start", None)
    end = request.args.get("end", None)
    page = request.args.get("page", 1)
    if None in [start, end]:
        return Response('{"error": "Missing arguments"}', status=400)
    return services.boxoffice.topline(start, end, int(page))


@boxoffice.route("/archive", methods=["GET"])
def archive() -> Response:
    """
    Archive export csv file of box office data.

    Returns:
        Send file response of archive export csv.
    """
    return send_file("../data/archive_export.csv", as_attachment=True)
