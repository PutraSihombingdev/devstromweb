import { Col, Row, Typography, Card, List } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { getData } from "../../utils/api";

const { Title, Text } = Typography;

const Gallery = () => {
  const [dataSources, setDataSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getDataGallery();
  }, []);

  const getDataGallery = async () => {
    setIsLoading(true);
    try {
      const resp = await getData("/api/v1/natures");
      setIsLoading(false);
      if (resp) {
        setDataSources(resp);
      } else {
        console.log("Something went wrong");
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={23} className="mb-24">
          <Card bordered={false} className="circlebox h-full w-full">
            <Title>List of Nature</Title>
            <Text style={{ fontSize: "12pt" }}>Tambahkan Konten Disini...</Text>
            {isLoading ? (
              <div>Sedang menunggu data...</div>
            ) : (
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 1,
                  md: 2,
                  lg: 3,
                  xl: 3,
                }}
                dataSource={dataSources}
                renderItem={(item) => (
                  <List.Item key={item?.id}>
                    <Card
                      cover={
                        <img
                          src={item?.url_photo}
                          alt="categories-image"
                        />
                      }
                    >
                      <Card.Meta
                        title={<Text>{item?.name_natures}</Text>}
                        description={<Text>{item?.description}</Text>}
                      />
                    </Card>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Gallery;