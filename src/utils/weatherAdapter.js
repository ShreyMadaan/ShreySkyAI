
const weatherDescriptions = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing Rime Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  61: "Light Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  71: "Light Snow",
  73: "Moderate Snow",
  75: "Heavy Snow",
  80: "Rain Showers",
  81: "Moderate Showers",
  82: "Violent Showers",
  95: "Thunderstorm",
  96: "Thunderstorm with Hail",
  99: "Severe Thunderstorm",
};

export function getWeatherDescription(code) {
  return weatherDescriptions[code] ?? "Unknown Conditions";
}

function formatTime(isoString) {
  if (!isoString) return "N/A";

  const time = isoString.split("T")[1];

  if (!time) return "N/A";

  const [hours, minutes] = time.split(":").map(Number);

  const hour12 = hours % 12 || 12;
  const period = hours >= 12 ? "PM" : "AM";

  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function getDayLabel(dateString, index) {
  if (index === 0) return "Today";

  const [year, month, day] = dateString.split("-").map(Number);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function normalizeWeatherData(apiData, city) {
  const { current, hourly, daily } = apiData;

  if (!current || !hourly || !daily) {
    throw new Error("Incomplete weather data received.");
  }

  // Open-Meteo returns local timestamps when timezone=auto.
  // ISO-like strings can be compared chronologically.
  const currentHour = `${current.time.slice(0, 13)}:00`;

  const currentHourIndex = hourly.time.findIndex(
    (time) => time >= currentHour
  );

  if (currentHourIndex === -1) {
    throw new Error("Current hourly forecast is unavailable.");
  }

  const hourlyForecast = hourly.time
    .slice(currentHourIndex, currentHourIndex + 12)
    .map((time, index) => {
      const dataIndex = currentHourIndex + index;

      return {
        time: index === 0 ? "Now" : formatTime(time),
        temperature: hourly.temperature_2m[dataIndex],
        weatherCode: hourly.weather_code[dataIndex],
        isDay: Boolean(hourly.is_day[dataIndex]),
        precipitation:
          hourly.precipitation_probability[dataIndex],
      };
    });

  const weeklyForecast = daily.time.map((date, index) => ({
    day: getDayLabel(date, index),
    date,
    low: daily.temperature_2m_min[index],
    high: daily.temperature_2m_max[index],
    weatherCode: daily.weather_code[index],
    precipitation:
      daily.precipitation_probability_max[index] ?? 0,
  }));

  const currentWeather = {
    city: city.name,
    country: city.country,
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    condition: getWeatherDescription(current.weather_code),
    weatherCode: current.weather_code,
    isDay: Boolean(current.is_day),
    high: daily.temperature_2m_max[0],
    low: daily.temperature_2m_min[0],
    description: getWeatherDescription(current.weather_code),
    localTime: current.time,
  };

  const metrics = {
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    visibility:
      hourly.visibility[currentHourIndex] == null
        ? null
        : hourly.visibility[currentHourIndex] / 1000,
    pressure: current.pressure_msl,
    uvIndex: daily.uv_index_max?.[0] ?? null,
    sunrise: formatTime(daily.sunrise[0]),
    sunset: formatTime(daily.sunset[0]),
    precipitation:
      hourly.precipitation_probability[currentHourIndex],
  };

  return {
    currentWeather,
    hourlyForecast,
    weeklyForecast,
    metrics,
    timezone: apiData.timezone,
  };
}
