from tests.conftest import auth_headers, register


def test_register_returns_token_and_user(client):
    resp = register(client)
    assert resp.status_code == 201
    data = resp.json()
    assert data["token_type"] == "bearer"
    assert data["access_token"]
    assert data["user"]["email"] == "a@example.com"
    assert isinstance(data["user"]["id"], int)


def test_register_duplicate_email_fails(client):
    register(client)
    resp = register(client)
    assert resp.status_code == 400


def test_login_success(client):
    register(client)
    resp = client.post(
        "/api/auth/login",
        json={"email": "a@example.com", "password": "secret123"},
    )
    assert resp.status_code == 200
    assert resp.json()["access_token"]


def test_login_wrong_password(client):
    register(client)
    resp = client.post(
        "/api/auth/login",
        json={"email": "a@example.com", "password": "wrongpass"},
    )
    assert resp.status_code == 401


def test_me_returns_current_user(client):
    headers = auth_headers(client)
    resp = client.get("/api/auth/me", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["email"] == "a@example.com"


def test_me_requires_auth(client):
    resp = client.get("/api/auth/me")
    assert resp.status_code == 401
