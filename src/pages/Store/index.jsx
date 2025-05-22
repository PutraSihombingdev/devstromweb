import {
  Col, Row, Typography, Card, List, FloatButton, Drawer, Form, Input, Button,
  notification, Popconfirm, 
} from "antd";
import { useEffect, useState } from "react";
import { PlusCircleOutlined, EditOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { deleteData, getData, sendData } from "../../utils/api";

const { Title, Text } = Typography;

const Store = () => {
  const [api, contextHolder] = notification.useNotification();
  const [dataSources, setDataSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [idSelected, setIdSelected] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [formInputNature] = Form.useForm();

  const openNotificationWithIcon = (type, title, msg) => {
    api[type]({ message: title, description: msg });
  };

  useEffect(() => { getDataStore(); }, []);

  const getDataStore = async () => {
    setIsLoading(true);
    try {
      const resp = await getData("/api/v1/natures");
      if (resp) setDataSources(resp);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

 const onHandleDrawer = () => {
  setIsEdit(false);
  formInputNature.setFieldsValue({
    name_natures: "",
    description: "ID     :\nNick   :\nSkin   :\nRank   :\nHarga  :\nDetail  : "
  });
  setIsOpenDrawer(true);
};

  const onCloseDrawer = () => {
    setIsEdit(false);
    setIdSelected(null);
    formInputNature.resetFields();
    setIsOpenDrawer(false);
  };

  const confirmDelete = (record) => {
    const url = `/api/v1/natures/${record.id}`;
    deleteData(url)
      .then((resp) => {
        if (resp?.status === 200) {
          getDataStore();
          openNotificationWithIcon('success', "Hapus Data", "Berhasil Menghapus Data");
        } else {
          openNotificationWithIcon("error", "Hapus Data", "Gagal Menghapus Data");
        }
      })
      .catch((err) => {
        console.error(err);
        openNotificationWithIcon("error", "Hapus Data", "Terjadi kesalahan saat menghapus data");
      });
  };

  const handleSearch = (search) => setSearchText(search.toLowerCase());

  const dataSourceFiltered = dataSources.filter((item) =>
    item?.name_natures.toLowerCase().includes(searchText)
  );

  const handleSubmit = async () => {
    try {
      const values = await formInputNature.validateFields();
      const url = isEdit ? `/api/v1/natures/${idSelected}` : "/api/v1/natures";

      const formData = new FormData();
      formData.append("name_natures", values.name_natures);
      formData.append("description", values.description);

      const resp = await sendData(url, formData);
      if (resp) {
        openNotificationWithIcon(
          "success",
          "Data Store",
          isEdit ? "Sukses memperbaharui data" : "Sukses menambahkan data"
        );
        formInputNature.resetFields();
        getDataStore();
        onCloseDrawer();
      } else {
        openNotificationWithIcon("error", "Data Gallery", "Data gagal dikirim");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrawerEdit = (record) => {
    setIsEdit(true);
    setIsOpenDrawer(true);
    setIdSelected(record?.id);
    formInputNature.setFieldsValue({
      name_natures: record?.name_natures,
      description: record?.description,
    });
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
                  name="name_natures"
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

            <Input
              prefix={<SearchOutlined />}
              placeholder="Cari akun game yang kamu cari"
              className="header-search my-4"
              allowClear
              size="large"
              onChange={(e) => handleSearch(e.target.value)}
            />

            {isLoading ? (
              <div>Loading data akun...</div>
            ) : (
              <List
                grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                dataSource={dataSourceFiltered}
                renderItem={(item) => (
                  <List.Item key={item?.id}>
                    <Card
                      hoverable
                      cover={
                        <img
                          src={item?.url_photo || "/ml.png"}
                          alt="gambar akun"
                          style={{ height: 200, objectFit: "cover", borderRadius: '8px 8px 0 0' }}
                        />
                      }
                      actions={[
                        <EditOutlined key="edit" onClick={() => handleDrawerEdit(item)} />,
                        <SearchOutlined key="view" />,
                        <Popconfirm
                          key="delete"
                          title="Hapus Data"
                          description={`Apakah kamu yakin ingin menghapus data ${item?.name_natures}?`}
                          onConfirm={() => confirmDelete(item)}
                          okText="Ya"
                          cancelText="Tidak"
                        >
                          <DeleteOutlined />
                        </Popconfirm>,
                      ]}
                    >
                      <Card.Meta
                        title={<Text strong>{item?.name_natures}</Text>}
                        description={
                          <Text>{item?.description}</Text>
                        }
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

export default Store;
