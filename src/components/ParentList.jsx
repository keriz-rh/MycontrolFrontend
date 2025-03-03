import React, { useEffect, useState } from "react";
import ParentsForm from "./ParentsForm";
import { parentService } from "../services/ParentServices";

function ParentList() {
  const [parents, setParents] = useState([]);
  const [editingParent, setEditingParent] = useState(null);

  useEffect(() => {
    fetchParents();
    
  }, []);

  const fetchParents = async () => {
    try {
      const response = await parentService.getAllParents();
      console.log("Respuesta del backend:", response);
      setParents(response); 
    } catch (error) {
      console.error("Error al obtener los padres:", error);
      setParents([]);
    }
  };

  const handleEdit = (parent) => {
    setEditingParent({
      id_padre: parent.id_padre,
      nombre: parent.nombre_padre, // Mapea nombre_padre a nombre
      direccion: parent.direccion,
      telefono: parent.telefono,
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await parentService.deleteParent(id);
      if (res.success) {
        fetchParents();
      }
    } catch (error) {
      alert("Error al eliminar el padre");
    }
  };

  const handleCancel = () => {
    setEditingParent(null);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>Lista de Padres</h2>
      <button
        onClick={() =>
          setEditingParent({
            id_padre: null,
            nombre: "",
            direccion: "",
            telefono: "",
            id_school: "",
          })
        }
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
        Agregar Padre
      </button>

      {editingParent && (
        <ParentsForm
          parent={editingParent}
          onSave={() => {
            setEditingParent(null);
            fetchParents();
          }}
          onCancel={handleCancel}
        />
      )}

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f1f1f1", borderBottom: "2px solid #ddd" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Dirección</th>
            <th style={thStyle}>Teléfono</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {parents.map((parent, index) => (
            <tr
              key={parent.id_padre}
              style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white" }}
            >
              <td style={tdStyle}>{parent.id_padre}</td>
              <td style={tdStyle}>{parent.nombre_padre}</td>
              <td style={tdStyle}>{parent.direccion}</td>
              <td style={tdStyle}>{parent.telefono}</td>
              <td style={tdStyle}>
                <button style={editButtonStyle} onClick={() => handleEdit(parent)}>
                  Editar
                </button>
                <button
                  style={deleteButtonStyle}
                  onClick={() => handleDelete(parent.id_padre)}
                >
                  Eliminar
                </button>
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
  fontSize: "14px",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  fontSize: "14px",
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

export default ParentList;