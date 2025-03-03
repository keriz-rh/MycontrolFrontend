import React, { useEffect, useState } from 'react';
import { studentService, createImageURL } from '../services/StudentServices';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function StudentReportForm() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        nombre: '',
        direccion: '',
        email: ''
    });
    const [uniqueValues, setUniqueValues] = useState({
        nombres: [],
        direcciones: [],
        emails: []
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (students.length > 0) {
            // Extraer valores únicos para los filtros
            const nombres = [...new Set(students.map(s => s.nombre_completo))].sort();
            const direcciones = [...new Set(students.map(s => s.direccion))].sort();
            const emails = [...new Set(students.map(s => s.email))].sort();
            
            setUniqueValues({
                nombres,
                direcciones,
                emails
            });
        }
    }, [students]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await studentService.getStudents();
            console.log('Students fetched:', res); // Depuración
            
            // Usar res.data como en StudentList
            if (res && res.data) {
                setStudents(res.data);
            } else {
                // Mantener compatibilidad con el código original en caso de que res sea directamente el array
                setStudents(Array.isArray(res) ? res : []);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents([]); // Establece un array vacío en caso de error
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const resetFilters = () => {
        setFilters({
            nombre: '',
            direccion: '',
            email: ''
        });
    };

    const getFilteredStudents = () => {
        return students.filter(student => {
            return (
                (filters.nombre === '' || student.nombre_completo.toLowerCase().includes(filters.nombre.toLowerCase())) &&
                (filters.direccion === '' || student.direccion.toLowerCase().includes(filters.direccion.toLowerCase())) &&
                (filters.email === '' || student.email.toLowerCase().includes(filters.email.toLowerCase()))
            );
        });
    };

    const generatePDF = async () => {
        const filteredStudents = getFilteredStudents();
        if (filteredStudents.length === 0) {
            alert('No hay estudiantes que cumplan con los filtros seleccionados');
            return;
        }
    
        // Crear documento PDF
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
    
        // Agregar encabezado
        doc.setFontSize(18);
        doc.setTextColor(0, 102, 204);
        const title = 'Reporte de Estudiantes';
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - titleWidth) / 2, 15);
    
        // Agregar información de filtros
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        let filterText = 'Filtros aplicados: ';
        if (filters.nombre) filterText += `Nombre: ${filters.nombre}, `;
        if (filters.direccion) filterText += `Dirección: ${filters.direccion}, `;
        if (filters.email) filterText += `Email: ${filters.email}, `;
        if (filterText === 'Filtros aplicados: ') filterText += 'Ninguno';
        else filterText = filterText.slice(0, -2); 
        doc.text(filterText, 14, 22);
    
        // Agregar fecha del reporte
        const today = new Date();
        const dateStr = today.toLocaleDateString('es-ES');
        doc.text(`Fecha de generación: ${dateStr}`, pageWidth - 60, 22);
    
        // Tabla con datos de los estudiantes
        const tableColumn = ['ID', 'Nombre Completo', 'Email', 'Encargados', 'foto'];
        const tableRows = [];
    
        filteredStudents.forEach((student) => {
            const parentNames = student.padres?.map(padre => `${padre.nombre} (${padre.parentesco})`).join(', ') || 'Sin encargados';
            const studentData = [
                student.id_alumno,
                student.nombre_completo,
                student.email,
                parentNames
            ];
            tableRows.push(studentData);
        });
    
        // Crear la tabla
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            headStyles: {
                fillColor: [51, 122, 183],
                textColor: 255,
                fontSize: 11
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            },
            margin: { top: 30 },
            didDrawPage: (data) => {
                // Pie de página con números de página
                doc.setFontSize(10);
                const pageCount = doc.internal.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    const pageSize = doc.internal.pageSize;
                    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                    doc.text(`Página ${i} de ${pageCount}`, data.settings.margin.left, pageHeight - 10);
                }
            }
        });
    
        // Add detailed student information with photos
        let yPos = doc.lastAutoTable.finalY + 20;
        doc.addPage();
    
        doc.setFontSize(14);
        doc.setTextColor(0, 102, 204);
        doc.text('Detalles de los Estudiantes', 14, 15);
    
        yPos = 30;
        const detailsPerPage = 3; // Número de detalles de estudiantes por página
        let studentCount = 0;
    
        for (const student of filteredStudents) {
            // Verificar si necesitamos una nueva página
            if (studentCount > 0 && studentCount % detailsPerPage === 0) {
                doc.addPage();
                yPos = 30;
            }
    
            // Agregar un cuadro alrededor de los detalles del estudiante
            doc.setDrawColor(0, 102, 204);
            doc.setLineWidth(0.5);
            doc.roundedRect(10, yPos - 15, pageWidth - 20, 60, 3, 3);
    
            // Nombre del estudiante como encabezado
            doc.setFontSize(12);
            doc.setTextColor(0, 102, 204);
            doc.text(`${student.nombre_completo} (ID: ${student.id_alumno})`, 14, yPos);
    
            // Detalles del estudiante
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
    
            // Información básica en la columna izquierda
            doc.text(`Dirección: ${student.direccion || 'N/A'}`, 14, yPos + 10);
            doc.text(`Email: ${student.email || 'N/A'}`, 14, yPos + 20);
    
            doc.text(`Escuela: ${student.nombre_school || 'N/A'}`, 80, yPos + 20);

            // Información de contacto en la columna del medio
            doc.text(`Teléfono: ${student.telefono || 'N/A'}`, 80, yPos + 10);
    
            // Información de los encargados en la columna derecha
            const parentsText = student.padres?.length > 0
                ? student.padres.map(padre => `${padre.nombre} (${padre.parentesco})`).join(', ')
                : 'Sin encargados';
    
            doc.text('Encargados:', 150, yPos + 10);
    
            // Verificar si el texto de los encargados es demasiado largo y dividirlo si es necesario
            if (doc.getTextWidth(parentsText) > 50) {
                const parentLines = doc.splitTextToSize(parentsText, 50);
                for (let i = 0; i < parentLines.length; i++) {
                    doc.text(parentLines[i], 150, yPos + 20 + (i * 5));
                }
            } else {
                doc.text(parentsText, 150, yPos + 20);
            }
    
            yPos += 70; // Mover la posición para el siguiente estudiante
            studentCount++;
        }
    
        // Guardar el PDF
        doc.save('reporte_estudiantes.pdf');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center' }}>Reporte de Estudiantes</h2>
            
            {loading ? (
                <p>Cargando datos de estudiantes...</p>
            ) : (
                <>
                    <div style={{ 
                        background: '#f9f9f9', 
                        padding: '15px', 
                        borderRadius: '5px', 
                        marginBottom: '20px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
                    }}>
                        <h3 style={{ marginTop: 0 }}>Filtros</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Nombre:</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={filters.nombre}
                                    onChange={handleFilterChange}
                                    placeholder="Filtrar por nombre"
                                    style={{ 
                                        padding: '8px', 
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        minWidth: '150px'
                                    }}
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Dirección:</label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={filters.direccion}
                                    onChange={handleFilterChange}
                                    placeholder="Filtrar por dirección"
                                    style={{ 
                                        padding: '8px', 
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        minWidth: '150px'
                                    }}
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={filters.email}
                                    onChange={handleFilterChange}
                                    placeholder="Filtrar por email"
                                    style={{ 
                                        padding: '8px', 
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        minWidth: '150px'
                                    }}
                                />
                            </div>
                            
                            <div style={{ alignSelf: 'flex-end' }}>
                                <button
                                    onClick={resetFilters}
                                    style={{
                                        backgroundColor: '#f0f0f0',
                                        color: '#333',
                                        padding: '8px 15px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Limpiar Filtros
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div>
                            <p>Total de estudiantes: <strong>{students.length}</strong></p>
                            <p>Estudiantes filtrados: <strong>{getFilteredStudents().length}</strong></p>
                        </div>
                        
                        <button
                            onClick={generatePDF}
                            style={{
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                padding: '10px 15px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                            }}
                        >
                            <span style={{ fontSize: '16px' }}>📄</span> Generar PDF
                        </button>
                    </div>
                    
                    <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                        <h3>Vista Previa</h3>
                        <table style={{ 
                            width: '100%', 
                            borderCollapse: 'collapse',
                            border: '1px solid #ddd',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}>
                            <thead>
                                <tr style={{ backgroundColor: '#337ab7', color: 'white' }}>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Nombre Completo</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Escuela</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Dirección</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Encargados</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Foto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getFilteredStudents().slice(0, 10).map((student, index) => (
                                    <tr key={student.id_alumno} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{student.id_alumno}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{student.nombre_completo}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{student.nombre_school}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{student.direccion}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                            {student.padres?.map(padre => `${padre.nombre} (${padre.parentesco})`).join(', ') || 'Sin encargados'}
                                        </td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                        {student.foto ? (
                                        <img 
                                          crossOrigin="anonymous"
                                          src={createImageURL(student)}
                                          alt="Foto de la estudiante"
                                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                             />
                                          ) : 'No disponible'}
                                      </td>           
                                    </tr>
                                ))}
                                {getFilteredStudents().length > 10 && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '10px', textAlign: 'center', fontStyle: 'italic' }}>
                                            ... y {getFilteredStudents().length - 10} estudiantes más
                                        </td>
                                    </tr>
                                )}
                                {getFilteredStudents().length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>
                                            No hay estudiantes que cumplan con los filtros seleccionados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default StudentReportForm;