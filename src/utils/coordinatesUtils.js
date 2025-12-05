function parseDMS(dmsString) {
  if (!dmsString || typeof dmsString !== 'string') {
    throw new Error('Invalid DMS string provided');
  }

  const normalized = dmsString.trim().replace(/\s+/g, ' ');

  const dmsRegex = /^(\d+(?:\.\d+)?)°\s*(\d+(?:\.\d+)?)['′]\s*(\d+(?:\.\d+)?)((?:"|″|''))\s*([NSEW])$/i;
  const match = normalized.match(dmsRegex);

  if (!match) {
    throw new Error('Invalid DMS format. Examples: 12°54\'10.3"N or 12°54\'\'10.3"N');
  }

  const [, degrees, minutes, seconds, , direction] = match;

  let decimal = parseFloat(degrees) + parseFloat(minutes) / 60 + parseFloat(seconds) / 3600;

  if (direction.toUpperCase() === 'S' || direction.toUpperCase() === 'W') {
    decimal = -decimal;
  }

  return decimal;
}

function parseCoordinate(coordString) {
  if (typeof coordString === 'number') {
    return coordString;
  }
  
  if (typeof coordString !== 'string') {
    throw new Error('Coordinate must be a number or string');
  }
  
  // Check if it's DMS format (contains degree symbol)
  if (coordString.includes('°')) {
    return parseDMS(coordString);
  }
  
  // Try to parse as decimal
  const decimal = parseFloat(coordString);
  if (isNaN(decimal)) {
    throw new Error('Invalid coordinate format');
  }
  
  return decimal;
}

function parseCoordinatePair(lat, lng) {
  try {
    const latitude = parseCoordinate(lat);
    const longitude = parseCoordinate(lng);
    
    return { latitude, longitude };
  } catch (error) {
    throw new Error(`Coordinate parsing error: ${error.message}`);
  }
}

function parseGoogleMapsCoords(coordString) {
  if (!coordString || typeof coordString !== 'string') {
    throw new Error('Invalid Google Maps coordinate string');
  }
  
  const parts = coordString.split(',').map(part => part.trim());
  
  if (parts.length !== 2) {
    throw new Error('Google Maps format should contain exactly two coordinates separated by comma');
  }
  
  const latitude = parseFloat(parts[0]);
  const longitude = parseFloat(parts[1]);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Invalid numeric values in Google Maps coordinate string');
  }
  
  return { latitude, longitude };
}

function validateCoordinates(latitude, longitude) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new Error('Coordinates must be numbers');
  }
  
  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90 degrees');
  }
  
  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180 degrees');
  }
  
  return true;
}

module.exports = {
  parseDMS,
  parseCoordinate,
  parseCoordinatePair,
  parseGoogleMapsCoords,
  validateCoordinates,
  getCoordinatesFromPayload: function(payload) {
    const { latitude, longitude, coordinates } = payload || {};
    let lat, lng;
    if (typeof coordinates === 'string' && coordinates.length) {
      const parsed = parseGoogleMapsCoords(coordinates);
      lat = parsed.latitude;
      lng = parsed.longitude;
    } else if (latitude !== undefined && longitude !== undefined) {
      const parsed = parseCoordinatePair(latitude, longitude);
      lat = parsed.latitude;
      lng = parsed.longitude;
    } else {
      throw new Error('Provide "coordinates" or both "latitude" and "longitude"');
    }
    validateCoordinates(lat, lng);
    return { latitude: lat, longitude: lng };
  }
};
