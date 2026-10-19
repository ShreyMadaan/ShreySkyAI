
import { useEffect, useState } from "react";
import {
  Sparkles,
  Shirt,
  Trees,
  Droplets,
  ShieldCheck,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import { getAIWeatherBrief } from "../../services/aiService";

const icons = [Shirt, Trees, Droplets, ShieldCheck];

function AIWeatherBrief({ weatherData }) {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!weatherData) {
      setBrief(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function generateBrief() {
      setLoading(true);
      setBrief(null);
      setError("");

      try {
        const result = await getAIWeatherBrief(
          weatherData,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setBrief(result);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    generateBrief();

    return () => controller.abort();
  }, [weatherData]);

  return (
    <section
      aria-busy={loading}
      className="glass-card relative flex h-full min-h-80 flex-col overflow-hidden p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={19} className="text-violet-300" />
          <h2 className="font-semibold">ShreySky AI Brief</h2>
        </div>

        <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-2.5 py-1 text-[10px] text-violet-200">
          Generative AI
        </span>
      </div>

      {loading && (
        <div
          role="status"
          className="flex flex-1 flex-col items-center justify-center gap-3"
        >
          <LoaderCircle
            size={30}
            className="animate-spin text-violet-300"
          />
          <p className="text-sm text-slate-300">
            AI is analyzing the weather...
          </p>
        </div>
      )}

      {!loading && error && (
        <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <AlertCircle size={28} className="text-rose-300" />
          <p className="text-sm text-rose-200">{error}</p>
        </div>
      )}

      {!loading && !error && brief && (
        <>
          <h3 className="text-xl font-semibold">
            {brief.headline}
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            {brief.summary}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {brief.insights.map((insight, index) => {
              const Icon = icons[index] || Sparkles;

              return (
                <div
                  key={`${insight.title}-${index}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3"
                >
                  <Icon
                    size={18}
                    className="mb-3 text-sky-300"
                  />

                  <h4 className="text-xs font-semibold">
                    {insight.title}
                  </h4>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {insight.description}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-auto pt-5 text-[11px] text-slate-500">
            AI-generated guidance based on live weather data.
          </p>
        </>
      )}
    </section>
  );
}

export default AIWeatherBrief;
