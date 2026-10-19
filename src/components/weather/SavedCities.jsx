
import { Heart, MapPin, X } from "lucide-react";

function getCityKey(city) {
  return `${Number(city.latitude).toFixed(4)},${Number(
    city.longitude
  ).toFixed(4)}`;
}

function SavedCities({
  favorites,
  selectedCity,
  onSelectCity,
  onRemoveCity,
}) {
  if (favorites.length === 0) return null;

  const activeKey = getCityKey(selectedCity);

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center gap-2">
        <Heart size={17} className="text-rose-300" />

        <h2 className="text-sm font-semibold text-slate-200">
          Saved Cities
        </h2>

        <span className="text-xs text-slate-500">
          ({favorites.length})
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {favorites.map((city) => {
          const key = getCityKey(city);
          const active = key === activeKey;

          return (
            <div
              key={key}
              className={`flex items-center overflow-hidden rounded-2xl border transition ${
                active
                  ? "border-sky-400/50 bg-sky-400/15"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectCity(city)}
                aria-current={active ? "location" : undefined}
                className="flex items-center gap-2 px-4 py-3 text-sm"
              >
                <MapPin
                  size={15}
                  className={
                    active
                      ? "text-sky-300"
                      : "text-slate-400"
                  }
                />

                <span className="font-medium">
                  {city.name}
                </span>

                {city.country && (
                  <span className="text-xs text-slate-400">
                    {city.country}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onRemoveCity(city)}
                aria-label={`Remove ${city.name} from favorites`}
                title="Remove from favorites"
                className="border-l border-white/10 px-3 py-3 text-slate-400 transition hover:bg-rose-400/10 hover:text-rose-300"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SavedCities;
