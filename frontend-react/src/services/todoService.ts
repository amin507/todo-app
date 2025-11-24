import { api } from './api';
import { Todo, TodoCreate, TodoUpdate, TodoListResponse, FilterState } from '../types';

export const todoService = {
  // Get todos with filters and pagination
  getTodos: async (filters: FilterState): Promise<TodoListResponse> => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.completed !== null) params.append('completed', filters.completed.toString());
    if (filters.category_id) params.append('category_id', filters.category_id.toString());
    if (filters.priority) params.append('priority', filters.priority);
    params.append('page', filters.page.toString());
    params.append('limit', filters.limit.toString());

    const response = await api.get(`/api/todos?${params}`);
    return response.data;
  },

  // Get single todo
  getTodo: async (id: number): Promise<Todo> => {
    const response = await api.get(`/api/todos/${id}`);
    return response.data;
  },

  // Create todo
  createTodo: async (todo: TodoCreate): Promise<Todo> => {
    const response = await api.post('/api/todos', todo);
    return response.data;
  },

  // Update todo
  updateTodo: async (id: number, todo: TodoUpdate): Promise<Todo> => {
    const response = await api.put(`/api/todos/${id}`, todo);
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id: number): Promise<void> => {
    await api.delete(`/api/todos/${id}`);
  },

  // Toggle completion status
  toggleCompletion: async (id: number): Promise<Todo> => {
    const response = await api.patch(`/api/todos/${id}/complete`);
    return response.data;
  },
};