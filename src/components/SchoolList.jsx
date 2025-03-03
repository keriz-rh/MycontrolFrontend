import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";
import SchoolForm from "./SchoolForm";
import { schoolService, createImageURL } from "../services/SchoolServices";

function SchoolList() {
    const { user, setUser } = useAuth();
    const [schools, setSchools] = useState([]);
    const [editingSchool, setEditingSchool] = useState(null);

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            const res = await schoolService.getSchools();
            setSchools(res.data);
            toast.success('Escuelas cargadas correctamente');
        } catch (error) {
            console.error("Error fetching schools:", error);
            toast.error('Error al cargar escuelas');
            setSchools([]);
        }
    };

    const handleEdit = (school) => {
        // Asegúrate de que la escuela tenga la foto existente
        setEditingSchool({ ...school });
    };

    const handleDelete = async (id) => {
        try {
            const res = await schoolService.deleteSchool(id);
            if (res.success) {
                fetchSchools();
            }
        } catch (error) {
            console.error("Error deleting school:", error);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ textAlign: "center" }}>Lista de Escuelas</h2>
            <button
                onClick={() => setEditingSchool({})}
                style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    marginBottom: "15px",
                    cursor: "pointer",
                    borderRadius: "5px",
                }}
            >
                Agregar Escuela
            </button>

            {editingSchool && (
                <SchoolForm
                    school={editingSchool}
                    onSave={() => {
                        setEditingSchool(null);
                        fetchSchools();
                    }}
                    onCancel={() => setEditingSchool(null)}
                />
            )}

            <table
                style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
            >
                <thead>
                    <tr
                        style={{
                            backgroundColor: "#f1f1f1",
                            borderBottom: "2px solid #ddd",
                        }}
                    >
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Nombre</th>
                        <th style={thStyle}>Dirección</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Foto</th>
                        <th style={thStyle}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {schools.map((school, index) => (
                        <tr
                            key={school.id_school}
                            style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white" }}
                        >
                            <td style={tdStyle}>{school.id_school}</td>
                            <td style={tdStyle}>{school.nombre}</td>
                            <td style={tdStyle}>{school.direccion}</td>
                            <td style={tdStyle}>{school.email}</td>
                            <td style={tdStyle}>
                                {school.foto ? (
                                    <img
                                        crossOrigin="anonymous"
                                        src={createImageURL(school)}
                                        alt="Foto de la escuela"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    "No disponible"
                                )}
                            </td>
                            <td style={tdStyle}>
                                <button
                                    style={editButtonStyle}
                                    onClick={() => handleEdit(school)}
                                >
                                    Editar
                                </button>
                                {user && user.tipo === "Administrador" && (
                                    <button
                                        style={deleteButtonStyle}
                                        onClick={() => handleDelete(school.id_school)}
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const thStyle = {
    padding: "10px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
};

const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #ddd",
};

const editButtonStyle = {
    backgroundColor: "#008CBA",
    color: "white",
    border: "none",
    padding: "8px 12px",
    marginRight: "5px",
    cursor: "pointer",
    borderRadius: "5px",
};

const deleteButtonStyle = {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "5px",
};

export default SchoolList;