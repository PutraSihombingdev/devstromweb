import React, { useEffect, useState } from 'react';
import {
  Col, Row, Typography, Card, List, FloatButton, Drawer, Form, Input, Button,
  notification, Popconfirm, Modal, Checkbox, Space, Tag, Divider, Avatar, Tooltip
} from 'antd';
import {
  PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined,
  SearchOutlined, SelectOutlined, CloseOutlined, CheckOutlined
} from '@ant-design/icons';
import { getPlaylist, addPlaylist, updatePlaylist, deletePlaylist } from '../../api/playlistApi';

const { Title, Text } = Typography;
const { Meta } = Card;

const genreColors = {
  music: 'magenta',
  song: 'red',
  movie: 'volcano',
  education: 'orange',
  others: 'gold'
};

function PlaylistPage() {
  const [api, contextHolder] = notification.useNotification();
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
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

  const openNotification = (type, title, msg) => {
    api[type]({ message: title, description: msg });
  };

  useEffect(() => {
    loadPlaylist();
  }, []);

  useEffect(() => {
    if (searchInput) {
      const filtered = playlists.filter(item =>
        item.play_name.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.play_genre.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.play_description.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredPlaylists(filtered);
    } else {
      setFilteredPlaylists(playlists);
    }
  }, [searchInput, playlists]);

  const loadPlaylist = async () => {
    setIsLoading(true);
    try {
      const response = await getPlaylist();
      setPlaylists(response?.datas || []);
      setFilteredPlaylists(response?.datas || []);
    } catch (err) {
      console.error(err);
      openNotification('error', 'Load Playlist', 'Failed to load playlist data');
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
        openNotification('success', 'Success', 'Playlist updated successfully');
      } else {
        await addPlaylist(values);
        openNotification('success', 'Success', 'Playlist added successfully');
      }
      loadPlaylist();
      onCloseDrawer();
    } catch (err) {
      console.error(err);
      openNotification('error', 'Error', 'Failed to process data');
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
      openNotification('success', 'Success', 'Playlist deleted successfully');
      loadPlaylist();
    } catch (err) {
      console.error(err);
      openNotification('error', 'Error', 'Failed to delete playlist');
    }
  };

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map(id => deletePlaylist(id)));
      openNotification('success', 'Success', `${selectedIds.length} playlists deleted successfully`);
      setSelectedIds([]);
      loadPlaylist();
      setIsSelectMode(false);
    } catch (err) {
      console.error(err);
      openNotification('error', 'Error', 'Failed to delete playlists');
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

  const handleSelectAll = () => {
    if (selectedIds.length === filteredPlaylists.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPlaylists.map(item => item.id_play));
    }
  };

  return (
    <div className="layout-content" style={{ padding: '24px' }}>
      {contextHolder}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card
            bordered={false}
            style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
          >
            <Drawer
              title={isEdit ? "Edit Playlist" : "Add New Playlist"}
              onClose={onCloseDrawer}
              open={isDrawerOpen}
              width={480}
              extra={
                <Space>
                  <Button onClick={onCloseDrawer}>Cancel</Button>
                  <Button type="primary" onClick={handleSubmit}>
                    {isEdit ? "Update" : "Submit"}
                  </Button>
                </Space>
              }
            >
              <Form form={form} layout="vertical">
                <Form.Item 
                  label="Playlist Name" 
                  name="play_name" 
                  rules={[{ required: true, message: 'Please input playlist name' }]}
                >
                  <Input placeholder="Enter playlist name" />
                </Form.Item>
                <Form.Item 
                  label="URL" 
                  name="play_url" 
                  rules={[
                    { required: true, message: 'Please input URL' },
                    { type: 'url', message: 'Please enter a valid URL' }
                  ]}
                >
                  <Input placeholder="https://example.com/playlist" />
                </Form.Item>
                <Form.Item 
                  label="Thumbnail URL" 
                  name="play_thumbnail" 
                  rules={[
                    { required: true, message: 'Please input thumbnail URL' },
                    { type: 'url', message: 'Please enter a valid URL' }
                  ]}
                >
                  <Input placeholder="https://example.com/image.jpg" />
                </Form.Item>
                <Form.Item 
                  label="Genre" 
                  name="play_genre" 
                  rules={[{ required: true, message: 'Please select genre' }]}
                >
                  <Input placeholder="music, song, movie, education, others" />
                </Form.Item>
                <Form.Item 
                  label="Description" 
                  name="play_description" 
                  rules={[{ required: true, message: 'Please input description' }]}
                >
                  <Input.TextArea rows={4} placeholder="Enter playlist description" />
                </Form.Item>
              </Form>
            </Drawer>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <Title level={3} style={{ margin: 0 }}>My Playlists</Title>
                <Text type="secondary">Manage your favorite playlists</Text>
              </div>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={onHandleDrawer}
                style={{ borderRadius: '6px' }}
              >
                Add Playlist
              </Button>
            </div>

            <Space style={{ marginBottom: 24, width: '100%' }}>
              <Input
                placeholder="Search playlists..."
                prefix={<SearchOutlined />}
                allowClear
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ width: 300, borderRadius: '6px' }}
              />
              <Button 
                icon={isSelectMode ? <CloseOutlined /> : <SelectOutlined />}
                onClick={toggleSelectMode}
                type={isSelectMode ? 'default' : 'default'}
                style={{ borderRadius: '6px' }}
              >
                {isSelectMode ? 'Cancel Selection' : 'Select Items'}
              </Button>
              {isSelectMode && (
                <>
                  <Button 
                    icon={selectedIds.length === filteredPlaylists.length ? <CloseOutlined /> : <CheckOutlined />}
                    onClick={handleSelectAll}
                    style={{ borderRadius: '6px' }}
                  >
                    {selectedIds.length === filteredPlaylists.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  {selectedIds.length > 0 && (
                    <Popconfirm
                      title={`Delete ${selectedIds.length} playlists?`}
                      description="This action cannot be undone."
                      onConfirm={confirmBulkDelete}
                      okText="Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                    >
                      <Button 
                        danger 
                        icon={<DeleteOutlined />}
                        style={{ borderRadius: '6px' }}
                      >
                        Delete ({selectedIds.length})
                      </Button>
                    </Popconfirm>
                  )}
                </>
              )}
            </Space>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Title level={4}>Loading playlists...</Title>
              </div>
            ) : filteredPlaylists.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Title level={4}>No playlists found</Title>
                <Text type="secondary">
                  {searchInput ? 'Try a different search term' : 'Create your first playlist'}
                </Text>
                <div style={{ marginTop: '16px' }}>
                  <Button type="primary" onClick={onHandleDrawer}>Add Playlist</Button>
                </div>
              </div>
            ) : (
              <List
                grid={{
                  gutter: 24,
                  xs: 1,
                  sm: 2,
                  md: 2,
                  lg: 3,
                  xl: 3,
                  xxl: 4
                }}
                dataSource={filteredPlaylists}
                renderItem={(item) => (
                  <List.Item key={item.id_play}>
                    <Card
                      hoverable
                      cover={
                        <div style={{ position: 'relative' }}>
                          <img
                            src={item.play_thumbnail || 'https://via.placeholder.com/300x200?text=No+Thumbnail'}
                            alt="Thumbnail"
                            style={{ 
                              height: 180, 
                              width: '100%',
                              objectFit: 'cover',
                              borderTopLeftRadius: '8px',
                              borderTopRightRadius: '8px'
                            }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x200?text=No+Thumbnail';
                            }}
                          />
                          {isSelectMode && (
                            <Checkbox
                              checked={selectedIds.includes(item.id_play)}
                              onChange={() => handleSelectChange(item.id_play)}
                              style={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                zIndex: 1
                              }}
                            />
                          )}
                        </div>
                      }
                      actions={!isSelectMode ? [
                        <Tooltip title="Edit">
                          <EditOutlined 
                            key="edit" 
                            onClick={() => handleDrawerEdit(item)} 
                            style={{ color: '#1890ff' }}
                          />
                        </Tooltip>,
                        <Tooltip title="View Details">
                          <EyeOutlined 
                            key="view" 
                            onClick={() => showDetail(item)} 
                            style={{ color: '#52c41a' }}
                          />
                        </Tooltip>,
                        <Tooltip title="Delete">
                          <Popconfirm
                            title="Delete this playlist?"
                            description="Are you sure to delete this playlist?"
                            onConfirm={() => confirmDelete(item)}
                            okText="Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true }}
                          >
                            <DeleteOutlined style={{ color: '#ff4d4f' }} />
                          </Popconfirm>
                        </Tooltip>
                      ] : []}
                      style={{ 
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: selectedIds.includes(item.id_play) ? '2px solid #1890ff' : '1px solid #f0f0f0'
                      }}
                    >
                      <Meta
                        avatar={
                          <Avatar 
                            src={item.play_thumbnail} 
                            shape="square"
                            style={{ backgroundColor: '#f0f0f0' }}
                          >
                            {item.play_name.charAt(0).toUpperCase()}
                          </Avatar>
                        }
                        title={
                          <Text strong ellipsis={{ tooltip: item.play_name }}>
                            {item.play_name}
                          </Text>
                        }
                        description={
                          <div>
                            <Tag color={genreColors[item.play_genre] || 'default'}>
                              {item.play_genre}
                            </Tag>
                            <Text 
                              type="secondary" 
                              ellipsis={{ tooltip: item.play_description }}
                              style={{ display: 'block', marginTop: '4px' }}
                            >
                              {item.play_description}
                            </Text>
                          </div>
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

      <Modal
        title="Playlist Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedDetail && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'flex', marginBottom: '24px' }}>
              <img
                src={selectedDetail.play_thumbnail || 'https://via.placeholder.com/300x200?text=No+Thumbnail'}
                alt="Thumbnail"
                style={{ 
                  width: '200px', 
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginRight: '24px'
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Thumbnail';
                }}
              />
              <div>
                <Title level={4} style={{ marginTop: 0 }}>{selectedDetail.play_name}</Title>
                <Tag color={genreColors[selectedDetail.play_genre] || 'default'}>
                  {selectedDetail.play_genre}
                </Tag>
                <div style={{ marginTop: '8px' }}>
                  <a 
                    href={selectedDetail.play_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ wordBreak: 'break-all' }}
                  >
                    {selectedDetail.play_url}
                  </a>
                </div>
              </div>
            </div>
            
            <Divider orientation="left">Description</Divider>
            <div style={{ 
              background: '#f9f9f9', 
              padding: '16px', 
              borderRadius: '6px',
              whiteSpace: 'pre-wrap'
            }}>
              {selectedDetail.play_description || 'No description provided'}
            </div>
          </div>
        )}
      </Modal>

      <FloatButton
        shape="circle"
        type="primary"
        icon={<PlusOutlined />}
        onClick={onHandleDrawer}
        style={{ right: 24, bottom: 24 }}
        tooltip="Add New Playlist"
      />
    </div>
  );
}

export default PlaylistPage;