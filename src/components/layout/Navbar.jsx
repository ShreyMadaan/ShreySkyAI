
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CloudSun,
  MapPin,
  LoaderCircle,
  LogOut,
  UserRound,
} from "lucide-react";

import CitySearch from "../weather/CitySearch";
import { useAuth } from "../../context/AuthContext";

function Navbar({ onSelectCity }) {
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [authError, setAuthError] = useState("");

  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

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

  async function handleLogout() {
    setLoggingOut(true);
    setAuthError("");

    try {
      await logout();
      navigate("/");
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 py-5">
      <Link to="/" className="flex items-center gap-3">
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
      </Link>

      <div className="flex w-full flex-col gap-2 lg:w-auto">
        <div className="flex w-full flex-wrap items-center gap-3">
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
              <LoaderCircle size={19} className="animate-spin" />
            ) : (
              <MapPin size={19} />
            )}
          </button>

          {!loading && !user && (
            <div className="flex items-center gap-2">
              <Link
                to="/auth/login"
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-200 transition hover:bg-white/10"
              >
                Login
              </Link>

              <Link
                to="/auth/signup"
                className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                Sign up
              </Link>
            </div>
          )}

          {!loading && user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <UserRound size={17} className="text-sky-300" />
                <span className="max-w-28 truncate text-sm">
                  {user.name}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                title="Logout"
                aria-label="Logout"
                className="rounded-xl border border-white/10 bg-white/5 p-2.5 transition hover:bg-white/10 disabled:opacity-50"
              >
                {loggingOut ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <LogOut size={18} />
                )}
              </button>
            </div>
          )}
        </div>

        {locationError && (
          <p role="alert" className="text-xs text-rose-300">
            {locationError}
          </p>
        )}

        {authError && (
          <p role="alert" className="text-xs text-rose-300">
            {authError}
          </p>
        )}
      </div>
    </header>
  );
}

export default Navbar;
