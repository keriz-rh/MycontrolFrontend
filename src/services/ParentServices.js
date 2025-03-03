import axios from 'axios';

const API_URL = 'http://localhost:5000/api/parents';

const getToken = () => {
    return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
};

export const parentService = {
    // Obtener todos los padres
    getAllParents: async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            console.log('Respuesta de la API:', response.data); // Inspecciona la respuesta
            return response.data.parents; // Devuelve solo el array de padres
        } catch (error) {
            console.error('Error al obtener los padres:', error);
            throw error;
        }
    },

    // Crear un nuevo padre
    createParent: async (formData) => {
        try {
            const response = await axios.post(API_URL, formData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error al crear el padre:', error);
            throw error;
        }
    },

    // Actualizar un padre existente
    updateParent: async (ParentId, formData) => {
        try {
            const response = await axios.put(`${API_URL}/${ParentId}`, formData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el padre:', error);
            throw error;
        }
    },

    // Eliminar un padre
    deleteParent: async (ParentId) => {
        try {
            const response = await axios.delete(`${API_URL}/${ParentId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error al eliminar el padre:', error);
            throw error;
        }
    },
};