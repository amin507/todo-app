-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create todos table
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

-- Create indexes for better performance
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_category_id ON todos(category_id);
CREATE INDEX idx_todos_priority ON todos(priority);
CREATE INDEX idx_todos_title ON todos(title);

-- Insert sample categories
INSERT INTO categories (name, color) VALUES 
('Work', '#3B82F6'),
('Personal', '#10B981'),
('Shopping', '#F59E0B'),
('Health', '#EF4444');

-- Insert sample todos
INSERT INTO todos (title, description, completed, priority, category_id) VALUES 
('Complete coding challenge', 'Build a full-stack todo application for Industrix', false, 'high', 1),
('Buy groceries', 'Milk, eggs, bread, and fruits', false, 'medium', 3),
('Morning workout', '30 minutes of cardio and strength training', true, 'medium', 4),
('Read book', 'Finish reading the current chapter', false, 'low', 2);