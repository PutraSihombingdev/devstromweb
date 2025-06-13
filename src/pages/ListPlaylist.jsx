import React, { useEffect, useState } from 'react';
import { getPlaylist } from '../api/playlistApi';
import { Table } from 'antd';

function ListPlaylist() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchPlaylist();
    }, []);

    const fetchPlaylist = async () => {
        try {
            const response = await getPlaylist();
            console.log('Response:', response); // Pastikan ada datanya
            setData(response.data);
        } catch (error) {
            console.error('Error fetching playlist:', error);
        }
    };

    const columns = [
        { title: 'Name', dataIndex: 'play_name' },
        { title: 'Genre', dataIndex: 'play_genre' },
        { title: 'Description', dataIndex: 'play_description' },
        {
            title: 'URL',
            dataIndex: 'play_url',
            render: (url) => <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
        },
        {
            title: 'Thumbnail',
            dataIndex: 'play_thumbnail',
            render: (thumbnail) => <img src={thumbnail} alt="Thumbnail" width="100" />
        }
    ];

    return (
        <Table columns={columns} dataSource={data} rowKey="id_play" />
    );
}

export default ListPlaylist;
