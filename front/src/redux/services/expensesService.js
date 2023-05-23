import axios from 'axios';
const apiUrl = "/expenses";

export const expenses = async (date) => {
    try {
        const response = await axios.get(`${apiUrl}/category/${date}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const average = async () => {
    try {
        const response = await axios.get(`${apiUrl}/average`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const dates = async () => {
    try {
        const response = await axios.get(`${apiUrl}/dates`);
        return response.data;
    } catch (error) {
        throw error;
    }
};