import axios from 'axios';

const API_URL = 'http://localhost:5000/api/students';

export const createImageURL = (student) => {
  return student.foto ? `http://localhost:5000/${student.foto.replace('\\', '/')}` : null;
};

const getToken = () => {
  return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
};

export const studentService = {
  getStudents: async () => {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data.students;
  },

  getStudentById: async (studentId) => {
    const response = await axios.get(`${API_URL}/${studentId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  createStudent: async (formData) => {
    const response = await axios.post(API_URL, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  updateStudent: async (studentId, formData) => {
    const response = await axios.put(`${API_URL}/${studentId}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  deleteStudent: async (studentId) => {
    console.log('Deleting student with ID:', studentId); // Depuración
    if (!studentId) {
      throw new Error('ID del alumno no proporcionado');
    }

    const response = await axios.delete(`${API_URL}/${studentId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },
};