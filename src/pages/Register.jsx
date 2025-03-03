import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [id_school, setIdSchool] = useState(''); // Campo obligatorio para usuarios normales
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validar campos vacíos
        if (!nombre || !usuario || !password || !id_school) {
            alert('Por favor, completa todos los campos');
            return;
        }

        try {
            // Enviar los datos al BackEnd
            const response = await api.post('/auth/register', {
                nombre,
                usuario,
                password,
                tipo: 'Usuario', // Forzar el tipo de usuario como "Usuario"
                id_school, // ID de la escuela (obligatorio)
            });

            // Si el registro es exitoso, el backend debe devolver un token
            localStorage.setItem('token', response.data.token);

            // Configurar el token en las cabeceras de axios
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            // Redirigir al usuario a la página de login
            alert('Registro exitoso! Ahora puedes iniciar sesión.');
            navigate('/login'); // Redirige a la página de login
        } catch (error) {
            console.error('Error en el registro:', error);
            alert(error.response ? error.response.data.message : 'Error al registrar el usuario');
        }
    };

    return (
        <div>
            <h1>Registro</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="ID de la escuela"
                    value={id_school}
                    onChange={(e) => setIdSchool(e.target.value)}
                    required
                />
                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
};

export default Register;
