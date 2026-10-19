
import { useEffect, useState } from "react";

import { getWeatherData } from "../services/weatherService";
import { normalizeWeatherData } from "../utils/weatherAdapter";

const DEFAULT_CITY = {
  name: "Delhi",
  country: "India",
  latitude: 28.6139,
  longitude: 77.209,
};

export function useWeather(city = DEFAULT_CITY) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);
        setWeather(null);

        const response = await getWeatherData(
          city.latitude,
          city.longitude,
          controller.signal
        );

        if (controller.signal.aborted) return;

        const normalized = normalizeWeatherData(response, city);

        setWeather(normalized);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(err.message || "Unable to load weather data.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchWeather();

    return () => controller.abort();
  }, [
    city.latitude,
    city.longitude,
    city.name,
    city.country,
  ]);

  return {
    weather,
    loading,
    error,
  };
}
