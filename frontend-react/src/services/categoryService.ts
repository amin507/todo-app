import { api } from './api';
import { Category, CategoryCreate, CategoryUpdate } from '../types';

export const categoryService = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/api/categories');
    return response.data;
  },

  // Create category
  createCategory: async (category: CategoryCreate): Promise<Category> => {
    const response = await api.post('/api/categories', category);
    return response.data;
  },

  // Update category
  updateCategory: async (id: number, category: CategoryUpdate): Promise<Category> => {
    const response = await api.put(`/api/categories/${id}`, category);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/api/categories/${id}`);
  },
};