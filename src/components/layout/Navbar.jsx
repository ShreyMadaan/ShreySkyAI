
import { useState } from "react";
import {
  CloudSun,
  MapPin,
  LoaderCircle,
} from "lucide-react";

import CitySearch from "../weather/CitySearch";

function Navbar({ onSelectCity }) {
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  function handleCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    setLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        onSelectCity({
          id: `geo-${latitude}-${longitude}`,
          name: "Current Location",
          country: "",
          latitude,
          longitude,
        });

        setLocating(false);
      },
      (error) => {
        setLocationError(
          error.code === 1
            ? "Location permission denied."
            : "Unable to determine your location."
        );
        setLocating(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 py-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-sky-400/15 p-3 text-sky-300">
          <CloudSun size={26} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight">
            ShreySky<span className="text-sky-300">AI</span>
          </h1>
          <p className="text-xs text-slate-400">
            Intelligent weather companion
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 md:w-auto">
        <div className="flex w-full items-center gap-3">
          <CitySearch onSelectCity={onSelectCity} />

          <button
            type="button"
            aria-label="Use current location"
            title="Use current location"
            disabled={locating}
            onClick={handleCurrentLocation}
            className="shrink-0 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 disabled:opacity-50"
          >
            {locating ? (
              <LoaderCircle
                size={19}
                className="animate-spin"
              />
            ) : (
              <MapPin size={19} />
            )}
          </button>
        </div>

        {locationError && (
          <p role="alert" className="text-xs text-rose-300">
            {locationError}
          </p>
        )}
      </div>
    </header>
  );
}

export default Navbar;
