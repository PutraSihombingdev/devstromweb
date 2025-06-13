import React from "react";
import { Carousel, Typography, Button, Row, Col, Card } from "antd";
import {
  FireOutlined, ThunderboltOutlined, TeamOutlined,
  StarFilled, ArrowRightOutlined ,YuqueOutlined
} from "@ant-design/icons";

import BackgroundImage1 from "../../assets/images/jual.png";
import BackgroundImage2 from "../../assets/images/store.png";

const { Title, Text, Paragraph } = Typography;

function Dashboard() {
  const slides = [
    {
      key: 1,
      img: BackgroundImage1,
    },
    {
      key: 2,
      img: BackgroundImage2,

    },
  ];

  return (
    <div className="layout-content">
      {/* Hero Carousel */}
      <Carousel autoplay effect="fade">
        {slides.map(({ key, img, title, subtitle }) => (
          <div key={key} style={{ position: "relative" }}>
            <img
              src={img}
              alt="Slide"
              style={{
                width: "100%",
                height: "500px",
                objectFit: "cover",
                filter: "brightness(0.7)"
              }}
            />
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "#fff",
              width: "100%",
              padding: "0 20px"
            }}>
              <Title level={1} style={{ color: "#fff", fontSize: "3rem" }}>{title}</Title>
              <Paragraph style={{ fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
                {subtitle}
              </Paragraph>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Game Categories */}
      <div style={{ padding: "60px 50px", backgroundColor: "#fff" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 10 }}>
          Menyediakan Penjualan Akun Game
        </Title>
        <Paragraph type="secondary" style={{ textAlign: "center", marginBottom: 40 }}>
          Pilih Game Favorit Mu
        </Paragraph>
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{ borderRadius: 12, textAlign: "center", height: "100%" }}
              cover={<div style={{ padding: "30px 0 20px", backgroundColor: "#fff2f0" }}>
                <FireOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />
              </div>}
            >
              <Card.Meta
                title={<Title level={4}>Free Fire</Title>}
                description="Free Fire adalah shooting game mobile paling terkenal di dunia"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{ borderRadius: 12, textAlign: "center", height: "100%" }}
              cover={<div style={{ padding: "30px 0 20px", backgroundColor: "#fff7e6" }}>
                <YuqueOutlined style={{ fontSize: 48, color: "#fa8c16" }} />
              </div>}
            >
              <Card.Meta
                title={<Title level={4}>Mobile Legend</Title>}
                description="Permainan video seluler bergenre multiplayer online battle arena (MOBA)"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{ borderRadius: 12, textAlign: "center", height: "100%" }}
              cover={<div style={{ padding: "30px 0 20px", backgroundColor: "#e6f7ff" }}>
                <TeamOutlined style={{ fontSize: 48, color: "#1890ff" }} />
              </div>}
            >
              <Card.Meta
                title={<Title level={4}>PUBG</Title>}
                description="PUBG MOBILE adalah game battle royale orisinal di perangkat seluler dan salah satu game menembak seluler terbaik"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{ borderRadius: 12, textAlign: "center", height: "100%" }}
              cover={<div style={{ padding: "30px 0 20px", backgroundColor: "#fff7e6" }}>
                <ThunderboltOutlined style={{ fontSize: 48, color: "#fa8c16" }} />
              </div>}
            >
              <Card.Meta
                title={<Title level={4}>Valorant</Title>}
                description="Penembak taktis berbasis tim dan penembak orang pertama yang diatur dalam dekat masa depan"
              />
            </Card>
          </Col>
          
        </Row>
      </div>
    </div>
  );
}

export default Dashboard;
