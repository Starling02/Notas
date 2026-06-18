from tests.conftest import auth_headers


def _create_note(client, headers, **overrides):
    body = {
        "title": "My note",
        "content": "Hello world",
        "tags": ["work", "todo"],
        "color": "#ff0000",
        "pinned": False,
    }
    body.update(overrides)
    return client.post("/api/notes", json=body, headers=headers)


def test_create_note(client):
    headers = auth_headers(client)
    resp = _create_note(client, headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "My note"
    assert data["tags"] == ["work", "todo"]
    assert data["color"] == "#ff0000"
    assert data["pinned"] is False
    assert "created_at" in data and "updated_at" in data


def test_list_notes_only_own(client):
    headers = auth_headers(client)
    _create_note(client, headers, title="n1")
    _create_note(client, headers, title="n2")
    resp = client.get("/api/notes", headers=headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 2


def test_get_note(client):
    headers = auth_headers(client)
    note_id = _create_note(client, headers).json()["id"]
    resp = client.get(f"/api/notes/{note_id}", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["id"] == note_id


def test_update_note_partial(client):
    headers = auth_headers(client)
    note_id = _create_note(client, headers).json()["id"]
    resp = client.put(
        f"/api/notes/{note_id}",
        json={"title": "Updated", "pinned": True},
        headers=headers,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "Updated"
    assert data["pinned"] is True
    # content no enviado debe permanecer igual
    assert data["content"] == "Hello world"


def test_update_note_tags(client):
    headers = auth_headers(client)
    note_id = _create_note(client, headers).json()["id"]
    resp = client.put(
        f"/api/notes/{note_id}",
        json={"tags": ["new"]},
        headers=headers,
    )
    assert resp.status_code == 200
    assert resp.json()["tags"] == ["new"]


def test_delete_note(client):
    headers = auth_headers(client)
    note_id = _create_note(client, headers).json()["id"]
    resp = client.delete(f"/api/notes/{note_id}", headers=headers)
    assert resp.status_code == 204
    # ya no existe
    assert client.get(f"/api/notes/{note_id}", headers=headers).status_code == 404


def test_search_q(client):
    headers = auth_headers(client)
    _create_note(client, headers, title="grocery list", content="milk eggs")
    _create_note(client, headers, title="meeting", content="standup notes")
    resp = client.get("/api/notes?q=grocery", headers=headers)
    assert resp.status_code == 200
    results = resp.json()
    assert len(results) == 1
    assert results[0]["title"] == "grocery list"


def test_filter_by_tag(client):
    headers = auth_headers(client)
    _create_note(client, headers, title="a", tags=["x"])
    _create_note(client, headers, title="b", tags=["y"])
    resp = client.get("/api/notes?tag=y", headers=headers)
    assert resp.status_code == 200
    results = resp.json()
    assert len(results) == 1
    assert results[0]["title"] == "b"


def test_user_cannot_access_others_note(client):
    headers_a = auth_headers(client, email="alice@example.com")
    headers_b = auth_headers(client, email="bob@example.com")
    note_id = _create_note(client, headers_a, title="alice secret").json()["id"]

    # bob no la ve en su lista
    assert client.get("/api/notes", headers=headers_b).json() == []
    # bob no la puede leer
    assert client.get(f"/api/notes/{note_id}", headers=headers_b).status_code == 404
    # bob no la puede editar
    assert (
        client.put(
            f"/api/notes/{note_id}", json={"title": "hacked"}, headers=headers_b
        ).status_code
        == 404
    )
    # bob no la puede borrar
    assert (
        client.delete(f"/api/notes/{note_id}", headers=headers_b).status_code
        == 404
    )


def test_notes_require_auth(client):
    assert client.get("/api/notes").status_code == 401
    assert client.post("/api/notes", json={"title": "x"}).status_code == 401
