
import { Clock3 } from "lucide-react";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { getWeatherIcon } from "../../utils/weatherIcons";

function HourlyForecast({ forecast }) {
    return (
        <section className="glass-card min-w-0 p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <Clock3 size={20} className="text-sky-300" />
                    Hourly Forecast
                </h2>

                <span className="text-xs text-slate-400">
                    Next 12 hours
                </span>
            </div>

            <div className="overflow-x-auto pb-2">
                <div className="min-w-[720px]">
                    <div className="h-36 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={forecast}
                                margin={{ top: 12, right: 15, left: 15, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient
                                        id="temperatureGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#7dd3fc"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#7dd3fc"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>

                                <XAxis dataKey="time" hide />
                                <YAxis domain={["dataMin - 2", "dataMax + 2"]} hide />

                                <Tooltip
                                    contentStyle={{
                                        background: "#14263d",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        borderRadius: "12px",
                                        color: "#fff",
                                    }}
                                    formatter={(value) => [`${value}°`, "Temperature"]}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="temperature"
                                    stroke="#7dd3fc"
                                    strokeWidth={3}
                                    fill="url(#temperatureGradient)"
                                    dot={{ r: 3, fill: "#bae6fd" }}
                                    activeDot={{ r: 6 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div
                        className="mt-3 grid gap-2"
                        style={{
                            gridTemplateColumns: `repeat(${forecast.length}, minmax(0, 1fr))`,
                        }}
                    >
                        {forecast.map((hour, index) => {
                            const WeatherIcon = getWeatherIcon(
                                hour.weatherCode,
                                hour.isDay
                            );

                            return (
                                <div
                                    key={`${hour.time}-${index}`}
                                    className="flex flex-col items-center gap-3 text-center"
                                >
                                    <span className="text-xs text-slate-400">
                                        {hour.time}
                                    </span>

                                    <WeatherIcon
                                        size={23}
                                        className="text-sky-200"
                                        strokeWidth={1.7}
                                    />

                                    <span className="text-sm font-semibold">
                                        {hour.temperature}°
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HourlyForecast;
