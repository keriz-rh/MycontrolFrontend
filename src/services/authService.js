import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const authService = {
  login: async (usuario, password) => {
    const response = await axios.post(`${API_URL}/login`, { usuario, password });
    return response.data;
  
  },
  
  getUser: async () => {
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  }
};
