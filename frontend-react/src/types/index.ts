export interface Category {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface CategoryCreate {
  name: string;
  color?: string;
}

export interface CategoryUpdate extends Partial<CategoryCreate> {}

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  due_date?: string;
  category_id?: number;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface TodoCreate {
  title: string;
  description?: string;
  completed?: boolean;
  priority?: 'high' | 'medium' | 'low';
  due_date?: string;
  category_id?: number;
}

export interface TodoUpdate extends Partial<TodoCreate> {}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface TodoListResponse {
  data: Todo[];
  pagination: PaginationInfo;
}

export interface FilterState {
  search: string;
  completed: boolean | null;
  category_id: number | null;
  priority: string | null;
  page: number;
  limit: number;
}