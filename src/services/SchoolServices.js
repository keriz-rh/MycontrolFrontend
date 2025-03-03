import axios from 'axios';

const API_URL = 'http://localhost:5000/api/schools';

export const createImageURL = (school) => {
  return `http://localhost:5000/${school.foto.replace("\\", "/")}`;
};

const getToken = () => {
  return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
};
export const schoolService = {
  
  getSchools: async () => {
    const response = await axios.get(API_URL,
      {
        //barear
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  },
  createSchool: async (formData) => {
    const response = await axios.post(API_URL, formData,
      {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },
  updateSchool: async (schoolId, formData) => {
    const response = await axios.put(`${API_URL}/${schoolId}`, formData,{
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },
  deleteSchool: async (schoolId) => {
    const response = await axios.delete(`${API_URL}/${schoolId}`,{
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  }
};
