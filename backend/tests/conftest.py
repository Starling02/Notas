import os
import tempfile

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Forzamos una SECRET_KEY estable para los tests antes de importar la app.
os.environ.setdefault("SECRET_KEY", "test-secret-key")

from app.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture()
def client():
    """Cliente con una base de datos SQLite en archivo temporal aislada por test."""
    db_fd, db_path = tempfile.mkstemp(suffix=".db")
    os.close(db_fd)

    engine = create_engine(
        f"sqlite:///{db_path}",
        connect_args={"check_same_thread": False},
    )
    TestingSessionLocal = sessionmaker(
        autocommit=False, autoflush=False, bind=engine
    )
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()
    engine.dispose()
    try:
        os.remove(db_path)
    except OSError:
        pass


def register(client, email="a@example.com", password="secret123"):
    resp = client.post(
        "/api/auth/register", json={"email": email, "password": password}
    )
    return resp


def auth_headers(client, email="a@example.com", password="secret123"):
    resp = register(client, email, password)
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
