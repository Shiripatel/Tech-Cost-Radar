import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.session import Base, get_db
from app.db import models

# Input SQLite connection for tests
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables in test database
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Override FastAPI get_db dependency
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_db():
    # Clear tables before each test
    db = TestingSessionLocal()
    db.query(models.AuditLog).delete()
    db.query(models.User).delete()
    db.query(models.Organization).delete()
    db.commit()
    db.close()

def test_register_organization_and_admin():
    """
    Verify creating a new organization and admin user succeeds.
    """
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "cfo@enterprise.com",
            "password": "securepassword123",
            "full_name": "Shirish Patel",
            "organization_name": "Enterprise Inc"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "cfo@enterprise.com"
    assert data["full_name"] == "Shirish Patel"
    assert data["role"] == "admin"
    assert "id" in data
    assert "organization_id" in data

    # Verify database state
    db = TestingSessionLocal()
    org = db.query(models.Organization).filter(models.Organization.name == "Enterprise Inc").first()
    assert org is not None
    assert org.is_active is True
    
    user = db.query(models.User).filter(models.User.email == "cfo@enterprise.com").first()
    assert user is not None
    assert user.organization_id == org.id

    # Verify audit log recorded "TENANT_PROVISIONED"
    audit = db.query(models.AuditLog).filter(models.AuditLog.organization_id == org.id).first()
    assert audit is not None
    assert audit.action == "TENANT_PROVISIONED"
    assert audit.details["organization_name"] == "Enterprise Inc"
    db.close()

def test_register_duplicate_email():
    """
    Verify registering duplicate email fails.
    """
    # First sign up
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "cfo@enterprise.com",
            "password": "password123",
            "organization_name": "Enterprise Inc"
        }
    )

    # Second sign up with same email
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "cfo@enterprise.com",
            "password": "anotherpassword",
            "organization_name": "Another Inc"
        }
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_login_success_and_jwt():
    """
    Verify login exchange returns a valid token and logs audit event.
    """
    # Create user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "cfo@enterprise.com",
            "password": "securepassword123",
            "organization_name": "Enterprise Inc"
        }
    )

    # Login
    response = client.post(
        "/api/v1/login/access-token",
        data={
            "username": "cfo@enterprise.com",
            "password": "securepassword123"
        }
    )
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

    # Verify auth/me using JWT token
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}
    me_response = client.get("/api/v1/auth/me", headers=headers)
    assert me_response.status_code == 200
    assert me_response.json()["email"] == "cfo@enterprise.com"

    # Verify login audit trail
    db = TestingSessionLocal()
    login_audit = db.query(models.AuditLog).filter(models.AuditLog.action == "USER_LOGIN").first()
    assert login_audit is not None
    db.close()

def test_login_invalid_credentials():
    """
    Verify wrong password returns 400.
    """
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "cfo@enterprise.com",
            "password": "securepassword123",
            "organization_name": "Enterprise Inc"
        }
    )

    response = client.post(
        "/api/v1/login/access-token",
        data={
            "username": "cfo@enterprise.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 400
    assert "Incorrect" in response.json()["detail"]
