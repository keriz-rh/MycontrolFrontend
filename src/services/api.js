import axios from 'axios';

// Configuración de la API con la URL base del backend
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // URL del BackEnd
});

// Función para establecer el token de autenticación
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Verificar si hay un token en el localStorage al cargar la aplicación
const token = localStorage.getItem('token');
if (token) {
    setAuthToken(token);
}

// Interceptor para manejar respuestas de error (como 401 o 403)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token inválido o sin autorización
            localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
            window.location.href = '/login'; // Redirigir a la página de inicio de sesión
        }
        return Promise.reject(error);
    }
);

export default api;
