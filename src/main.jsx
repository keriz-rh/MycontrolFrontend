import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa desde 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Importa el AuthProvider
import { ToastContainer, toast } from 'react-toastify';

import App from './App';

import './App.css';

// Crea un root para la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza la aplicación dentro del root
root.render(
    <BrowserRouter>
        <AuthProvider> {/* Envuelve la aplicación con AuthProvider */}
            <App />
            <ToastContainer />
        </AuthProvider>
    </BrowserRouter>
);