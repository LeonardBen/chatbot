import { getCoordinates } from './geocodeAPI';

export async function getWeather(city) {
    try {
        const { latitude, longitude } = await getCoordinates(city);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return `Weather in ${city}: ${data.current_weather.weathercode}, ${data.current_weather.temperature}°C`;
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        return `Failed to fetch weather data for ${city}. Please ensure the city name is correct.`;
    }
}

export async function getUVIndex(city) {
    try {
        const { latitude, longitude } = await getCoordinates(city);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=uv_index_max&timezone=auto`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return `UV Index in ${city}: ${data.daily.uv_index_max[0]}`;
    } catch (error) {
        console.error('Failed to fetch UV index data:', error);
        return `Failed to fetch UV index data for ${city}. Please ensure the city name is correct.`;
    }
}

export async function getWeatherForecast(city) {
    try {
        const { latitude, longitude } = await getCoordinates(city);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        let forecast = `7-day weather forecast for ${city}:\n`;
        for (let i = 0; i < 7; i++) {
            forecast += `Day ${i + 1}: Max Temp: ${data.daily.temperature_2m_max[i]}°C, Min Temp: ${data.daily.temperature_2m_min[i]}°C, Precipitation: ${data.daily.precipitation_sum[i]}mm\n`;
        }
        return forecast;
    } catch (error) {
        console.error('Failed to fetch weather forecast data:', error);
        return `Failed to fetch weather forecast data for ${city}. Please ensure the city name is correct.`;
    }
}
