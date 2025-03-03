import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated } = useAuth();

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Verificar los roles solo si se especifican roles permitidos
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.tipo)) {
        // Si el usuario no tiene un rol permitido, redirigir al dashboard con un mensaje
        return <Navigate to="/" />;
    }

    // Si todo está bien, renderizar el componente hijo
    return children;
};

export default ProtectedRoute;