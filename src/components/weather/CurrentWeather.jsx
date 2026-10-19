
import {
  MapPin,
  Heart,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { getWeatherIcon } from "../../utils/weatherIcons";

function CurrentWeather({
  weather,
  isFavorite = false,
  onToggleFavorite,
}) {
  const {
    city,
    country,
    temperature,
    feelsLike,
    condition,
    high,
    low,
    description,
    weatherCode,
    isDay,
    localTime,
  } = weather;

  const WeatherIcon = getWeatherIcon(weatherCode, isDay);

  // Open-Meteo supplies local timestamps for the selected city.
  const localDate = localTime?.split("T")[0];

  const formattedDate = localDate
    ? new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${localDate}T12:00:00Z`))
    : "";

  const locationLabel = [city, country]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="glass-card relative flex min-h-80 flex-col justify-between overflow-hidden p-6 sm:p-8">
      {/* Atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl"
      />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <MapPin size={17} />

            <h2 className="text-lg font-semibold">
              {locationLabel}
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-400">
            {formattedDate}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleFavorite}
          disabled={!onToggleFavorite}
          aria-label={
            isFavorite
              ? "Remove favorite city"
              : "Add favorite city"
          }
          aria-pressed={isFavorite}
          className="rounded-full border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 disabled:cursor-default"
        >
          <Heart
            size={19}
            fill={isFavorite ? "currentColor" : "none"}
            className={
              isFavorite ? "text-rose-400" : "text-white"
            }
          />
        </button>
      </div>

      {/* Main weather information */}
      <div className="relative my-8 flex items-center justify-between gap-3">
        <div>
          <p className="text-7xl font-light tracking-tighter sm:text-8xl">
            {Math.round(temperature)}°
          </p>

          <h3 className="mt-3 text-xl font-medium">
            {condition}
          </h3>

          <p className="mt-2 text-sm text-slate-300">
            Feels like {Math.round(feelsLike)}°
          </p>
        </div>

        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-amber-300/5 sm:h-40 sm:w-40">
          <WeatherIcon
            aria-label={condition}
            role="img"
            className={`h-20 w-20 drop-shadow-[0_0_30px_rgba(251,191,36,0.3)] sm:h-28 sm:w-28 ${
              isDay
                ? "text-amber-200"
                : "text-sky-200"
            }`}
            strokeWidth={1.2}
          />
        </div>
      </div>

      {/* Daily summary */}
      <div className="relative flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-5">
        <div className="flex items-center gap-2">
          <ArrowUp size={17} className="text-amber-300" />
          <span className="font-medium">
            {Math.round(high)}°
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ArrowDown size={17} className="text-sky-300" />
          <span className="font-medium">
            {Math.round(low)}°
          </span>
        </div>

        <p className="text-sm text-slate-300">
          {description}
        </p>
      </div>
    </section>
  );
}

export default CurrentWeather;
