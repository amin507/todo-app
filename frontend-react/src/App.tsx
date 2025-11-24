import React from 'react';
import { ConfigProvider } from 'antd';
import { TodoProvider } from './contexts/TodoContext';
import { TodoList } from './components/TodoList/TodoList';
import { AppLayout } from './components/Layout/AppLayout';
import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3B82F6',
        },
      }}
    >
      <TodoProvider>
        <AppLayout>
          <TodoList />
        </AppLayout>
      </TodoProvider>
    </ConfigProvider>
  );
};

export default App;