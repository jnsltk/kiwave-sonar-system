/**
 * Converts degrees to radians
 * @param deg Angle in degrees
 * @return {Number} Angle in radians
 */
export const toRadians = (deg) => {
    return deg * (Math.PI / 180);
}

/**
 * Maps distance from sensor to radar screen
 * @param dist The distance from the sensor
 * @param range The current maximum distance the radar is set to
 * @param screenRadius The radius of the RadarScreen in pixels
 * @return {number} - The distance mapped to the radar screen
 */
export const mapDistance = (dist, range, screenRadius) => {
    return dist / range * screenRadius;
}

/**
 * Returns the x and y coordinates of the point defined by the angle and distance from the sensor
 * @typedef {Object} Point
 * @param deg The direction of the distance meaurement
 * @param dist The distance from the sensor
 * @param range The current measuring range set by the user
 * @param screenRadius The radius of the RadarScreen in pixels
 * @return {Point} The object containing the x and y coordinates
 */
export const getCoordinates = (deg, dist, range, screenRadius) => {
    let mappedDist = mapDistance(dist, range, screenRadius);
    // Subtract 90 from the angle so it starts at 12 o' clock positon
    return {
        x: Math.cos(toRadians(deg - 90)) * mappedDist,
        y: Math.sin(toRadians(deg - 90)) * mappedDist
    };
}