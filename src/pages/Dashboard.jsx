import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MapD from "../components/MapD";
import { studentService } from "../services/StudentServices"; 
import { schoolService } from "../services/SchoolServices"; 

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [latitud, setLatitud] = useState("13.701293");
  const [longitud, setLongitud] = useState("-89.224063");
  const [alumnos, setAlumnos] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const userLocalStorage = getUserLocalStorage();
      if (userLocalStorage) {
        setUser(userLocalStorage);
      } else {
        navigate("/login");
      }
    }

    // Obtener los datos de los alumnos y las escuelas
    if (user && user.tipo === "Administrador") {
      fetchStudents();
    }

    fetchSchools();
  }, [user, navigate, setUser]);

  const fetchStudents = async () => {
    try {
      const res = await studentService.getStudents();
      console.log("Students fetched:", res); // Debugging

      // Format student data with photo URL and school name
      const alumnosFormateados = res.map((alumno) => ({
        ...alumno,
      }));

      setAlumnos(alumnosFormateados); // Usa los datos formateados
    } catch (error) {
      console.error("Error fetching students:", error);
      setAlumnos([]); // Establece un array vacío en caso de error
    }
  };

  const fetchSchools = async () => {
    try {
      const res = await schoolService.getSchools();
      console.log("Schools fetched:", res); // Depuración

      // Formatear las rutas de las fotos de las escuelas usando createSchoolImageURL
      const escuelasFormateadas = res.data.map((escuela) => ({
        ...escuela,
      }));

      setEscuelas(escuelasFormateadas); // Usa los datos formateados
    } catch (error) {
      console.error("Error fetching schools:", error);
      setEscuelas([]); // Establece un array vacío en caso de error
    }
  };

  function getUserLocalStorage() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  const handleMapClick = (e) => {
    setLatitud(e.latLng.lat());
    setLongitud(e.latLng.lng());
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <img src="/images/logo.jpg" alt="Logo" style={styles.logoImage} />
        </div>
        <nav style={styles.nav}>
          <a href="#" style={styles.link}>
            Dashboard
          </a>
          <a href="/schools" style={styles.link}>
            Escuelas
          </a>
          {user && user.tipo === "Administrador" && (
            <a href="/parents" style={styles.link}>
              Padres
            </a>
          )}
          {user && user.tipo === "Administrador" && (
            <a href="/students" style={styles.link}>
              Alumnos
            </a>
          )}
          {user && user.tipo === "Administrador" && (
            <a href="/reports" style={styles.link}>
              Reportes
            </a>
          )}
        </nav>
      </div>
      <div style={styles.containerMapa}>
        <MapD
          lat={latitud}
          lng={longitud}
          onMapClick={handleMapClick}
          alumnos={alumnos}
          escuelas={escuelas}
        />
      </div>
      <div style={styles.content}>
        <a href="#" style={styles.userProfile}>
          {user && user.tipo === "Administrador" ? "Administrador" : "Usuario"}
        </a>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}
          style={styles.button}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    width: "100%",
    height: "100vh",
    border: "1px solid lightblue",
  },
  containerMapa: {
    flex: 1, // Para que ocupe el espacio restante del contenedor
    height: "100%",
    width: "100%",
    backgroundColor: "gray", // Fondo rojo para el mapa
    position: "relative", // Asegura que el mapa ocupe todo el espacio
  },
  sidebar: {
    width: "200px",
    background: "#f8f9fa",
    borderRight: "1px solid lightblue",
    padding: "10px",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#3366cc",
  },
  logoImage: {
    width: "100%",
    height: "auto",
    borderRadius: "10px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease-in-out",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f8f9fa",
  },
  link: {
    textDecoration: "none",
    color: "#3366cc",
    marginBottom: "10px",
    fontSize: "16px",
  },
  content: {
    position: "absolute", // Posiciona el contenido sobre el mapa
    top: "10px",
    right: "10px",
    zIndex: 1000, // Asegura que esté por encima del mapa
  },
  userProfile: {
    fontSize: "14px",
    color: "#3366cc",
    backgroundColor: "white", // Fondo amarillo para el tipo de usuario
    padding: "5px 10px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};
export default Dashboard;
