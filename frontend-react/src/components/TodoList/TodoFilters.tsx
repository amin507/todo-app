import React from 'react';
import {
  Row,
  Col,
  Input,
  Select,
  Button,
  Space,
  Card,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useTodo } from '../../contexts/TodoContext';
import { PRIORITY_OPTIONS } from '../../utils/constants';

const { Search } = Input;
const { Option } = Select;

export const TodoFilters: React.FC = () => {
  const { filters, setFilters, categories, fetchTodos } = useTodo();

  const handleSearch = (value: string) => {
    setFilters({ search: value, page: 1 });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ [key]: value, page: 1 });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      completed: null,
      category_id: null,
      priority: null,
      page: 1,
    });
  };

  const hasActiveFilters = 
    filters.search ||
    filters.completed !== null ||
    filters.category_id !== null ||
    filters.priority !== null;

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Search
            placeholder="Search todos..."
            allowClear
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            onSearch={handleSearch}
            enterButton={<SearchOutlined />}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={4}>
          <Select
            placeholder="Status"
            allowClear
            style={{ width: '100%' }}
            value={filters.completed}
            onChange={(value) => handleFilterChange('completed', value)}
          >
            <Option value={true}>Completed</Option>
            <Option value={false}>Incomplete</Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8} lg={4}>
          <Select
            placeholder="Priority"
            allowClear
            style={{ width: '100%' }}
            value={filters.priority}
            onChange={(value) => handleFilterChange('priority', value)}
          >
            {PRIORITY_OPTIONS.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8} lg={4}>
          <Select
            placeholder="Category"
            allowClear
            style={{ width: '100%' }}
            value={filters.category_id}
            onChange={(value) => handleFilterChange('category_id', value)}
          >
            {categories.map(category => (
              <Option key={category.id} value={category.id}>
                <span style={{ color: category.color }}>
                  {category.name}
                </span>
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            {hasActiveFilters && (
              <Button
                icon={<ReloadOutlined />}
                onClick={clearFilters}
                size="small"
              >
                Clear
              </Button>
            )}
            
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={fetchTodos}
              size="small"
            >
              Apply
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};