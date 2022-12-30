def test_root(client):
    response = client.get("/")
    assert b"`" in response.data
    assert response.status_code == 200
