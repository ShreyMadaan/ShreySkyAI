
const GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast";

// Convert city name into geographical coordinates.
export async function searchCities(city, signal) {
  const query = city.trim();

  if (query.length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    name: query,
    count: "5",
    language: "en",
    format: "json",
  });

  const response = await fetch(
    `${GEOCODING_URL}?${params}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Failed to search cities.");
  }

  const data = await response.json();

  return data.results ?? [];
}

// Fetch weather data for geographical coordinates.
export async function getWeatherData(latitude, longitude, signal) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),

    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "weather_code",
      "wind_speed_10m",
      "pressure_msl",
    ].join(","),

    hourly: [
      "temperature_2m",
      "weather_code",
      "is_day",
      "precipitation_probability",
      "visibility",
      "uv_index",
    ].join(","),

    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "sunrise",
      "sunset",
      "uv_index_max",
    ].join(","),

    timezone: "auto",
    forecast_days: "7",
  });

  const response = await fetch(
    `${WEATHER_URL}?${params}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data.");
  }

  return response.json();
}
