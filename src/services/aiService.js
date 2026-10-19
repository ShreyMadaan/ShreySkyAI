
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function getAIWeatherBrief(weather, signal) {
  const response = await fetch(
    `${API_BASE_URL}/ai/weather-brief`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ weather }),
      signal,
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to generate AI weather brief."
    );
  }

  return result.data;
}
