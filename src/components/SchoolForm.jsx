import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import Map from './Map';
import { useAuth } from '../context/AuthContext';
import { schoolService, createImageURL } from '../services/SchoolServices';

function SchoolForm({ school, onSave, onCancel }) {
    const { user, setUser } = useAuth();
    const [nombre, setNombre] = useState(school.nombre || '');
    const [direccion, setDireccion] = useState(school.direccion || '');
    const [email, setEmail] = useState(school.email || '');
    const [foto, setFoto] = useState(null); // Para la nueva foto seleccionada
    const [fotoExistente, setFotoExistente] = useState(school.foto || null); // Guarda referencia a la foto existente
    const [previewFoto, setPreviewFoto] = useState(null); // Para la vista previa
    const [latitud, setLatitud] = useState(school.latitud || '13.701293');
    const [longitud, setLongitud] = useState(school.longitud || '-89.224063');
    const [id_user, setIdUser] = useState(school.id_user || '');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const fileInputRef = useRef(null);

    // Efecto para establecer la vista previa de la foto cuando school cambia
    useEffect(() => {
        if (school && school.foto) {
            const imageUrl = createImageURL(school);
            setPreviewFoto(imageUrl);
            setFotoExistente(school.foto);
        } else {
            setPreviewFoto(null);
            setFotoExistente(null);
        }
    }, [school]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('direccion', direccion);
        formData.append('email', email);
        formData.append('latitud', latitud);
        formData.append('longitud', longitud);
        formData.append('id_user', id_user);

        // Manejo de la foto
        if (foto instanceof File) {
            formData.append('foto', foto);
        } else if (fotoExistente) {
            formData.append('mantener_foto_existente', 'true');
            formData.append('foto_existente', fotoExistente);
        }

        try {
            if (school.id_school) {
                await schoolService.updateSchool(school.id_school, formData);
                toast.success('Escuela actualizada correctamente');
            } else {
                await schoolService.createSchool(formData);
                toast.success('Escuela creada correctamente');
            }
            onSave();
        } catch (error) {
            toast.error('Hubo un error al guardar la escuela');
            console.error('Error en handleSubmit:', error);
        }
    };

    const handleMapClick = (e) => {
        setLatitud(e.latLng.lat());
        setLongitud(e.latLng.lng());
    };

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(file);
            setPreviewFoto(URL.createObjectURL(file));
        }
    };

    const handleCancel = () => {
        // Restablece los valores iniciales del formulario
        setNombre(school.nombre || '');
        setDireccion(school.direccion || '');
        setEmail(school.email || '');
        setFoto(null);
        setFotoExistente(school.foto || null);
        setPreviewFoto(school.foto ? createImageURL(school) : null);
        setLatitud(school.latitud || '13.701293');
        setLongitud(school.longitud || '-89.224063');
        setIdUser(school.id_user || '');
        setError(null);
        setSuccess(null);

        // Resetea el input de tipo file
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        toast.info('Edición cancelada');
        onCancel();
    };

    return (
        <div style={styles.container}>
            {/* Columna del formulario */}
            <div style={styles.formColumn}>
                <h2 style={styles.title}>{school.id_school ? 'Editar Escuela' : 'Crear Escuela'}</h2>
                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    {user && user.tipo === 'Administrador' && (
                        <>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Nombre:</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        style={styles.input}
                                        onFocus={(e) => (e.target.style.borderColor = '#007bff')}
                                        onBlur={(e) => (e.target.style.borderColor = '#ddd')}
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
                                        onFocus={(e) => (e.target.style.borderColor = '#007bff')}
                                        onBlur={(e) => (e.target.style.borderColor = '#ddd')}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Email:</label>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={styles.input}
                                        onFocus={(e) => (e.target.style.borderColor = '#007bff')}
                                        onBlur={(e) => (e.target.style.borderColor = '#ddd')}
                                        required
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>ID Usuario:</label>
                                    <input
                                        type="text"
                                        placeholder="ID Usuario"
                                        value={id_user}
                                        onChange={(e) => setIdUser(e.target.value)}
                                        style={styles.input}
                                        onFocus={(e) => (e.target.style.borderColor = '#007bff')}
                                        onBlur={(e) => (e.target.style.borderColor = '#ddd')}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Foto:</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFotoChange}
                                        style={styles.input}
                                        ref={fileInputRef}
                                    />
                                    {previewFoto && (
                                        <div>
                                            <p style={styles.fotoLabel}>Vista previa:</p>
                                            <img 
                                                src={previewFoto} 
                                                alt="Vista previa" 
                                                style={styles.previewImage} 
                                                crossOrigin="anonymous"
                                            />

                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
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
    
            {/* Columna del mapa */}
            <div style={styles.mapColumn}>
                <div style={styles.mapContainer}>
                    <Map lat={latitud} lng={longitud} onMapClick={handleMapClick} />
                </div>
            </div>
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
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-start',
    },
    formColumn: {
        flex: 1,
        maxWidth: '60%',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    mapColumn: {
        flex: 1,
        maxWidth: '40%',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
        gap: '50px',
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
    fotoLabel: {
        marginTop: '5px',
        marginBottom: '5px',
        fontSize: '12px',
        color: '#666',
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
    previewImage: {
        maxWidth: '200px',
        maxHeight: '150px',
        marginTop: '5px',
        borderRadius: '6px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        objectFit: 'cover',
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
    mapContainer: {
        height: '400px',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
};

export default SchoolForm;