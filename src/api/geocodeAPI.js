export async function getCoordinates(city) {
    try {
        const encodedCity = encodeURIComponent(city);
        console.log(`Fetching coordinates for city: ${city} (encoded: ${encodedCity})`);
        const url = `https://nominatim.openstreetmap.org/search?q=${encodedCity}&format=json&limit=1`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Received data for city ${city}:`, data);
        if (data.length === 0) {
            throw new Error('No coordinates found for the specified city');
        }
        return {
            latitude: data[0].lat,
            longitude: data[0].lon
        };
    } catch (error) {
        console.error('Failed to fetch coordinates:', error);
        throw error;
    }
}
