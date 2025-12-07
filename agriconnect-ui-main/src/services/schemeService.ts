import axios from 'axios';

const API_URL = '/api/schemes';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const fetchSchemes = async () => {
    // API is now public for GET, so no headers needed (or optional)
    const response = await axios.get("http://localhost:5000/api/schemes");
    return response.data;
};

export const createScheme = async (schemeData: any) => {
    const response = await axios.post("http://localhost:5000/api/schemes", schemeData, getHeaders());
    return response.data;
};
