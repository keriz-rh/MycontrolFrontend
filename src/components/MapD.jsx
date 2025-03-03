import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { createImageURL } from '../services/StudentServices'; 

const MapD = ({ lat, lng, onMapClick, alumnos, escuelas }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    const [selectedAlumno, setSelectedAlumno] = useState(null);
    const [selectedEscuela, setSelectedEscuela] = useState(null);

    const mapContainerStyle = {
        width: '100%',
        height: '100%',
    };

    const isValidCoordinate = (coord) => coord !== undefined && coord !== null && !isNaN(parseFloat(coord));

    const center = {
        lat: isValidCoordinate(lat) ? parseFloat(lat) : 0,
        lng: isValidCoordinate(lng) ? parseFloat(lng) : 0,
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={center}
            onClick={(event) => {
                setSelectedAlumno(null);
                setSelectedEscuela(null);
                if (onMapClick) {
                    onMapClick({ lat: event.latLng.lat(), lng: event.latLng.lng() });
                }
            }}
            onLoad={(map) => {
                const bounds = new window.google.maps.LatLngBounds();
                alumnos.forEach((alumno) => {
                    if (isValidCoordinate(alumno.latitud) && isValidCoordinate(alumno.longitud)) {
                        bounds.extend({ lat: parseFloat(alumno.latitud), lng: parseFloat(alumno.longitud) });
                    }
                });
                escuelas.forEach((escuela) => {
                    if (isValidCoordinate(escuela.latitud) && isValidCoordinate(escuela.longitud)) {
                        bounds.extend({ lat: parseFloat(escuela.latitud), lng: parseFloat(escuela.longitud) });
                    }
                });
                if (!bounds.isEmpty()) {
                    map.fitBounds(bounds);
                }
            }}
        >
            {alumnos.map((alumno, index) => (
                isValidCoordinate(alumno.latitud) && isValidCoordinate(alumno.longitud) && (
                    <Marker
                        key={`alumno-${index}`}
                        position={{ lat: parseFloat(alumno.latitud), lng: parseFloat(alumno.longitud) }}
                        icon={{
                            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        }}
                        onClick={() => {
                            setSelectedAlumno(alumno);
                            setSelectedEscuela(null);
                        }}
                    />
                )
            ))}

            {escuelas.map((escuela, index) => (
                isValidCoordinate(escuela.latitud) && isValidCoordinate(escuela.longitud) && (
                    <Marker
                        key={`escuela-${index}`}
                        position={{ lat: parseFloat(escuela.latitud), lng: parseFloat(escuela.longitud) }}
                        icon={{
                            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        }}
                        onClick={() => {
                            setSelectedEscuela(escuela);
                            setSelectedAlumno(null);
                        }}
                    />
                )
            ))}

            {selectedAlumno && (
                <InfoWindow
                    position={{ lat: parseFloat(selectedAlumno.latitud), lng: parseFloat(selectedAlumno.longitud) }}
                    onCloseClick={() => setSelectedAlumno(null)}
                >
                    <div style={styles.infoWindow}>
                        {selectedAlumno.foto && (
                            <img
                                crossorigin="anonymous"
                                src={createImageURL(selectedAlumno)}
                                alt="Foto del estudiante"
                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                            />
                        )}
                        <h3>{selectedAlumno.nombre_completo}</h3>
                        <p>Estudiante</p>
                        <p><strong>Escuela:</strong> {selectedAlumno.nombre_school}</p>
                    </div>
                </InfoWindow>
            )}

            {selectedEscuela && (
                <InfoWindow
                    position={{ lat: parseFloat(selectedEscuela.latitud), lng: parseFloat(selectedEscuela.longitud) }}
                    onCloseClick={() => setSelectedEscuela(null)}
                >
                    <div style={styles.infoWindow}>
                        {selectedEscuela.foto && (
                            <img
                                crossorigin="anonymous"
                                src={createImageURL(selectedEscuela)}
                                alt="Foto de la escuela"
                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                            />
                        )}
                        <h3>{selectedEscuela.nombre}</h3>
                        <p>Escuela</p>
                        <p><strong>Dirección:</strong> {selectedEscuela.direccion}</p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

const styles = {
    infoWindow: {
        padding: '10px',
        textAlign: 'center',
    },
};

export default MapD;
