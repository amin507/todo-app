import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import get_db, Base

# Test database
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost:5432/test_tododb"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="function")
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_create_todo(test_db):
    response = client.post(
        "/api/todos",
        json={
            "title": "Test Todo",
            "description": "Test Description",
            "priority": "high"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["completed"] == False

def test_get_todos(test_db):
    response = client.get("/api/todos")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "pagination" in data