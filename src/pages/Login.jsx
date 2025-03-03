import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            login(usuario, password);
        } catch (error) {
            alert('Credenciales inválidas');
        }
    };

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: 'auto',
            background: '#f9f9f9',
            padding: '20px',
            width: '100%',
            maxWidth: '600px'
        },
        logoContainer: {
            marginBottom: '20px',
            textAlign: 'center'
        },
        logoImage: {
            maxWidth: '200px',
            height: 'auto'
        },
        title: {
            fontSize: '2em',
            color: '#333',
            marginBottom: '20px'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            padding: '20px',
            background: '#fff',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '400px'
        },
        input: {
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1em'
        },
        button: {
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1em',
            transition: 'background-color 0.3s'
        },
        buttonHover: {
            backgroundColor: '#0056b3'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.logoContainer}>
                <img 
                    src="/images/logo_empresa.jpg" 
                    alt="Logo de la Empresa" 
                    style={styles.logoImage} 
                />
            </div>
            
            <h2 style={styles.title}>Iniciar Sesión</h2>
            <form style={styles.form} onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Usuario" 
                    value={usuario} 
                    onChange={(e) => setUsuario(e.target.value)} 
                    style={styles.input}
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={styles.input}
                />
                <button 
                    type="submit" 
                    style={styles.button}
                    onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                >
                    Ingresar
                </button>
            </form>
        </div>
    );
}

export default Login;