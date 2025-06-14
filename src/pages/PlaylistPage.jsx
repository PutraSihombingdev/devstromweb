import React, { useEffect, useState } from 'react';
import {
  Col, Row, Typography, Card, List, FloatButton, Drawer, Form, Input, Button,
  notification, Popconfirm, Modal, Checkbox, Space
} from 'antd';
import {
  PlusCircleOutlined, EditOutlined, PicLeftOutlined, DeleteOutlined
} from '@ant-design/icons';
import { getPlaylist, addPlaylist, updatePlaylist, deletePlaylist } from '../api/playlistApi';

const { Title, Text } = Typography;

function PlaylistPage() {
  const [api, contextHolder] = notification.useNotification();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [form] = Form.useForm();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

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
      setPlaylists(response?.datas || []);
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

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map(id => deletePlaylist(id)));
      openNotification('success', 'Hapus Playlist', 'Berhasil menghapus data terpilih');
      setSelectedIds([]);
      loadPlaylist();
      setIsSelectMode(false);
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

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedIds([]);
  };

  const handleSelectChange = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
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
                <Form.Item label="Nama Playlist" name="play_name" rules={[{ required: true, message: 'Wajib diisi' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="URL" name="play_url" rules={[{ required: true, message: 'Wajib diisi' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Thumbnail" name="play_thumbnail" rules={[{ required: true, message: 'Wajib diisi' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Genre" name="play_genre" rules={[{ required: true, message: 'Wajib diisi' }]}>
                  <Input placeholder="music, song, movie, education, others" />
                </Form.Item>
                <Form.Item label="Deskripsi" name="play_description" rules={[{ required: true, message: 'Wajib diisi' }]}>
                  <Input.TextArea />
                </Form.Item>
              </Form>
            </Drawer>

            <Title level={3}>Playlist</Title>
            <Text style={{ fontSize: "14px" }}>Kelola playlist terbaik mu disni!</Text>

            <Space style={{ marginBottom: 16, marginTop: 12 }}>
              <Input
                placeholder="Cari playlist..."
                allowClear
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ width: 250 }}
              />
              <Button type="primary" onClick={() => setSearchKeyword(searchInput)}>
                Cari
              </Button>
              <Button onClick={toggleSelectMode}>
                {isSelectMode ? "Batal Pilih" : "Pilih Playlist"}
              </Button>
              {isSelectMode && selectedIds.length > 0 && (
                <Popconfirm
                  title="Hapus Playlist"
                  description={`Yakin ingin menghapus ${selectedIds.length} playlist?`}
                  onConfirm={confirmBulkDelete}
                  okText="Ya"
                  cancelText="Tidak"
                >
                  <Button danger>Hapus {selectedIds.length} Terpilih</Button>
                </Popconfirm>
              )}
            </Space>

            {isLoading ? (
              <div>Loading data playlist...</div>
            ) : (
              <List
                grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                dataSource={playlists.filter(item =>
                  item.play_name.toLowerCase().includes(searchKeyword.toLowerCase())
                )}
                renderItem={(item) => (
                  <List.Item key={item.id_play}>
                    <Card
                      hoverable
                      cover={
                        <img
                          src={item.play_thumbnail}
                          alt="Thumbnail"
                          style={{ height: 200, objectFit: "cover", borderRadius: '8px 8px 0 0' }}
                        />
                      }
                      actions={!isSelectMode ? [
                        <EditOutlined key="edit" onClick={() => handleDrawerEdit(item)} />,
                        <PicLeftOutlined key="view" onClick={() => showDetail(item)} />,
                        <Popconfirm
                          key="delete"
                          title="Hapus Playlist"
                          description={`Yakin ingin menghapus ${item.play_name}?`}
                          onConfirm={() => confirmDelete(item)}
                          okText="Ya"
                          cancelText="Tidak"
                        >
                          <DeleteOutlined />
                        </Popconfirm>
                      ] : []}
                    >
                      {isSelectMode && (
                        <Checkbox
                          checked={selectedIds.includes(item.id_play)}
                          onChange={() => handleSelectChange(item.id_play)}
                        >
                          Pilih
                        </Checkbox>
                      )}
                      <Card.Meta
                        title={<Text strong>{item.play_name}</Text>}
                        description={<Text>{item.play_description}</Text>}
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
            <img
              src={selectedDetail.play_thumbnail}
              alt="Thumbnail"
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </div>
        )}
      </Modal>

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
}//tes

export default PlaylistPage;
