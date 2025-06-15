import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, theme, Avatar, Space, Typography } from 'antd';
import { useState } from 'react';
import {
  DashboardOutlined,
  ShoppingOutlined,
  PlaySquareOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons';
import PlaylistPage from './pages/Playlist/PlaylistPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Store from './pages/Store';
import Logo from './assets/images/game.png'; // Make sure the path is correct

const { Header, Content } = Layout;
const { Text } = Typography;

function AppContent({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();

  const hideMenu = location.pathname === '/';

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/', { replace: true });
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined style={{ fontSize: '18px' }} />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: 'store',
      icon: <ShoppingOutlined style={{ fontSize: '18px' }} />,
      label: <Link to="/store">Store</Link>,
    },
    {
      key: 'playlist',
      icon: <PlaySquareOutlined style={{ fontSize: '18px' }} />,
      label: <Link to="/playlist">Playlist</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!hideMenu && (
        <Header style={{
          background: colorPrimary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: '64px',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}>
          <Space size="large">
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center' }}>
            </Link>

            <Menu
              theme="dark"
              mode="horizontal"
              items={menuItems}
              selectedKeys={[location.pathname.split('/')[1] || 'dashboard']}
              style={{ 
                flex: 1, 
                minWidth: 0,
                background: 'transparent',
                borderBottom: 'none',
                fontSize: '16px'
              }}
            />
          </Space>

          <Space>
            <Button 
              type="text" 
              danger 
              onClick={handleLogout} 
              icon={<LogoutOutlined />}
              style={{ color: 'white' }}
            >
              Logout
            </Button>
          </Space>
        </Header>
      )}
      
      <Content style={{
        padding: '24px',
        background: colorBgContainer,
        minHeight: 'calc(100vh - 64px)'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto',
          width: '100%'
        }}>
          <Routes>
            <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/store" 
              element={isAuthenticated ? <Store /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/playlist" 
              element={isAuthenticated ? <PlaylistPage /> : <Navigate to="/" replace />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </Router>
  );
}

export default App;