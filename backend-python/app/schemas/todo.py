from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.category import Category

class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: str = "medium"
    due_date: Optional[datetime] = None
    category_id: Optional[int] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(TodoBase):
    title: Optional[str] = None

class Todo(TodoBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: Optional[Category] = None
    
    class Config:
        from_attributes = True

class TodoListResponse(BaseModel):
    data: list[Todo]
    pagination: dict