from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db import models
from app.db.session import get_db
from app.core import security
from app.api import schemas, deps

router = APIRouter()

@router.post("/auth/register", response_model=schemas.UserOut)
def register_user(user_in: schemas.UserRegister, db: Session = Depends(get_db)):
    """
    Onboard a brand new Organization and create its initial Admin User.
    Enforces multi-tenant workspace separation.
    """
    # Check email duplicate
    existing_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email identifier already exists."
        )
    
    # Check organization name duplicate
    existing_org = db.query(models.Organization).filter(
        models.Organization.name == user_in.organization_name
    ).first()
    if existing_org:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An organization workspace under this name already exists."
        )
        
    # Create Tenant Organization
    org = models.Organization(name=user_in.organization_name)
    db.add(org)
    db.flush()  # Obtain the assigned UUID without committing the transaction

    # Create Owner / Admin User
    hashed_p = security.get_password_hash(user_in.password)
    user = models.User(
        email=user_in.email,
        hashed_password=hashed_p,
        full_name=user_in.full_name,
        role="admin",  # Tenant root owner
        organization_id=org.id
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Log initial audit setup event
    audit = models.AuditLog(
        organization_id=org.id,
        actor_id=user.id,
        action="TENANT_PROVISIONED",
        details={"organization_name": org.name, "admin_email": user.email}
    )
    db.add(audit)
    db.commit()

    return user

@router.post("/login/access-token", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    Standard OAuth2 / password login router returning JWT access token
    """
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username email or password."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your user profile has been suspended."
        )
        
    # Check organization status
    if not user.organization or not user.organization.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your organization workspace is inactive."
        )

    # Trigger audit login log
    audit = models.AuditLog(
        organization_id=user.organization_id,
        actor_id=user.id,
        action="USER_LOGIN"
    )
    db.add(audit)
    db.commit()

    token = security.create_access_token(subject=user.id)
    return schemas.Token(access_token=token)

@router.get("/auth/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(deps.get_current_active_user)):
    """
    Return authenticated user and active workspace details
    """
    return current_user
