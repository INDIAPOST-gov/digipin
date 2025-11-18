/**
 * Unit Tests for DIGIPIN Core Functions
 * Tests encoding and decoding functionality
 */

const { getDigiPin, getLatLngFromDigiPin } = require('../src/digipin');

describe('DIGIPIN Core Functions', () => {
  describe('getDigiPin - Encoding', () => {
    test('should encode valid coordinates (Bangalore)', () => {
      const digipin = getDigiPin(12.9716, 77.5946);
      expect(digipin).toBe('4P3-JK8-52C9');
    });

    test('should encode valid coordinates (Dak Bhawan, Delhi)', () => {
      const digipin = getDigiPin(28.622788, 77.213033);
      expect(digipin).toBe('39J-49L-L8T4');
    });

    test('should encode coordinates at boundary (min lat, min lon)', () => {
      const digipin = getDigiPin(2.5, 63.5);
      expect(digipin).toBeDefined();
      expect(digipin).toMatch(/^[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{4}$/);
    });

    test('should encode coordinates at boundary (max lat, max lon)', () => {
      const digipin = getDigiPin(38.5, 99.5);
      expect(digipin).toBeDefined();
      expect(digipin).toMatch(/^[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{4}$/);
    });

    test('should encode coordinates in middle of range', () => {
      const digipin = getDigiPin(20.5, 81.5);
      expect(digipin).toBeDefined();
      expect(digipin).toMatch(/^[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{4}$/);
    });

    test('should throw error for latitude below minimum (2.5)', () => {
      expect(() => getDigiPin(2.0, 77.5946)).toThrow('Latitude out of range');
    });

    test('should throw error for latitude above maximum (38.5)', () => {
      expect(() => getDigiPin(39.0, 77.5946)).toThrow('Latitude out of range');
    });

    test('should throw error for longitude below minimum (63.5)', () => {
      expect(() => getDigiPin(12.9716, 60.0)).toThrow('Longitude out of range');
    });

    test('should throw error for longitude above maximum (99.5)', () => {
      expect(() => getDigiPin(12.9716, 100.0)).toThrow('Longitude out of range');
    });

    test('should handle decimal precision correctly', () => {
      const digipin1 = getDigiPin(12.971600, 77.594600);
      const digipin2 = getDigiPin(12.9716, 77.5946);
      expect(digipin1).toBe(digipin2);
    });

    test('should return string in correct format XXX-XXX-XXXX', () => {
      const digipin = getDigiPin(15.5, 75.5);
      expect(digipin).toMatch(/^[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{4}$/);
      expect(digipin.charAt(3)).toBe('-');
      expect(digipin.charAt(7)).toBe('-');
      expect(digipin.length).toBe(12);
    });
  });

  describe('getLatLngFromDigiPin - Decoding', () => {
    test('should decode valid DIGIPIN (Bangalore)', () => {
      const coords = getLatLngFromDigiPin('4P3-JK8-52C9');
      expect(coords).toHaveProperty('latitude');
      expect(coords).toHaveProperty('longitude');
      expect(parseFloat(coords.latitude)).toBeCloseTo(12.9716, 4);
      expect(parseFloat(coords.longitude)).toBeCloseTo(77.5946, 4);
    });

    test('should decode valid DIGIPIN (Dak Bhawan, Delhi)', () => {
      const coords = getLatLngFromDigiPin('39J-49L-L8T4');
      expect(coords).toHaveProperty('latitude');
      expect(coords).toHaveProperty('longitude');
      expect(parseFloat(coords.latitude)).toBeCloseTo(28.622788, 4);
      expect(parseFloat(coords.longitude)).toBeCloseTo(77.213033, 4);
    });

    test('should decode DIGIPIN without hyphens', () => {
      const coords = getLatLngFromDigiPin('4P3JK852C9');
      expect(coords).toHaveProperty('latitude');
      expect(coords).toHaveProperty('longitude');
      expect(parseFloat(coords.latitude)).toBeCloseTo(12.9716, 4);
      expect(parseFloat(coords.longitude)).toBeCloseTo(77.5946, 4);
    });

    test('should throw error for invalid DIGIPIN length', () => {
      expect(() => getLatLngFromDigiPin('4P3-JK8')).toThrow('Invalid DIGIPIN');
    });

    test('should throw error for invalid characters in DIGIPIN', () => {
      expect(() => getLatLngFromDigiPin('4P3-JK8-52XY')).toThrow('Invalid character in DIGIPIN');
    });

    test('should throw error for empty DIGIPIN', () => {
      expect(() => getLatLngFromDigiPin('')).toThrow('Invalid DIGIPIN');
    });

    test('should return coordinates as strings with 6 decimal precision', () => {
      const coords = getLatLngFromDigiPin('4P3-JK8-52C9');
      expect(typeof coords.latitude).toBe('string');
      expect(typeof coords.longitude).toBe('string');
      expect(coords.latitude.split('.')[1].length).toBe(6);
      expect(coords.longitude.split('.')[1].length).toBe(6);
    });
  });

  describe('Round-trip Encoding/Decoding', () => {
    test('should encode and decode back to similar coordinates (Bangalore)', () => {
      const originalLat = 12.9716;
      const originalLon = 77.5946;

      const digipin = getDigiPin(originalLat, originalLon);
      const decoded = getLatLngFromDigiPin(digipin);

      expect(parseFloat(decoded.latitude)).toBeCloseTo(originalLat, 4);
      expect(parseFloat(decoded.longitude)).toBeCloseTo(originalLon, 4);
    });

    test('should encode and decode back to similar coordinates (Delhi)', () => {
      const originalLat = 28.622788;
      const originalLon = 77.213033;

      const digipin = getDigiPin(originalLat, originalLon);
      const decoded = getLatLngFromDigiPin(digipin);

      expect(parseFloat(decoded.latitude)).toBeCloseTo(originalLat, 4);
      expect(parseFloat(decoded.longitude)).toBeCloseTo(originalLon, 4);
    });

    test('should handle multiple encode-decode cycles', () => {
      const testCoordinates = [
        { lat: 12.9716, lon: 77.5946 },
        { lat: 28.7041, lon: 77.1025 },
        { lat: 19.0760, lon: 72.8777 },
        { lat: 13.0827, lon: 80.2707 },
      ];

      testCoordinates.forEach(({ lat, lon }) => {
        const digipin = getDigiPin(lat, lon);
        const decoded = getLatLngFromDigiPin(digipin);

        expect(parseFloat(decoded.latitude)).toBeCloseTo(lat, 4);
        expect(parseFloat(decoded.longitude)).toBeCloseTo(lon, 4);
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle coordinates at grid boundaries', () => {
      const testCases = [
        { lat: 2.5, lon: 63.5 },
        { lat: 38.5, lon: 99.5 },
        { lat: 2.5, lon: 99.5 },
        { lat: 38.5, lon: 63.5 },
      ];

      testCases.forEach(({ lat, lon }) => {
        const digipin = getDigiPin(lat, lon);
        expect(digipin).toBeDefined();

        const decoded = getLatLngFromDigiPin(digipin);
        expect(decoded).toHaveProperty('latitude');
        expect(decoded).toHaveProperty('longitude');
      });
    });

    test('should handle coordinates very close to boundaries', () => {
      const digipin1 = getDigiPin(2.50001, 63.50001);
      const digipin2 = getDigiPin(38.49999, 99.49999);

      expect(digipin1).toBeDefined();
      expect(digipin2).toBeDefined();
    });
  });
});
