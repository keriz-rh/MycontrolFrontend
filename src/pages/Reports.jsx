import React from 'react';
import { useNavigate } from 'react-router-dom';

function Reports() {
    const navigate = useNavigate();

    const handleStudentReportClick = () => {
        navigate('/reportStudent'); // Redirige a la ruta del reporte de alumnos
    };

    const handleSchoolReportClick = () => {
        navigate('/reportSchool'); // Redirige a la ruta del reporte de escuelas
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ cursor: 'pointer', color: '#337ab7', marginBottom: '20px' }} onClick={handleStudentReportClick}>
                Reporte Alumnos
            </h1>
            <h1 style={{ cursor: 'pointer', color: '#337ab7' }} onClick={handleSchoolReportClick}>
                Reporte Escuelas
            </h1>
        </div>
    );
}

export default Reports;