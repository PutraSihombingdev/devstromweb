import {
  Col, Row, Typography, Card, List, FloatButton, Drawer, Form, Input, Button,
  notification, Popconfirm, Modal,
} from "antd";
import { useEffect, useState } from "react";
import { PlusCircleOutlined, EditOutlined, SearchOutlined, DeleteOutlined, PicLeftOutlined } from '@ant-design/icons';
import axios from "axios";
import SearchWithFilter from "../../components/SearchWithFilter";

const { Title, Text } = Typography;

const Store = () => {
  const [api, contextHolder] = notification.useNotification();
  const [dataSources, setDataSources] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [idSelected, setIdSelected] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [formInputNature] = Form.useForm();

  // State untuk Modal Detail
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const openNotificationWithIcon = (type, title, msg) => {
    api[type]({ message: title, description: msg });
  };

  useEffect(() => {
    getDataStore();
  }, []);

  const getDataStore = async () => {
    setIsLoading(true);
    try {
      const resp = await axios.get("https://webfmsi.singapoly.com/api/playlist/47");
      if (resp.data?.data) {
        setDataSources(resp.data.data);
        setFilteredData(resp.data.data);
      }
    } catch (err) {
      console.error(err);
      openNotificationWithIcon('error', 'Error', 'Gagal mengambil data dari API');
    } finally {
      setIsLoading(false);
    }
  };

  const onHandleDrawer = () => {
    setIsEdit(false);
    formInputNature.setFieldsValue({
      title: "",
      description: "",
    });
    setIsOpenDrawer(true);
  };

  const onCloseDrawer = () => {
    setIsEdit(false);
    setIdSelected(null);
    formInputNature.resetFields();
    setIsOpenDrawer(false);
  };

  const handleSearch = (text, filter = selectedFilter) => {
    setSearchText(text.toLowerCase());
    setSelectedFilter(filter);

    const filtered = dataSources.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(text.toLowerCase());
      const matchesFilter = filter ? item.title.toLowerCase().includes(filter.toLowerCase()) : true;
      return matchesSearch && matchesFilter;
    });

    setFilteredData(filtered);
  };

  const handleSubmit = async () => {
    try {
      const values = await formInputNature.validateFields();
      const url = "https://webfmsi.singapoly.com/api/playlist/47";

      // Simulasi pengiriman POST karena API ini tidak mendukung penambahan data (read-only)
      console.log("Data yang akan dikirim:", values);

      openNotificationWithIcon("success", "Data Store", "Data berhasil disimpan (simulasi)");
      formInputNature.resetFields();
      onCloseDrawer();
      getDataStore();
    } catch (err) {
      console.error(err);
      openNotificationWithIcon("error", "Error", "Terjadi kesalahan saat mengirim data");
    }
  };

  const handleDrawerEdit = (record) => {
    setIsEdit(true);
    setIsOpenDrawer(true);
    setIdSelected(record?.id);
    formInputNature.setFieldsValue({
      title: record?.title,
      description: record?.description || "",
    });
  };

  const showDetail = (item) => {
    setSelectedDetail(item);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedDetail(null);
  };

  const confirmDelete = (record) => {
    // Karena API read-only, saya buatkan simulasi penghapusan
    openNotificationWithIcon('success', 'Hapus Data', `Data ${record.title} dihapus (simulasi)`);
    setFilteredData(filteredData.filter(item => item.id !== record.id));
  };

  return (
    <div className="layout-content">
      {contextHolder}
      <Row gutter={[24, 0]}>
        <Col xs={24}>
          <Card bordered={false} className="circlebox h-full w-full">
            <FloatButton
              shape="circle"
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={onHandleDrawer}
              style={{ right: 24, bottom: 24 }}
            />

            <Drawer
              title={isEdit ? "Edit Akun" : "Tambah Akun"}
              onClose={onCloseDrawer}
              open={isOpenDrawer}
              width={480}
              extra={
                <Button type="primary" onClick={handleSubmit}>
                  {isEdit ? "Update" : "Kirim"}
                </Button>
              }
            >
              <Form form={formInputNature} layout="vertical">
                <Form.Item
                  label="Nama Akun"
                  name="title"
                  rules={[{ required: true, message: "Nama akun tidak boleh kosong" }]}
                >
                  <Input placeholder="Contoh: Akun Mobile Legends, Akun Valorant" />
                </Form.Item>

                <Form.Item
                  label="Deskripsi"
                  name="description"
                  rules={[{ required: true, message: "Deskripsi tidak boleh kosong" }]}
                >
                  <Input.TextArea rows={4} placeholder="Contoh: Skin lengkap, rank Mythic, email terhubung" />
                </Form.Item>
              </Form>
            </Drawer>

            <Title level={3}>Akun Penjualan</Title>
            <Text style={{ fontSize: "14px" }}>Kelola dan jual akun game favoritmu di sini!</Text>

            <SearchWithFilter onSearch={handleSearch} style={{ marginBottom: "24px" }} />

            {isLoading ? (
              <div>Loading data akun...</div>
            ) : (
              <List
                grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                dataSource={filteredData}
                renderItem={(item) => (
                  <List.Item key={item?.id}>
                    <Card
                      hoverable
                      cover={
                        <img
                          src={item.thumbnail || "https://i.pinimg.com/736x/9a/d6/67/9ad667f9dcaad4bff1b6f3e73737dddd.jpg"}
                          alt="gambar akun"
                          style={{ height: 200, objectFit: "cover", borderRadius: '8px 8px 0 0' }}
                        />
                      }
                      actions={[
                        <EditOutlined key="edit" onClick={() => handleDrawerEdit(item)} />,
                        <PicLeftOutlined key="view" onClick={() => showDetail(item)} />,
                        <Popconfirm
                          key="delete"
                          title="Hapus Data"
                          description={`Apakah kamu yakin ingin menghapus data ${item?.title}?`}
                          onConfirm={() => confirmDelete(item)}
                          okText="Ya"
                          cancelText="Tidak"
                        >
                          <DeleteOutlined />
                        </Popconfirm>,
                      ]}
                    >
                      <Card.Meta
                        title={<Text strong>{item?.title}</Text>}
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
      <Modal
        title="Detail Akun"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[]}
      >
        {selectedDetail && (
          <div>
            <p><strong>Nama:</strong> {selectedDetail.title}</p>
            <p><strong>Deskripsi:</strong></p>

            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", marginBottom: "16px" }}>
              {selectedDetail.description}
            </pre>

            <Button
              type="primary"
              danger
              block
              onClick={() => {
                openNotificationWithIcon('success', 'Berhasil', `${selectedDetail.title} sudah terjual (simulasi)`);
                handleModalClose();
              }}
            >
              Tandai sebagai Terjual
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Store;
