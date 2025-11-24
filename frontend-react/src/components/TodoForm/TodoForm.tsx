import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Button,
  message,
  Space,
} from 'antd';
import { Todo, TodoCreate } from '../../types';
import { useTodo } from '../../contexts/TodoContext';
import { PRIORITY_OPTIONS } from '../../utils/constants';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface TodoFormProps {
  visible: boolean;
  onCancel: () => void;
  editingTodo?: Todo | null;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  visible,
  onCancel,
  editingTodo,
}) => {
  const [form] = Form.useForm();
  const { createTodo, updateTodo, categories, fetchCategories } = useTodo();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (visible) {
      if (editingTodo) {
        form.setFieldsValue({
          ...editingTodo,
          due_date: editingTodo.due_date ? dayjs(editingTodo.due_date) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingTodo, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const todoData: TodoCreate = {
        ...values,
        due_date: values.due_date ? values.due_date.toISOString() : undefined,
      };

      if (editingTodo) {
        await updateTodo(editingTodo.id, todoData);
        message.success('Todo updated successfully');
      } else {
        await createTodo(todoData);
        message.success('Todo created successfully');
      }

      form.resetFields();
      onCancel();
    } catch (error) {
      message.error('Failed to save todo');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={editingTodo ? 'Edit Todo' : 'Create New Todo'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          priority: 'medium',
          completed: false,
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="Enter todo title" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea
            rows={3}
            placeholder="Enter todo description (optional)"
          />
        </Form.Item>

        <Space size="large" style={{ width: '100%' }}>
          <Form.Item name="priority" label="Priority">
            <Select style={{ width: 120 }}>
              {PRIORITY_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  <span style={{ color: option.color }}>{option.label}</span>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="category_id" label="Category">
            <Select
              style={{ width: 140 }}
              placeholder="Select category"
              allowClear
            >
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  <span
                    style={{
                      color: category.color,
                      fontWeight: 'bold',
                    }}
                  >
                    {category.name}
                  </span>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="due_date" label="Due Date">
            <DatePicker
              showTime
              style={{ width: 160 }}
              placeholder="Select due date"
            />
          </Form.Item>
        </Space>

        {editingTodo && (
          <Form.Item name="completed" label="Completed" valuePropName="checked">
            <Switch />
          </Form.Item>
        )}

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingTodo ? 'Update' : 'Create'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};