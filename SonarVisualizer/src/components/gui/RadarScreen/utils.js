/**
 * Converts degrees to radians
 * @param deg Angle in degrees
 * @return {Number} Angle in radians
 */
export const toRadians = (deg) => {
    return deg * (Math.PI / 180);
}

export const toDegrees = (rad) => {
    return rad * (180 / Math.PI);
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

export const reMapDist = (mappedDist, range, screenRadius) => {
    return mappedDist * range / screenRadius;
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

export const getDegDist = (x, y, range, screenRadius) => {
    // Calculate the mappedDist using the Pythagorean theorem
    let mappedDist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)); 
    // Calculate angle
    let deg = toDegrees(Math.atan2(- y, x));
    // Make sure value is between 0 and 359
    deg = deg < 0 ? 360 - ((-deg) % 360) : deg % 360;
    // Shift angle by 90 degrees to align with 12 o'clock position
    deg = (deg + 90) % 360;

    return {
        dist: reMapDist(mappedDist, range, screenRadius),
        deg: deg
    };
}