import React from "react";
import { Menu, Layout, Row, Col, Button, Typography } from "antd";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ShopOutlined,
  ShoppingCartOutlined
} from "@ant-design/icons";
import { MusicalNoteIcon } from "@heroicons/react/20/solid";

const { Header } = Layout;
const { Text } = Typography;

function HeaderNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Mengambil URL path untuk menyesuaikan selectedKey
  const selectedKey = location.pathname.split("/")[1] || "dashboard";

  const menuItems = [
    { key: "dashboard", icon: <HomeOutlined />, label: <NavLink to="/dashboard">Dashboard</NavLink> },
    { key: "store", icon: <ShopOutlined />, label: <NavLink to="/store">Store</NavLink> },
    { key: "orders", icon: <ShoppingCartOutlined />, label: <NavLink to="/orders">Orders</NavLink> },
    { key: "playlist", icon: <MusicalNoteIcon />, label: <NavLink to="/playlist">Playlist</NavLink> },
    { key: "profile", icon: <UserOutlined />, label: <NavLink to="/profile">Profile</NavLink> },
    { key: "settings", icon: <SettingOutlined />, label: <NavLink to="/settings">Settings</NavLink> },
  ];

  const doLogout = () => {
    navigate("/login", { replace: true });
  };

  return (
    <Header
      style={{
        backgroundColor: "#fff",
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        height: "64px",
        lineHeight: "64px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Row justify="space-between" align="middle" style={{ height: "100%" }}>
          {/* Logo */}
          <Col flex="none">
            <Text
              strong
              style={{
                fontSize: "20px",
                color: "#1890ff",
                marginRight: "8px",
              }}
            >
              DEVSTORM.COM
            </Text>
          </Col>

          {/* Navigation Menu */}
          <Col flex="auto">
            <Menu
              theme="light"
              mode="horizontal"
              selectedKeys={[selectedKey]}
              items={menuItems}
              style={{
                borderBottom: "none",
                display: "flex",
                justifyContent: "center",
              }}
            />
          </Col>

          {/* Logout Button */}
          <Col flex="none">
            <Button
              type="text"
              onClick={doLogout}
              icon={<LogoutOutlined />}
              style={{
                color: "#ff4d4f",
                fontWeight: 500,
              }}
            >
              Sign Out
            </Button>
          </Col>
        </Row>
      </div>
    </Header>
  );
}

export default HeaderNav;
