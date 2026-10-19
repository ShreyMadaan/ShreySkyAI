
import { CloudSun, AlertCircle } from "lucide-react";

import CurrentWeather from "../components/weather/CurrentWeather";
import HourlyForecast from "../components/weather/HourlyForecast";
import WeeklyForecast from "../components/weather/WeeklyForecast";
import WeatherMetrics from "../components/weather/WeatherMetrics";
import AIWeatherBrief from "../components/ai/AIWeatherBrief";

import { useWeather } from "../hooks/useWeather";

function Dashboard({
    selectedCity,
    isFavorite,
    onToggleFavorite,
}) {
    const { weather, loading, error } = useWeather(selectedCity);



    if (loading) {
        return (
            <div
                role="status"
                className="glass-card flex min-h-96 flex-col items-center justify-center gap-4 p-8"
            >
                <CloudSun
                    size={48}
                    className="animate-pulse text-sky-300"
                />

                <p className="text-lg font-medium">
                    Fetching live weather...
                </p>

                <p className="text-sm text-slate-400">
                    Preparing your weather dashboard
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                role="alert"
                className="glass-card flex min-h-80 flex-col items-center justify-center gap-4 p-8 text-center"
            >
                <AlertCircle size={42} className="text-rose-400" />

                <h2 className="text-xl font-semibold">
                    Unable to load weather
                </h2>

                <p className="max-w-md text-sm text-slate-400">
                    {error}
                </p>

                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="rounded-xl bg-sky-400 px-5 py-2.5 font-medium text-slate-950 transition hover:bg-sky-300"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!weather) return null;

    const {
        currentWeather,
        hourlyForecast,
        weeklyForecast,
        metrics,
    } = weather;

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="min-w-0 lg:col-span-2">
                <CurrentWeather
                    weather={currentWeather}
                    isFavorite={isFavorite}
                    onToggleFavorite={() =>
                        setIsFavorite((previous) => !previous)
                    }
                />
            </div>

            <div className="min-w-0">
                <AIWeatherBrief weatherData={weather} />
            </div>

            <div className="min-w-0 lg:col-span-3">
                <HourlyForecast forecast={hourlyForecast} />
            </div>

            <div className="min-w-0 lg:col-span-2">
                <WeeklyForecast forecast={weeklyForecast} />
            </div>

            <div className="min-w-0">
                <WeatherMetrics metrics={metrics} />
            </div>
        </div>
    );
}

export default Dashboard;
