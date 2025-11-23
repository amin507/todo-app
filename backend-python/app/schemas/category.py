from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CategoryBase(BaseModel):
    name: str
    color: Optional[str] = "#3B82F6"

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True