import React, { useEffect, useState } from 'react';
import {
  List,
  Pagination,
  Button,
  Empty,
  Spin,
  Alert,
  Space,
  Card,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Todo } from '../../types';
import { useTodo } from '../../contexts/TodoContext';
import { TodoItem } from './TodoItem';
import { TodoFilters } from './TodoFilters';
import { TodoForm } from '../TodoForm/TodoForm';

export const TodoList: React.FC = () => {
  const {
    todos,
    filters,
    loading,
    error,
    fetchTodos,
    fetchCategories,
    setFilters,
    clearError,
  } = useTodo();

  const [formVisible, setFormVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    fetchTodos();
    fetchCategories();
  }, [filters]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setFilters({
      page,
      limit: pageSize || filters.limit,
    });
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setFormVisible(true);
  };

  const handleFormClose = () => {
    setFormVisible(false);
    setEditingTodo(null);
  };

  const handleCreateNew = () => {
    setEditingTodo(null);
    setFormVisible(true);
  };

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        closable
        onClose={clearError}
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Todo List</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateNew}
            >
              New Todo
            </Button>
          </div>
        </Card>

        <TodoFilters />

        <Card>
          <Spin spinning={loading}>
            {todos.length === 0 ? (
              <Empty
                description="No todos found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={handleCreateNew}>
                  Create Your First Todo
                </Button>
              </Empty>
            ) : (
              <List
                dataSource={todos}
                renderItem={(todo) => (
                  <List.Item>
                    <TodoItem
                      todo={todo}
                      onEdit={handleEdit}
                    />
                  </List.Item>
                )}
                pagination={false}
              />
            )}

            {todos.length > 0 && (
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Pagination
                  current={filters.page}
                  pageSize={filters.limit}
                  total={50} // You might want to get this from API response
                  onChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`
                  }
                />
              </div>
            )}
          </Spin>
        </Card>
      </Space>

      <TodoForm
        visible={formVisible}
        onCancel={handleFormClose}
        editingTodo={editingTodo}
      />
    </div>
  );
};