
# Todo App - Full Stack Application with Docker

## Project Overview
A full-stack Todo List application that demonstrates modern web development practices using a React frontend, a FastAPI backend, and a PostgreSQL database, containerized with Docker for both the backend and the database.

#### Git Repository : https://github.com/amin507/todo-app.git

### Frontend React 
Application with modern hooks and state management.
- Use React Context API for state management
- Use Ant Design (antd) as the UI framework
- Responsive design. Application work on desktop, tablet, and mobile devices
- Advanced Filtering. Filter by completion status, category, priority
- Use TypeScript

### Backend Python 
RESTful API service
- Use Docker Containerized backend and database with docker-compose file
- Use PostgreeSQL
- Use SQLAlchemy
- Database migrations in SQL files (up and down migrations)

### Backend Unit Tests
- Comprehensive unit tests for backend services

### Documentation
- API Collections
- Screeshot application


### Features Implemented
Core Features:
- Todo Management (CRUD operations)
- Todo Categories with color coding
- Pagination (10-20 items per page)
- Search functionality
- Responsive design for desktop, tablet, and mobile
- React Context API for state management
- Advanced filtering (status, category, priority)
- TypeScript for frontend
- Docker containerization
- Backend unit tests


### Architecture
```
frontend-react/          # React + TypeScript + Ant Design
backend-python/          # FastAPI + PostgreSQL + Docker + SQLAlchemy
```

### Quick Start
Prerequisites:
- Docker & Docker Compose
- Install Node.js 18+ (for frontend development)
- Install Python 3.11+ (for backend development)

#### With Docker Compose (Recommended)
##### Clone and setup
```
# Backend
cd backend-python
docker-compose up --build -d

# Frontend (in new terminal)
cd frontend-react
npm install
npm run dev
```

#### Access the application
```
Frontend: http://localhost:3000
Backend API: http://localhost:8000
```

#### Manual Development Setup
##### Backend Setup:
```
cd backend-python

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start PostgreSQL database
docker-compose up db -d

# Run backend
uvicorn app.main:app --reload --port 8000
```

##### Frontend Setup:
```
cd frontend-react

# Install dependencies
npm install

# Start development server
npm run dev
```

### Database Design
#### Tables Structure
tables:
```
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(10) DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    category_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Relationships
```
One-to-Many: Categories -> Todos (One category can have many todos)

Foreign Key: todos.category_id references categories.id
```


#### Database Design
###### 1. What database tables are created and why?
- categories: Store todo categories with name and color for visual organization
- todos: Store todo items with relationships to categories
- Relationships: One-to-many (categories → todos) for efficient querying
- Why this structure: Normalized design prevents data duplication, enables efficient filtering

###### 2. How to handle pagination and filtering in database?
- Pagination: SQL LIMIT and OFFSET with count queries for total pages
- Filtering: Dynamic WHERE clauses based on filter parameters
- Indexes: Added indexes on frequently filtered columns (completed, category_id, priority, title)
- Efficiency: Server-side pagination reduces data transfer


#### Frontend Implementation

##### 1. How to implement responsive design?
- Breakpoints: Using Ant Design's built-in responsive grid (xs, sm, md, lg, xl)
- Adaptive UI:
- Mobile: Stacked layout, larger touch targets
- Tablet: Hybrid layout with collapsible sidebar
- Desktop: Full sidebar with detailed views
- Ant Design Components: Grid, Layout, and responsive hooks

##### 2. How to structure React components?
- Component Hierarchy: App → Layout → TodoList/CategoryManager → TodoItem/TodoForm
- State Management: React Context for global state, local state for UI
- Filter/Pagination State: Managed in context, synchronized with URL parameters

#### Backend Architecture
##### 1. What backend architecture choosed and why?
- Framework: FastAPI for async support, automatic docs, and type safety
- Structure:
- models/ - SQLAlchemy models
- schemas/ - Pydantic models for validation
- crud/ - Database operations
- main.py - API routes and middleware
- Error Handling: FastAPI's built-in validation + custom exception handlers

##### 2. How did data validation handle?
- Backend: Pydantic models with type hints and custom validators
- Frontend: Form validation with Ant Design + TypeScript
- Validation Rules: Required fields, string lengths, enum values, date formats

#### Testing & Quality
##### 1. What did choose to unit test and why?
- CRUD Operations: Test database interactions and business logic
- Edge Cases: Empty results, invalid IDs, duplicate categories
- Test Structure: Arrange-Act-Assert pattern with test database

##### 2. If had more time, what would improved or added?
- Authentication: User registration/login system
- Real-time Updates: WebSocket support for live collaboration
- Advanced Features: Recurring todos, file attachments, calendar view
- Performance: Query optimization, caching with Redis
- Monitoring: Logging, metrics, and health checks
