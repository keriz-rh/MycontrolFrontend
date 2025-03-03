import React from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const Map = ({ lat, lng, onMapClick }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    if (!isLoaded) return <div>Cargando mapa...</div>;

    return (
        <GoogleMap
            zoom={15}
            center={{ lat: parseFloat(lat) || 0, lng: parseFloat(lng) || 0 }}
            mapContainerClassName="map-container"
            onClick={onMapClick}
        >
            {lat && lng && <Marker position={{ lat: parseFloat(lat), lng: parseFloat(lng) }} />}
        </GoogleMap>
        
    );
};

export default Map;