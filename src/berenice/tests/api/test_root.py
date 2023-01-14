def test_root(client):
    """
    Test the root endpoint.

    Args:
        client: Flask test client
    """
    response = client.get("/")
    assert response.status_code == 200
    assert b"`" in response.data
