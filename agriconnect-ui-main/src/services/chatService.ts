
import axios from 'axios';

// Assuming vite proxy or base URL config
const API_URL = '/api/chat';

const getHeaders = () => {
    const token = localStorage.getItem('token'); // or however auth is stored
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const fetchChats = async () => {
    const response = await axios.get(API_URL, getHeaders());
    return response.data;
};

export const accessChat = async (userId: string) => {
    const response = await axios.post(API_URL, { userId }, getHeaders());
    return response.data;
};

export const sendMessage = async (chatId: string, content: string) => {
    try {
        const response = await axios.post(`${API_URL}/message`, { chatId, content }, getHeaders());
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw error.response.data; // Should contain message and code
        }
        throw error;
    }
};

export const subscribe = async () => {
    const response = await axios.post('/api/subscription', {}, getHeaders());
    return response.data;
}

export const fetchExperts = async () => {
    const response = await axios.get('/api/users/experts', getHeaders());
    return response.data;
};
