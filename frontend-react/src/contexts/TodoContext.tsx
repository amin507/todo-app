import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Todo, Category, FilterState, TodoCreate, TodoUpdate } from '../types';
import { todoService, categoryService } from '../services';

interface TodoState {
  todos: Todo[];
  categories: Category[];
  filters: FilterState;
  loading: boolean;
  error: string | null;
}

type TodoAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'TOGGLE_TODO'; payload: Todo };

const initialState: TodoState = {
  todos: [],
  categories: [],
  filters: {
    search: '',
    completed: null,
    category_id: null,
    priority: null,
    page: 1,
    limit: 10,
  },
  loading: false,
  error: null,
};

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [action.payload, ...state.todos] };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        ),
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload, page: 1 }, // Reset to page 1 when filters change
      };
    default:
      return state;
  }
};

interface TodoContextType extends TodoState {
  fetchTodos: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  createTodo: (todo: TodoCreate) => Promise<void>;
  updateTodo: (id: number, todo: TodoUpdate) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleTodoCompletion: (id: number) => Promise<void>;
  setFilters: (filters: Partial<FilterState>) => void;
  clearError: () => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const fetchTodos = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await todoService.getTodos(state.filters);
      dispatch({ type: 'SET_TODOS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch todos' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchCategories = async () => {
    try {
      const categories = await categoryService.getCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch categories' });
    }
  };

  const createTodo = async (todoData: TodoCreate) => {
    try {
      const newTodo = await todoService.createTodo(todoData);
      dispatch({ type: 'ADD_TODO', payload: newTodo });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create todo' });
      throw error;
    }
  };

  const updateTodo = async (id: number, todoData: TodoUpdate) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, todoData);
      dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update todo' });
      throw error;
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      dispatch({ type: 'DELETE_TODO', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete todo' });
      throw error;
    }
  };

  const toggleTodoCompletion = async (id: number) => {
    try {
      const updatedTodo = await todoService.toggleCompletion(id);
      dispatch({ type: 'TOGGLE_TODO', payload: updatedTodo });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to toggle todo completion' });
      throw error;
    }
  };

  const setFilters = (filters: Partial<FilterState>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return (
    <TodoContext.Provider
      value={{
        ...state,
        fetchTodos,
        fetchCategories,
        createTodo,
        updateTodo,
        deleteTodo,
        toggleTodoCompletion,
        setFilters,
        clearError,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};