import React from 'react';
import { Layout } from 'antd';

const { Header, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#3B82F6',
          }}
        >
          Todo App
        </div>
      </Header>
      <Content style={{ padding: '24px', background: '#f5f5f5' }}>
        {children}
      </Content>
    </Layout>
  );
};