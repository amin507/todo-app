import React from 'react';
import {
  Card,
  Tag,
  Button,
  Space,
  Popconfirm,
  Typography,
  Tooltip,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Todo } from '../../types';
import { useTodo } from '../../contexts/TodoContext';
import { PRIORITY_OPTIONS } from '../../utils/constants';
import dayjs from 'dayjs';

const { Text, Paragraph } = Typography;

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const { toggleTodoCompletion, deleteTodo } = useTodo();

  const priorityConfig = PRIORITY_OPTIONS.find(p => p.value === todo.priority);

  const handleToggleCompletion = async () => {
    try {
      await toggleTodoCompletion(todo.id);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id);
    } catch (error) {
      // Error handled in context
    }
  };

  return (
    <Card
      size="small"
      style={{
        marginBottom: 12,
        borderLeft: `4px solid ${priorityConfig?.color || '#d9d9d9'}`,
        opacity: todo.completed ? 0.7 : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Space>
              <Button
                type="text"
                size="small"
                icon={todo.completed ? <CheckOutlined /> : <ClockCircleOutlined />}
                onClick={handleToggleCompletion}
                style={{
                  color: todo.completed ? '#52c41a' : '#d9d9d9',
                }}
              />
              <Text
                strong
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  fontSize: '16px',
                }}
              >
                {todo.title}
              </Text>
            </Space>

            {todo.description && (
              <Paragraph
                type="secondary"
                style={{
                  margin: 0,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                }}
                ellipsis={{ rows: 2 }}
              >
                {todo.description}
              </Paragraph>
            )}

            <Space size="small">
              <Tag color={priorityConfig?.color}>
                {priorityConfig?.label} Priority
              </Tag>
              
              {todo.category && (
                <Tag color={todo.category.color}>
                  {todo.category.name}
                </Tag>
              )}

              {todo.due_date && (
                <Tooltip title="Due date">
                  <Tag color={dayjs(todo.due_date).isBefore(dayjs()) ? 'red' : 'blue'}>
                    {dayjs(todo.due_date).format('MMM D, YYYY')}
                  </Tag>
                </Tooltip>
              )}

              <Text type="secondary" style={{ fontSize: '12px' }}>
                Created: {dayjs(todo.created_at).format('MMM D, YYYY')}
              </Text>
            </Space>
          </Space>
        </div>

        <Space direction="vertical" style={{ marginLeft: 16 }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(todo)}
            size="small"
          />
          <Popconfirm
            title="Are you sure to delete this todo?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
            />
          </Popconfirm>
        </Space>
      </div>
    </Card>
  );
};