import { Layout, Button, Row, Col, Typography, Form, Input, Card } from "antd";
import SignBG from "../../assets/images/game.png";
import "./login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Header, Footer, Content } = Layout;

const LoginPage = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log(username, password);
    setIsAuthenticated(true); // Login sukses
    navigate("/dashboard", { replace: true });
  };

  return (
    <Layout className="layout-default layout-signin" style={{ minHeight: "100vh" }}>
      <Header style={{ background: "transparent", textAlign: "left", padding: "5px 50px" }}>
        <img src={SignBG} alt="Logo" style={{ height: "50px" }} />
      </Header>


      <Content className="signin login-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", background: "#f0f2f5" }}>
        <Card style={{ maxWidth: 400, width: "100%", borderRadius: 16, padding: 24, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
          <Title className="mb-15" level={2} style={{ textAlign: "center" }}>Sign In</Title>
          <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 24 }}>
            Masukkan email dan password anda untuk login
          </Text>

          <Form onFinish={handleLogin} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", height: "40px", fontWeight: "bold" }}
                disabled={!username || !password}
              >
                SIGN IN
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>

      <Footer style={{ textAlign: "center", background: "transparent" }}>
        <p className="copyright">
          Copyright © 2024 WebfmSI.com - Powered by Universitas Pendidikan Ganesha
        </p>
      </Footer>
    </Layout>
  );
};

export default LoginPage;
