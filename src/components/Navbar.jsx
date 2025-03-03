import React, { useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado al cargar el componente
  useEffect(() => {
    if (!user) {
      const userLocalStorage = getUserLocalStorage();
      if (userLocalStorage) {
        setUser(userLocalStorage);
      } else {
        navigate('/login');
      }
    }
  }, [user, navigate, setUser]);

  // Si estamos en el Dashboard o en login, no renderizamos la Navbar
  if (location.pathname === '/' || location.pathname === '/login') {
    return null;
  }

  // Obtener el usuario del localStorage
  function getUserLocalStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.logo}><Link to="/" style={styles.link}>
          <img src="/images/logo.jpg" alt="Logo" style={styles.logoImage} /> 
          </Link>
        </div>
        <ul style={styles.ul}>
          <li style={styles.li}><Link to="/" style={styles.link}>Dashboard</Link></li>
          <li style={styles.li}><Link to="/schools" style={styles.link}>Escuelas</Link></li>
          {user && user.tipo === 'Administrador' && (
            <>
              <li style={styles.li}><Link to="/parents" style={styles.link}>Padres</Link></li>
              <li style={styles.li}><Link to="/students" style={styles.link}>Alumnos</Link></li>
              <li style={styles.li}><Link to="/reports" style={styles.link}>Reportes</Link></li>
            </>
          )}
          <li style={{ ...styles.li, marginLeft: 'auto' }}>
            <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} style={styles.button}>
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#2c3e50',
    padding: '10px 20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    marginRight: '20px',
  },
  logoImage: {
    height: '40px',
  },
  ul: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  li: {
    marginRight: '20px',
  },
  link: {
    color: '#ecf0f1',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'color 0.3s ease',
  },
  button: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  },
};

export default Navbar;