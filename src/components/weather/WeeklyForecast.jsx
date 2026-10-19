
import { CalendarDays, Droplets } from "lucide-react";
import { getWeatherIcon } from "../../utils/weatherIcons";

function WeeklyForecast({ forecast }) {
  const weeklyMin = Math.min(...forecast.map((day) => day.low));
  const weeklyMax = Math.max(...forecast.map((day) => day.high));
  const totalRange = Math.max(weeklyMax - weeklyMin, 1);

  return (
    <section className="glass-card p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <CalendarDays size={20} className="text-sky-300" />
          7-Day Forecast
        </h2>

        <span className="text-xs text-slate-400">
          Weekly outlook
        </span>
      </div>

      <div className="space-y-5">
        {forecast.map((day, index) => {
          const WeatherIcon = getWeatherIcon(day.weatherCode);

          const left = ((day.low - weeklyMin) / totalRange) * 100;
          const width = ((day.high - day.low) / totalRange) * 100;

          return (
            <div
              key={`${day.day}-${index}`}
              className="grid grid-cols-[48px_24px_48px_32px_minmax(0,1fr)_32px] items-center gap-2 sm:gap-3"
            >
              <span
                className={`text-sm ${
                  index === 0 ? "font-semibold" : "text-slate-300"
                }`}
              >
                {day.day}
              </span>

              <WeatherIcon
                size={22}
                className="text-sky-200"
                strokeWidth={1.7}
              />

              <div className="flex items-center gap-1 text-xs text-sky-300">
                <Droplets size={12} />
                <span>{day.precipitation}%</span>
              </div>

              <span className="text-right text-sm text-slate-400">
                {day.low}°
              </span>

              <div className="relative h-2 rounded-full bg-white/10">
                <div
                  className="absolute top-0 h-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-300"
                  style={{
                    left: `${left}%`,
                    width: `${Math.max(width, 2)}%`,
                  }}
                />
              </div>

              <span className="text-right text-sm font-medium">
                {day.high}°
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default WeeklyForecast;
