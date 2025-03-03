import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import StudentForm from './StudentForm';
import { studentService, createImageURL } from '../services/StudentServices';

function StudentList() {
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await studentService.getStudents();
            console.log('Students fetched:', res); // Depuración
            setStudents(res); // Usa res directamente (es un array)
            toast.success('Estudiantes cargados correctamente');
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents([]); // Establece un array vacío en caso de error
            toast.error('Error al cargar estudiantes');
        }
    };

    const handleEdit = (student) => {
        console.log('Editando estudiante:', student); // Depuración
        
        setEditingStudent({...student});
    };

    const handleDelete = async (id) => {
        console.log('Deleting student with ID:', id); // Depuración
        try {
            const res = await studentService.deleteStudent(id);
            if (res.success) {
                fetchStudents();
                toast.success('Estudiante eliminado correctamente');
            } else {
                toast.error('Error al eliminar el estudiante');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            toast.error('Error al eliminar el estudiante');
        }
    };

    const handleSave = () => {
        setEditingStudent(null); // Cierra el formulario después de guardar
        fetchStudents(); // Actualiza la lista de estudiantes
        toast.success('Estudiante guardado correctamente');
    };

    const handleCancel = () => {
        toast.info('Edición cancelada');
        setEditingStudent(null); // Cierra el formulario
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ textAlign: "center" }}>Lista de Estudiantes</h2>
            <button
                onClick={() => setEditingStudent({})}
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
                Agregar Estudiante
            </button>
            
            {editingStudent && (
                <StudentForm
                    student={editingStudent}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
            
            <div style={{ overflowX: "auto" }}> {/* Contenedor con scroll horizontal */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f1f1f1", borderBottom: "2px solid #ddd" }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Nombre Completo</th>
                            <th style={thStyle}>Dirección</th>
                            <th style={thStyle}>Teléfono</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Género</th>
                            <th style={thStyle}>Escuela</th>
                            <th style={thStyle}>Padres</th>
                            <th style={thStyle}>Foto</th>
                            <th style={thStyle}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={student.id_alumno} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white" }}>
                                <td style={tdStyle}>{student.id_alumno}</td>                               
                                <td style={tdStyle}>{student.nombre_completo}</td>
                                <td style={tdStyle}>{student.direccion}</td>
                                <td style={tdStyle}>{student.telefono}</td>
                                <td style={tdStyle}>{student.email}</td>
                                <td style={tdStyle}>{student.genero === 'M' ? 'Masculino' : 'Femenino'}</td>
                                <td style={tdStyle}>{student.nombre_school}</td>
                                <td style={tdStyle}>
                                    {student.padres && student.padres.length > 0 ? (
                                        <ul>
                                            {student.padres.map((padre, i) => (
                                                <li key={i}>
                                                    {padre.nombre} ({padre.parentesco})
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        "Sin padres vinculados"
                                    )}
                                </td>
                                <td style={tdStyle}>
                                    {student.foto && (
                                        <img
                                            crossOrigin="anonymous"
                                            src={createImageURL(student)}
                                            alt="Foto del estudiante"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    )}
                                </td>
                                <td style={tdStyle}>
                                    <button style={editButtonStyle} onClick={() => handleEdit(student)}>Editar</button>
                                    <button style={deleteButtonStyle} onClick={() => handleDelete(student.id_alumno)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const thStyle = {
    padding: "10px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    fontSize: "14px", // Tamaño de fuente más pequeño
};

const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    fontSize: "14px", // Tamaño de fuente más pequeño
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

export default StudentList;