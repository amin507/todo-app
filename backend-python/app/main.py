from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional, List
import math

from app.database import get_db
from app.models.todo import Todo
from app.models.category import Category
from app.schemas.todo import TodoCreate, TodoUpdate, Todo as TodoSchema, TodoListResponse
from app.schemas.category import CategoryCreate, CategoryUpdate, Category as CategorySchema
from app.crud import todo as todo_crud
from app.crud import category as category_crud

from sqlalchemy import text


app = FastAPI(title="Todo API", version="1.0.0")

origins = [
    "http://localhost:3000",  # React development server
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Health check
@app.get("/")
async def root():
    return {"message": "Todo API is running"}

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1"))
        return {"status": "connected", "result": result.scalar()}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

# Todo endpoints
@app.get("/api/todos", response_model=TodoListResponse)
def get_todos(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    search: Optional[str] = None,
    completed: Optional[bool] = None,
    category_id: Optional[int] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * limit
    todos = todo_crud.get_todos(db, skip, limit, search, completed, category_id, priority)
    total = todo_crud.get_todos_count(db, search, completed, category_id, priority)
    total_pages = math.ceil(total / limit) if total > 0 else 1
    
    return {
        "data": todos,
        "pagination": {
            "current_page": page,
            "per_page": limit,
            "total": total,
            "total_pages": total_pages
        }
    }


@app.post("/api/todos", response_model=TodoSchema)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    return todo_crud.create_todo(db, todo)

@app.get("/api/todos/{todo_id}", response_model=TodoSchema)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = todo_crud.get_todo(db, todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo

@app.put("/api/todos/{todo_id}", response_model=TodoSchema)
def update_todo(todo_id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    db_todo = todo_crud.update_todo(db, todo_id, todo)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo

@app.delete("/api/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    success = todo_crud.delete_todo(db, todo_id)
    if not success:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted successfully"}

@app.patch("/api/todos/{todo_id}/complete", response_model=TodoSchema)
def toggle_todo_completion(todo_id: int, db: Session = Depends(get_db)):
    db_todo = todo_crud.toggle_todo_completion(db, todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo

# Category endpoints
@app.get("/api/categories", response_model=List[CategorySchema])
def get_categories(db: Session = Depends(get_db)):
    return category_crud.get_categories(db)

@app.post("/api/categories", response_model=CategorySchema)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return category_crud.create_category(db, category)

@app.put("/api/categories/{category_id}", response_model=CategorySchema)
def update_category(category_id: int, category: CategoryUpdate, db: Session = Depends(get_db)):
    db_category = category_crud.update_category(db, category_id, category)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@app.delete("/api/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    success = category_crud.delete_category(db, category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}