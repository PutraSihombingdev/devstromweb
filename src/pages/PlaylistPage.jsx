import React, { useEffect, useState } from 'react';
import {
  Col, Row, Typography, Card, List, FloatButton, Drawer, Form, Input, Button,
  notification, Popconfirm, Modal
} from 'antd';
import { PlusCircleOutlined, EditOutlined, PicLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { getPlaylist, addPlaylist, updatePlaylist, deletePlaylist } from '../api/playlistApi';

const { Title, Text } = Typography;

function PlaylistPage() {
  const [api, contextHolder] = notification.useNotification();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [form] = Form.useForm();

  // Drawer dan Modal
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const openNotification = (type, title, msg) => {
    api[type]({ message: title, description: msg });
  };

  useEffect(() => {
    loadPlaylist();
  }, []);

  const loadPlaylist = async () => {
    setIsLoading(true);
    try {
      const response = await getPlaylist();
      setPlaylists(response.datas);
    } catch (err) {
      console.error(err);
      openNotification('error', 'Load Playlist', 'Gagal memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  const onHandleDrawer = () => {
    setIsEdit(false);
    form.resetFields();
    setIsDrawerOpen(true);
  };

  const onCloseDrawer = () => {
    setIsEdit(false);
    setSelectedId(null);
    form.resetFields();
    setIsDrawerOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isEdit) {
        await updatePlaylist(selectedId, values);
        openNotification('success', 'Update Playlist', 'Berhasil mengupdate data');
      } else {
        await addPlaylist(values);
        openNotification('success', 'Tambah Playlist', 'Berhasil menambahkan data');
      }

      loadPlaylist();
      onCloseDrawer();
    } catch (err) {
      console.error(err);
      openNotification('error', 'Proses Gagal', 'Gagal memproses data');
    }
  };

  const handleDrawerEdit = (item) => {
    setIsEdit(true);
    setIsDrawerOpen(true);
    setSelectedId(item.id_play);
    form.setFieldsValue({
      play_name: item.play_name,
      play_url: item.play_url,
      play_thumbnail: item.play_thumbnail,
      play_genre: item.play_genre,
      play_description: item.play_description,
    });
  };

  const confirmDelete = async (item) => {
    try {
      await deletePlaylist(item.id_play);
      openNotification('success', 'Hapus Playlist', 'Berhasil menghapus data');
      loadPlaylist();
    } catch (err) {
      console.error(err);
      openNotification('error', 'Hapus Playlist', 'Gagal menghapus data');
    }
  };

  const showDetail = (item) => {
    setSelectedDetail(item);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedDetail(null);
  };

  return (
    <div className="layout-content">
      {contextHolder}
      <Row gutter={[24, 0]}>
        <Col xs={24}>
          <Card bordered={false} className="circlebox h-full w-full">

            <Drawer
              title={isEdit ? "Edit Playlist" : "Tambah Playlist"}
              onClose={onCloseDrawer}
              open={isDrawerOpen}
              width={480}
              extra={
                <Button type="primary" onClick={handleSubmit}>
                  {isEdit ? "Update" : "Kirim"}
                </Button>
              }
            >
              <Form form={form} layout="vertical">
                <Form.Item label="Name" name="play_name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="URL" name="play_url" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Thumbnail" name="play_thumbnail" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Genre" name="play_genre" rules={[{ required: true }]}>
                  <Input placeholder="music, song, movie, education, others" />
                </Form.Item>
                <Form.Item label="Description" name="play_description" rules={[{ required: true }]}>
                  <Input.TextArea />
                </Form.Item>
              </Form>
            </Drawer>

            <Title level={3}>Playlist</Title>
            <Text style={{ fontSize: "14px" }}>Kelola playlist favoritmu di sini!</Text>

            {isLoading ? (
              <div>Loading data playlist...</div>
            ) : (
              <List
                grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                dataSource={playlists}
                renderItem={(item) => (
                  <List.Item key={item?.id_play}>
                    <Card
                      hoverable
                      cover={
                        <img
                          src={item?.play_thumbnail}
                          alt="Thumbnail Playlist"
                          style={{ height: 200, objectFit: "cover", borderRadius: '8px 8px 0 0' }}
                        />
                      }
                      actions={[
                        <EditOutlined key="edit" onClick={() => handleDrawerEdit(item)} />,
                        <PicLeftOutlined key="view" onClick={() => showDetail(item)} />,
                        <Popconfirm
                          key="delete"
                          title="Hapus Data"
                          description={`Yakin ingin menghapus ${item?.play_name}?`}
                          onConfirm={() => confirmDelete(item)}
                          okText="Ya"
                          cancelText="Tidak"
                        >
                          <DeleteOutlined />
                        </Popconfirm>,
                      ]}
                    >
                      <Card.Meta
                        title={<Text strong>{item?.play_name}</Text>}
                        description={<Text>{item?.play_description}</Text>}
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
        title="Detail Playlist"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[]}
      >
        {selectedDetail && (
          <div>
            <p><strong>Nama:</strong> {selectedDetail.play_name}</p>
            <p><strong>Genre:</strong> {selectedDetail.play_genre}</p>
            <p><strong>URL:</strong> <a href={selectedDetail.play_url} target="_blank" rel="noopener noreferrer">{selectedDetail.play_url}</a></p>
            <p><strong>Deskripsi:</strong></p>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", marginBottom: "16px" }}>
              {selectedDetail.play_description}
            </pre>
            <img src={selectedDetail.play_thumbnail} alt="Thumbnail" style={{ width: '100%', borderRadius: '8px' }} />
          </div>
        )}
      </Modal>

      {/* FloatButton dipindah ke sini agar fixed di layar */}
      <FloatButton
        shape="circle"
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={onHandleDrawer}
        style={{ right: 24, bottom: 24 }}
        tooltip="Tambah Playlist"
      />
    </div>
  );
}

export default PlaylistPage;
