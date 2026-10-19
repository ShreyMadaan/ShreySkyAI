
function createInsight(icon, title, description) {
  return { icon, title, description };
}

export function generateWeatherInsights(weatherData) {
  if (!weatherData?.currentWeather || !weatherData?.metrics) {
    return null;
  }

  const { currentWeather, metrics, weeklyForecast = [] } =
    weatherData;

  const temperature = currentWeather.temperature;
  const feelsLike = currentWeather.feelsLike;
  const humidity = metrics.humidity;
  const windSpeed = metrics.windSpeed;
  const uvIndex = metrics.uvIndex;
  const rainProbability = metrics.precipitation ?? 0;

  const insights = [];

  // Clothing recommendations
  if (feelsLike >= 32) {
    insights.push(
      createInsight(
        "shirt",
        "What to wear",
        "Choose lightweight, breathable clothing."
      )
    );
  } else if (feelsLike <= 15) {
    insights.push(
      createInsight(
        "shirt",
        "What to wear",
        "Wear warm layers when heading outdoors."
      )
    );
  } else {
    insights.push(
      createInsight(
        "shirt",
        "What to wear",
        "Comfortable everyday clothing should work well."
      )
    );
  }

  // Outdoor recommendations
  if (rainProbability >= 60) {
    insights.push(
      createInsight(
        "umbrella",
        "Outdoor plans",
        "Rain is possible. Keep an umbrella handy."
      )
    );
  } else if (temperature >= 35) {
    insights.push(
      createInsight(
        "sun",
        "Outdoor plans",
        "Avoid strenuous activity during peak afternoon heat."
      )
    );
  } else if (windSpeed >= 35) {
    insights.push(
      createInsight(
        "wind",
        "Outdoor plans",
        "Expect strong winds during outdoor activities."
      )
    );
  } else {
    insights.push(
      createInsight(
        "trees",
        "Outdoor plans",
        "Conditions appear reasonable for outdoor activities."
      )
    );
  }

  // Hydration recommendations
  if (feelsLike >= 30 || humidity >= 75) {
    insights.push(
      createInsight(
        "droplets",
        "Hydration",
        "Drink water regularly, especially when outdoors."
      )
    );
  } else {
    insights.push(
      createInsight(
        "droplets",
        "Hydration",
        "Maintain your usual hydration routine."
      )
    );
  }

  // UV recommendations
  if (uvIndex >= 6) {
    insights.push(
      createInsight(
        "shield-alert",
        "UV protection",
        "High UV levels expected. Use sun protection."
      )
    );
  } else if (uvIndex >= 3) {
    insights.push(
      createInsight(
        "shield-check",
        "UV protection",
        "Moderate UV exposure. Consider sunscreen."
      )
    );
  } else {
    insights.push(
      createInsight(
        "shield-check",
        "UV protection",
        "Low maximum UV levels expected today."
      )
    );
  }

  // Summary headline
  let headline = "A pleasant day ahead";
  let summary =
    "Weather conditions look relatively comfortable today.";

  if (rainProbability >= 60) {
    headline = "Keep an umbrella nearby";
    summary =
      "Rain is possible around the current forecast hour. Plan outdoor activities accordingly.";
  } else if (temperature >= 35) {
    headline = "A hot day ahead";
    summary =
      "High temperatures may make outdoor activities uncomfortable. Stay hydrated and avoid prolonged exposure.";
  } else if (temperature <= 12) {
    headline = "A chilly day ahead";
    summary =
      "Cool temperatures are expected. Dress warmly before heading outdoors.";
  } else if (windSpeed >= 35) {
    headline = "A windy day ahead";
    summary =
      "Strong winds may affect outdoor comfort. Secure lightweight belongings.";
  }

  const todayForecast = weeklyForecast[0];

  return {
    headline,
    summary,
    insights,
    context: {
      city: currentWeather.city,
      temperature,
      feelsLike,
      humidity,
      uvIndex,
      rainProbability,
      todayHigh: todayForecast?.high ?? null,
      todayLow: todayForecast?.low ?? null,
    },
  };
}
