
import {
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sun,
  Sunrise,
  Sunset,
  CloudRain,
  ChartNoAxesCombined,
} from "lucide-react";

function WeatherMetrics({ metrics }) {
  const metricItems = [
    {
      label: "Humidity",
      value: `${metrics.humidity}%`,
      icon: Droplets,
      color: "text-sky-300",
    },
    {
      label: "Wind Speed",
      value: `${metrics.windSpeed} km/h`,
      icon: Wind,
      color: "text-cyan-200",
    },
    {
      label: "Visibility",
      value: `${metrics.visibility} km`,
      icon: Eye,
      color: "text-violet-300",
    },
    {
      label: "Pressure",
      value: `${metrics.pressure} hPa`,
      icon: Gauge,
      color: "text-amber-300",
    },
    {
      label: "Max UV Today",
      value:
        metrics.uvIndex == null
          ? "N/A"
          : Number(metrics.uvIndex).toFixed(1),
      icon: Sun,
      color: "text-orange-300",
    },
    {
      label: "Sunrise",
      value: metrics.sunrise,
      icon: Sunrise,
      color: "text-yellow-200",
    },
    {
      label: "Sunset",
      value: metrics.sunset,
      icon: Sunset,
      color: "text-rose-300",
    },
    {
      label: "Precipitation",
      value: `${metrics.precipitation}%`,
      icon: CloudRain,
      color: "text-blue-300",
    },
  ];

  return (
    <section className="glass-card flex h-full flex-col p-6">
      <h2 className="mb-6 flex shrink-0 items-center gap-2 text-lg font-semibold">
        <ChartNoAxesCombined
          size={20}
          className="text-sky-300"
        />
        Weather Details
      </h2>

      <div className="grid flex-1 grid-cols-2 gap-3 lg:grid-rows-4">
        {metricItems.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="flex min-w-0 flex-col justify-center rounded-2xl border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10"
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon
                  size={17}
                  className={`shrink-0 ${metric.color}`}
                />

                <span className="text-xs text-slate-400">
                  {metric.label}
                </span>
              </div>

              <p className="break-words text-base font-semibold text-white">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default WeatherMetrics;
