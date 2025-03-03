/**
 * Convierte coordenadas decimales a formato DMS (Grados, Minutos, Segundos).
 * @param {number} decimal - Coordenada en formato decimal.
 * @param {boolean} isLatitude - Indica si es latitud (true) o longitud (false).
 * @returns {string} Coordenada en formato DMS.
 */
export const decimalToDMS = (decimal, isLatitude) => {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

    // Determina la dirección (N, S, E, W)
    let direction;
    if (isLatitude) {
        direction = decimal >= 0 ? 'N' : 'S';
    } else {
        direction = decimal >= 0 ? 'E' : 'W';
    }

    return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
};