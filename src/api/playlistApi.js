import axios from 'axios';

const API_URL = 'https://webfmsi.singapoly.com/api/playlist/47';


export const getPlaylist = async () => {
    try {
        const response = await axios.get(API_URL); 
                return response.data;
    } catch (error) {
        throw error;
    }
};


// ✅ FUNGSI POST
export const addPlaylist = async (data) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ✅ FUNGSI UPDATE
export const updatePlaylist = async (id, data) => {
    try {
        const response = await axios.post(`https://webfmsi.singapoly.com/api/playlist/update/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ✅ FUNGSI DELETE
export const deletePlaylist = async (id) => {
    try {
        const response = await axios.delete(`https://webfmsi.singapoly.com/api/playlist/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
