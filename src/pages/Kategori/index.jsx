import { Col, Row, Typography, Card, List } from "antd";
import { useEffect, useState } from "react";
import SearchWithFilter from "../../components/SearchWithFilter";

import { getData } from "../../utils/api";

const { Title, Text } = Typography;

const Kategori = () => {
  const [dataSources, setDataSources] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
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
        setFilteredData(resp); 
      } else {
        console.log("Something went wrong");
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };

  const handleSearch = (searchText) => {
    const filtered = dataSources.filter((item) =>
      item.name_natures.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleFilterSelect = (filter) => {
    const filtered = dataSources.filter((item) =>
      item.name_natures.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={23} className="mb-24">
          <Card bordered={false} className="circlebox h-full w-full">
            <Title>List of Nature</Title>
            <Text style={{ fontSize: "12pt" }}>Tambahkan Konten Disini...</Text>

            <SearchWithFilter onSearch={handleSearch} onFilterSelect={handleFilterSelect} />

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
                dataSource={filteredData}
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

export default Kategori;
