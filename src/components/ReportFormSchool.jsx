import React, { useEffect, useState } from 'react';
import { schoolService, createImageURL } from '../services/SchoolServices';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function SchoolReportForm() {
    const [schools, setSchools] = useState([]);
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
        fetchSchools();
    }, []);

    useEffect(() => {
        if (schools.length > 0) {
            // Extraer valores únicos para los filtros
            const nombres = [...new Set(schools.map(s => s.nombre))].sort();
            const direcciones = [...new Set(schools.map(s => s.direccion))].sort();
            const emails = [...new Set(schools.map(s => s.email))].sort();
            
            setUniqueValues({
                nombres,
                direcciones,
                emails
            });
        }
    }, [schools]);

    const fetchSchools = async () => {
        setLoading(true);
        try {
            const res = await schoolService.getSchools();
            console.log('Schools fetched:', res); // Depuración
            
            // Usar res.data como en SchoolList
            if (res && res.data) {
                setSchools(res.data);
            } else {
                // Mantener compatibilidad con el código original en caso de que res sea directamente el array
                setSchools(Array.isArray(res) ? res : []);
            }
        } catch (error) {
            console.error('Error fetching schools:', error);
            setSchools([]); // Establece un array vacío en caso de error
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

    const getFilteredSchools = () => {
        return schools.filter(school => {
            return (
                (filters.nombre === '' || school.nombre === filters.nombre) &&
                (filters.direccion === '' || school.direccion === filters.direccion) &&
                (filters.email === '' || school.email === filters.email)
            );
        });
    };

    const generatePDF = async () => {
        const filteredSchools = getFilteredSchools();
        if (filteredSchools.length === 0) {
            alert('No hay escuelas que cumplan con los filtros seleccionados');
            return;
        }

        // Crear documento PDF
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        
        // Agregar encabezado
        doc.setFontSize(18);
        doc.setTextColor(0, 102, 204);
        const title = 'Reporte de Escuelas';
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
        else filterText = filterText.slice(0, -2); // Eliminar la última coma
        doc.text(filterText, 14, 22);
        
        // Agregar fecha del reporte
        const today = new Date();
        const dateStr = today.toLocaleDateString('es-ES');
        doc.text(`Fecha de generación: ${dateStr}`, pageWidth - 60, 22);
        
        // Tabla con datos de las escuelas
        const tableColumn = ['ID', 'Nombre', 'Dirección', 'Email', 'Foto'];
        const tableRows = [];

        filteredSchools.forEach((school) => {
            const schoolData = [
                school.id_school,
                school.nombre,
                school.direccion,
                school.email,
                school.foto ? 'Sí' : 'No'
            ];
            tableRows.push(schoolData);
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

        // Add detailed school information with photos
        let yPos = doc.lastAutoTable.finalY + 20;
        doc.addPage();
        
        doc.setFontSize(14);
        doc.setTextColor(0, 102, 204);
        doc.text('Detalles de las Escuelas', 14, 15);
        
        yPos = 30;
        const detailsPerPage = 3; // Number of school details per page
        let schoolCount = 0;
        
        for (const school of filteredSchools) {
            // Check if we need a new page
            if (schoolCount > 0 && schoolCount % detailsPerPage === 0) {
                doc.addPage();
                yPos = 30;
            }
            
            // Add a box around school details
            doc.setDrawColor(0, 102, 204);
            doc.setLineWidth(0.5);
            doc.roundedRect(10, yPos - 15, pageWidth - 20, 60, 3, 3);
            
            // School name as header
            doc.setFontSize(12);
            doc.setTextColor(0, 102, 204);
            doc.text(`${school.nombre} (ID: ${school.id_school})`, 14, yPos);
            
            // School details
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            
            // Basic info in left column
            doc.text(`Dirección: ${school.direccion || 'N/A'}`, 14, yPos + 10);
            doc.text(`Email: ${school.email || 'N/A'}`, 14, yPos + 20);
            
            // If there are additional details you might want to add them here
            // For example, if schools have phone numbers, contact persons, etc.
            
            // Add school photo if available
            if (school.foto) {
                try {
                    // This would need to be done differently as jsPDF doesn't directly support 
                    // adding images from URLs in most scenarios - we're showing a placeholder
                    const imageX = pageWidth - 70; // Position from right side
                    const imageY = yPos - 10;
                    
                    // Add placeholder for photo (in a real app, you'd load the image properly)
                    doc.setDrawColor(200, 200, 200);
                    doc.setFillColor(240, 240, 240);
                    doc.roundedRect(imageX, imageY, 50, 50, 3, 3, 'FD');
                    
                    doc.setFontSize(8);
                    doc.setTextColor(100, 100, 100);
                    doc.text('Foto de la escuela', imageX + 25, imageY + 25, { align: 'center' });
                    
                    // Note: To properly add images, you would need to:
                    // 1. Convert the image to base64 or get it as a binary blob
                    // 2. Use doc.addImage() with the correct format
                    // Example:
                    // const img = new Image();
                    // img.src = createImageURL(school);
                    // img.onload = () => {
                    //   const canvas = document.createElement('canvas');
                    //   canvas.width = img.width;
                    //   canvas.height = img.height;
                    //   const ctx = canvas.getContext('2d');
                    //   ctx.drawImage(img, 0, 0);
                    //   const imgData = canvas.toDataURL('image/jpeg');
                    //   doc.addImage(imgData, 'JPEG', imageX, imageY, 50, 50);
                    // }
                } catch (err) {
                    console.error('Error adding image to PDF:', err);
                }
            }
            
            yPos += 70; // Move position for next school
            schoolCount++;
        }
        
        // Save the PDF
        doc.save('reporte_escuelas.pdf');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center' }}>Reporte de Escuelas</h2>
            
            {loading ? (
                <p>Cargando datos de escuelas...</p>
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
                                <select 
                                    name="nombre" 
                                    value={filters.nombre} 
                                    onChange={handleFilterChange}
                                    style={{ 
                                        padding: '8px', 
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        minWidth: '150px'
                                    }}
                                >
                                    <option value="">Todos</option>
                                    {uniqueValues.nombres.map(nombre => (
                                        <option key={nombre} value={nombre}>{nombre}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Dirección:</label>
                                <select 
                                    name="direccion" 
                                    value={filters.direccion} 
                                    onChange={handleFilterChange}
                                    style={{ 
                                        padding: '8px', 
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        minWidth: '150px'
                                    }}
                                >
                                    <option value="">Todas</option>
                                    {uniqueValues.direcciones.map(direccion => (
                                        <option key={direccion} value={direccion}>{direccion}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                                <select 
                                    name="email" 
                                    value={filters.email} 
                                    onChange={handleFilterChange}
                                    style={{ 
                                        padding: '8px', 
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        minWidth: '150px'
                                    }}
                                >
                                    <option value="">Todos</option>
                                    {uniqueValues.emails.map(email => (
                                        <option key={email} value={email}>{email}</option>
                                    ))}
                                </select>
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
                            <p>Total de escuelas: <strong>{schools.length}</strong></p>
                            <p>Escuelas filtradas: <strong>{getFilteredSchools().length}</strong></p>
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
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Nombre</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Dirección</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Foto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getFilteredSchools().slice(0, 10).map((school, index) => (
                                    <tr key={school.id_school} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{school.id_school}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{school.nombre}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{school.direccion}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{school.email}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                            {school.foto ? (
                                                <img 
                                                    crossOrigin="anonymous"
                                                    src={createImageURL(school)}
                                                    alt="Foto de la escuela"
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                />
                                            ) : 'No disponible'}
                                        </td>
                                    </tr>
                                ))}
                                {getFilteredSchools().length > 10 && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '10px', textAlign: 'center', fontStyle: 'italic' }}>
                                            ... y {getFilteredSchools().length - 10} escuelas más
                                        </td>
                                    </tr>
                                )}
                                {getFilteredSchools().length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>
                                            No hay escuelas que cumplan con los filtros seleccionados
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

export default SchoolReportForm;