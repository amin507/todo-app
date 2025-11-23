from sqlalchemy.orm import Session
from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoUpdate
from typing import List, Optional
from sqlalchemy import and_, or_

def get_todo(db: Session, todo_id: int) -> Optional[Todo]:
    return db.query(Todo).filter(Todo.id == todo_id).first()

def get_todos(
    db: Session, 
    skip: int = 0, 
    limit: int = 10,
    search: Optional[str] = None,
    completed: Optional[bool] = None,
    category_id: Optional[int] = None,
    priority: Optional[str] = None
) -> List[Todo]:
    query = db.query(Todo)
    
    # Apply filters
    if search:
        query = query.filter(Todo.title.ilike(f"%{search}%"))
    if completed is not None:
        query = query.filter(Todo.completed == completed)
    if category_id:
        query = query.filter(Todo.category_id == category_id)
    if priority:
        query = query.filter(Todo.priority == priority)
    
    return query.offset(skip).limit(limit).all()

def get_todos_count(
    db: Session,
    search: Optional[str] = None,
    completed: Optional[bool] = None,
    category_id: Optional[int] = None,
    priority: Optional[str] = None
) -> int:
    query = db.query(Todo)
    
    if search:
        query = query.filter(Todo.title.ilike(f"%{search}%"))
    if completed is not None:
        query = query.filter(Todo.completed == completed)
    if category_id:
        query = query.filter(Todo.category_id == category_id)
    if priority:
        query = query.filter(Todo.priority == priority)
    
    return query.count()

def create_todo(db: Session, todo: TodoCreate) -> Todo:
    db_todo = Todo(**todo.dict())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo(db: Session, todo_id: int, todo: TodoUpdate) -> Optional[Todo]:
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo:
        for key, value in todo.dict(exclude_unset=True).items():
            setattr(db_todo, key, value)
        db.commit()
        db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, todo_id: int) -> bool:
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo:
        db.delete(db_todo)
        db.commit()
        return True
    return False

def toggle_todo_completion(db: Session, todo_id: int) -> Optional[Todo]:
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo:
        db_todo.completed = not db_todo.completed
        db.commit()
        db.refresh(db_todo)
    return db_todo