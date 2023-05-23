import axios from 'axios';
const apiUrl = "http://localhost:3300/expenses";

export const getCsv = async (rowCount) => {
    try {
        const response = await axios.get(`${apiUrl}/export/${rowCount}`,{
            responseType: 'blob', // Indique que le type de données attendu est un Blob
          });
        return response.data;
    } catch (error) {
        throw error;
    }
};