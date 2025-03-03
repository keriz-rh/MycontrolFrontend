import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { parentService } from '../services/ParentServices';

function ParentsForm({ parent, onSave, onCancel }) { 

    const [nombre, setNombre] = useState(parent?.nombre || '');
    const [direccion, setDireccion] = useState(parent?.direccion || '');
    const [telefono, setTelefono] = useState(parent?.telefono || '');
    const [id_school, setIdSchool] = useState(parent?.id_school || '');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (parent) {
            setNombre(parent.nombre || '');
            setDireccion(parent.direccion || '');
            setTelefono(parent.telefono || '');
            setIdSchool(parent.id_school || '');
        }
    }, [parent]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const parentData = {
            nombre,
            direccion,
            telefono,
            id_school,
        };

        try {
            if (parent?.id_padre) {
                await parentService.updateParent(parent.id_padre, parentData);
                toast.success('El padre ha sido actualizado correctamente.');
            } else {
                await parentService.createParent(parentData);
            }
            toast.success('El padre ha sido guardado correctamente.');
            setError(null);
            onSave();
        } catch (error) {
            toast.error('Hubo un error al guardar el padre.');
            setSuccess(null);
            console.error('Error en handleSubmit:', error);
        }
    };

    const handleCancel = () => {
        // Restablece los valores iniciales del formulario
        setNombre(parent?.nombre || '');
        setDireccion(parent?.direccion || '');
        setTelefono(parent?.telefono || '');
        setIdSchool(parent?.id_school || '');
        setError(null);
        setSuccess(null);

        // Llama a la función onCancel para cerrar o limpiar el formulario
        toast.info('Edición cancelada')
        onCancel();
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>{parent?.id_padre ? 'Editar Padre' : 'Crear Padre'}</h2>
            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>{success}</div>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Nombre del Padre:</label>
                        <input
                            type="text"
                            placeholder="Nombre del padre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Dirección:</label>
                        <input
                            type="text"
                            placeholder="Dirección"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>
                </div>
                <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Teléfono:</label>
                        <input
                            type="text"
                            placeholder="Teléfono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>
                </div>
                <div style={styles.buttonContainer}>
                    <button
                        type="submit"
                        style={styles.submitButton}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
                    >
                        Guardar
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={styles.cancelButton}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#d32f2f')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#f44336')}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

const styles = {
    container: {
        width: '100%',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        textAlign: 'left',
        color: '#333',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    formRow: {
        display: 'flex',
        gap: '20px',
        marginBottom: '15px',
    },
    formGroup: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        alignItems: 'flex-start',
    },
    label: {
        fontWeight: 'bold',
        color: '#555',
        fontSize: '14px',
    },
    input: {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '14px',
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#fafafa',
        transition: 'border-color 0.3s ease',
    },
    inputFocus: {
        borderColor: '#007bff',
    },
    buttonContainer: {
        display: 'flex',
        gap: '10px',
        marginTop: '20px',
        justifyContent: 'flex-start',
    },
    submitButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        width: '150px',
        transition: 'background-color 0.3s ease',
    },
    submitButtonHover: {
        backgroundColor: '#0056b3',
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        width: '150px',
        transition: 'background-color 0.3s ease',
    },
    cancelButtonHover: {
        backgroundColor: '#d32f2f',
    },
    error: {
        color: '#dc3545',
        marginBottom: '15px',
        textAlign: 'left',
        fontSize: '14px',
    },
    success: {
        color: '#28a745',
        marginBottom: '15px',
        textAlign: 'left',
        fontSize: '14px',
    },
};

export default ParentsForm;