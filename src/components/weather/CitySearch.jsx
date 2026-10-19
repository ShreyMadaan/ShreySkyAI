
import { useEffect, useRef, useState } from "react";
import {
  Search,
  MapPin,
  Clock3,
  LoaderCircle,
  X,
} from "lucide-react";
import { searchCities } from "../../services/weatherService";

const STORAGE_KEY = "shreysky-recent-cities";
const MAX_RECENT = 5;

function readRecentCities() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function CitySearch({ onSelectCity }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState(readRecentCities);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      setError("");
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const cities = await searchCities(
          trimmed,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setResults(cities);
          setActiveIndex(-1);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setResults([]);
          setError("Unable to search cities.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const showingRecent = query.trim().length < 2;
  const options = showingRecent ? recent : results;

  function selectCity(city) {
    const selected = {
      id: city.id ?? `${city.latitude}-${city.longitude}`,
      name: city.name,
      country: city.country ?? "",
      admin1: city.admin1 ?? "",
      latitude: city.latitude,
      longitude: city.longitude,
    };

    const updated = [
      selected,
      ...recent.filter((item) => item.id !== selected.id),
    ].slice(0, MAX_RECENT);

    setRecent(updated);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch {
      // Search remains usable if storage is unavailable.
    }

    onSelectCity(selected);
    setQuery("");
    setResults([]);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        Math.min(index + 1, options.length - 1)
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }

    if (
      event.key === "Enter" &&
      open &&
      activeIndex >= 0 &&
      options[activeIndex]
    ) {
      event.preventDefault();
      selectCity(options[activeIndex]);
    }
  }

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1 md:w-80">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-sky-400/50">
        <Search
          size={18}
          className="shrink-0 text-slate-400"
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search city..."
          aria-label="Search city"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="city-search-list"
          aria-activedescendant={
            open && activeIndex >= 0
              ? `city-option-${activeIndex}`
              : undefined
          }
          className="min-w-0 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
        />

        {loading ? (
          <LoaderCircle
            size={16}
            className="shrink-0 animate-spin text-sky-300"
          />
        ) : query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setOpen(true);
              inputRef.current?.focus();
            }}
          >
            <X size={16} className="text-slate-400" />
          </button>
        ) : null}
      </div>

      {open && (
        <div
          id="city-search-list"
          role="listbox"
          aria-label="City suggestions"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl"
        >
          {showingRecent && recent.length > 0 && (
            <p className="px-3 py-2 text-xs font-medium text-slate-400">
              Recent searches
            </p>
          )}

          {options.map((city, index) => (
            <button
              id={`city-option-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              key={city.id ?? `${city.latitude}-${city.longitude}`}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectCity(city)}
              className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
                activeIndex === index
                  ? "bg-sky-400/15"
                  : "hover:bg-white/10"
              }`}
            >
              {showingRecent ? (
                <Clock3
                  size={17}
                  className="mt-0.5 shrink-0 text-slate-400"
                />
              ) : (
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-sky-300"
                />
              )}

              <div className="min-w-0">
                <p className="text-sm font-medium text-white">
                  {city.name}
                </p>
                <p className="text-xs text-slate-400">
                  {[city.admin1, city.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </button>
          ))}

          {!showingRecent && !loading && !error && options.length === 0 && (
            <p className="px-3 py-4 text-sm text-slate-400">
              No matching cities found.
            </p>
          )}

          {showingRecent && recent.length === 0 && (
            <p className="px-3 py-4 text-sm text-slate-400">
              Start typing to find a city.
            </p>
          )}

          {error && (
            <p className="px-3 py-4 text-sm text-rose-300">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default CitySearch;
