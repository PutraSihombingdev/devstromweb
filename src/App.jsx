import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { useState } from 'react';
import PlaylistPage from './pages/PlaylistPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Store from './pages/Store';
import SignBG from './assets/images/game.png'; // Pastikan path logo benar

const { Header, Content } = Layout;

function AppContent({ isAuthenticated, setIsAuthenticated }) {
    const location = useLocation();
    const navigate = useNavigate();

    const hideMenu = location.pathname === '/';

    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate('/', { replace: true });
    };

    const menuItems = [
        { key: '1', label: <Link to="/dashboard" style={{ color: 'white', fontSize: '16px' }}>Dashboard</Link> },
        { key: '2', label: <Link to="/store" style={{ color: 'white', fontSize: '16px' }}>Store</Link> },
        { key: '3', label: <Link to="/playlist" style={{ color: 'white', fontSize: '16px' }}>Playlist</Link> },
    ];

    return (
        <Layout>
            {!hideMenu && (
                <Header style={{
                    background: 'linear-gradient(90deg, #001529 0%, #0047AB 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 40px',
                    height: '80px', // Membuat header lebih tinggi
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' // Membuat header lebih terlihat
                }}>
                   

                    {/* Menu */}
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        items={menuItems}
                        style={{ flex: 1, justifyContent: 'center', background: 'transparent', borderBottom: 'none' }}
                    />

                    {/* Logout Button */}
                    <Button type="primary" danger onClick={handleLogout} style={{ fontSize: '16px' }}>
                        Logout
                    </Button>
                </Header>
            )}
            <Content style={{ padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />} />
                    <Route path="/store" element={isAuthenticated ? <Store /> : <Navigate to="/" replace />} />
                    <Route path="/playlist" element={isAuthenticated ? <PlaylistPage /> : <Navigate to="/" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
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
