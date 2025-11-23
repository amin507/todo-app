from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    color = Column(String(7), default="#3B82F6")  # Hex color
    created_at = Column(DateTime(timezone=True), server_default=func.now())