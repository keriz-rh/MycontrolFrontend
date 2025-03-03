import React, { useState, useEffect } from 'react';
import Map from './Map';
import { toast } from 'react-toastify';
import { studentService, createImageURL } from '../services/StudentServices';

function StudentForm({ student, onSave, onCancel }) {
    const [nombreCompleto, setNombreCompleto] = useState(student.nombre_completo || '');
    const [direccion, setDireccion] = useState(student.direccion || '');
    const [telefono, setTelefono] = useState(student.telefono || '');
    const [email, setEmail] = useState(student.email || '');
    const [foto, setFoto] = useState(null); // Para la nueva foto seleccionada
    const [fotoExistente, setFotoExistente] = useState(student.foto || null); // Guarda referencia a la foto existente
    const [previewFoto, setPreviewFoto] = useState(null); // Para la vista previa
    const [genero, setGenero] = useState(student.genero || 'M');
    const [latitud, setLatitud] = useState(student.latitud || '13.701293');
    const [longitud, setLongitud] = useState(student.longitud || '-89.224063');
    const [idGrado, setIdGrado] = useState(student.id_grado || '');
    const [idSeccion, setIdSeccion] = useState(student.id_seccion || '');
    const [idSchool, setIdSchool] = useState(student.id_school || '');
    const [padres, setPadres] = useState(student.padres || []);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Efecto para establecer la vista previa de la foto cuando student cambia
    useEffect(() => {
        console.log("Student en useEffect:", student);
        if (student && student.foto) {
            // Intentamos establecer la URL de la imagen usando la función auxiliar
            const imageUrl = createImageURL(student);
            console.log("URL de la imagen generada:", imageUrl);
            setPreviewFoto(imageUrl);
            setFotoExistente(student.foto);
        } else {
            setPreviewFoto(null);
            setFotoExistente(null);
        }
    }, [student]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Crear FormData para enviar archivos
        const formData = new FormData();
        formData.append('nombre_completo', nombreCompleto);
        formData.append('direccion', direccion);
        formData.append('telefono', telefono);
        formData.append('email', email);
        formData.append('genero', genero);
        formData.append('latitud', latitud);
        formData.append('longitud', longitud);
        formData.append('id_grado', idGrado);
        formData.append('id_seccion', idSeccion);
        formData.append('id_school', idSchool);
        
        // Si hay una nueva foto seleccionada, agrégala al FormData
        if (foto instanceof File) {
            formData.append('foto', foto);
        } else if (fotoExistente) {
            // Si no hay una nueva foto pero hay una foto existente
            formData.append('mantener_foto_existente', 'true');
            formData.append('foto_existente', fotoExistente);
        }
        
        formData.append('padres', JSON.stringify(padres)); // Enviar padres como JSON

        try {
            let response;
            if (student.id_alumno) {
                response = await studentService.updateStudent(student.id_alumno, formData);
            } else {
                response = await studentService.createStudent(formData);
            }

            if (response.success) {
                toast.success('El estudiante ha sido guardado correctamente.');
                setError(null);
                onSave(); // Llama a la función onSave para actualizar la lista de estudiantes
            } else {
                toast.error(response.message || 'Hubo un error al guardar el estudiante.');
                setSuccess(null);
            }
        } catch (error) {
            toast.error('Hubo un error al guardar el estudiante.');
            setSuccess(null);
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
            // Creamos una URL local para la vista previa
            const objectUrl = URL.createObjectURL(file);
            setPreviewFoto(objectUrl);
            console.log("Nueva foto seleccionada, vista previa:", objectUrl);
        }
    };

    const addParent = () => {
        const newPadres = [...padres, { id_padre: '', parentesco: '' }];
        setPadres(newPadres);
    };
    
    const updateParent = (index, field, value) => {
        const updatedPadres = [...padres];
        updatedPadres[index][field] = value;
        setPadres(updatedPadres);
    };

    const handleCancel = () => {
        // Restablece los valores iniciales del formulario
        setNombreCompleto(student.nombre_completo || '');
        setDireccion(student.direccion || '');
        setTelefono(student.telefono || '');
        setEmail(student.email || '');
        setFoto(null);
        
        // Restaurar la vista previa de la foto del estudiante si existe
        if (student.foto) {
            setPreviewFoto(createImageURL(student));
            setFotoExistente(student.foto);
        } else {
            setPreviewFoto(null);
            setFotoExistente(null);
        }
        
        setGenero(student.genero || 'M');
        setLatitud(student.latitud || '13.701293');
        setLongitud(student.longitud || '-89.224063');
        setIdGrado(student.id_grado || '');
        setIdSeccion(student.id_seccion || '');
        setIdSchool(student.id_school || '');
        setPadres(student.padres || []);
        setError(null);
        setSuccess(null);

        // Llama a la función onCancel para cerrar o limpiar el formulario
        toast.info('Edición cancelada')
        onCancel();
    };

    return (
        <div style={styles.container}>
            {/* Columna del formulario */}
            <div style={styles.formColumn}>
                <h2 style={styles.title}>{student.id_alumno ? 'Editar Estudiante' : 'Crear Estudiante'}</h2>
                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formRow}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Nombre Completo:</label>
                            <input
                                type="text"
                                placeholder="Nombre Completo"
                                value={nombreCompleto}
                                onChange={(e) => setNombreCompleto(e.target.value)}
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
                                onFocus={(e) => (e.target.style.borderColor = '#007bff')}
                                onBlur={(e) => (e.target.style.borderColor = '#ddd')}
                            />
                        </div>
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
                            />
                        </div>
                    </div>
                    <div style={styles.formRow}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Género:</label>
                            <select
                                value={genero}
                                onChange={(e) => setGenero(e.target.value)}
                                style={styles.input}
                            >
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Foto:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFotoChange}
                                style={styles.input}
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
                    <div style={styles.formRow}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>ID Grado:</label>
                            <input
                                type="text"
                                placeholder="ID Grado"
                                value={idGrado}
                                onChange={(e) => setIdGrado(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>ID Sección:</label>
                            <input
                                type="text"
                                placeholder="ID Sección"
                                value={idSeccion}
                                onChange={(e) => setIdSeccion(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>ID Escuela:</label>
                            <input
                                type="text"
                                placeholder="ID Escuela"
                                value={idSchool}
                                onChange={(e) => setIdSchool(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>
    
                    <h3 style={styles.subtitle}>Información de los Padres</h3>
                    {padres.map((padre, index) => (
                        <div key={index} style={styles.parentRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>ID Padre:</label>
                                <input
                                    type="text"
                                    placeholder="ID Padre"
                                    value={padre.id_padre}
                                    onChange={(e) => updateParent(index, 'id_padre', e.target.value)}
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Parentesco:</label>
                                <input
                                    type="text"
                                    placeholder="Parentesco"
                                    value={padre.parentesco}
                                    onChange={(e) => updateParent(index, 'parentesco', e.target.value)}
                                    style={styles.input}
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addParent}
                        style={styles.addButton}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#218838')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#28a745')}
                    >
                        Agregar Padre
                    </button>
    
                    <div style={styles.buttonContainer}>
                        <button
                            type="submit"
                            style={styles.submitButton}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
                        >
                            Guardar Estudiante
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
    subtitle: {
        color: '#555',
        marginBottom: '15px',
        fontSize: '18px',
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
    parentRow: {
        display: 'flex',
        gap: '20px',
        marginBottom: '15px',
    },
    addButton: {
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        alignSelf: 'flex-start',
        transition: 'background-color 0.3s ease',
    },
    addButtonHover: {
        backgroundColor: '#218838',
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

export default StudentForm;