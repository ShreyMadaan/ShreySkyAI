
import { useState } from "react";

const STORAGE_KEY = "shreysky-favorite-cities";

function getCityKey(city) {
  if (!city) return "";

  return `${Number(city.latitude).toFixed(4)},${Number(
    city.longitude
  ).toFixed(4)}`;
}

function loadFavorites() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(stored)) return [];

    return stored.filter(
      (city) =>
        city &&
        typeof city.name === "string" &&
        Number.isFinite(city.latitude) &&
        Number.isFinite(city.longitude)
    );
  } catch {
    return [];
  }
}

export function useFavoriteCities() {
  const [favorites, setFavorites] = useState(loadFavorites);

  function updateFavorites(updater) {
    setFavorites((previous) => {
      const updated = updater(previous);

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch {
        // Favorites still work for the current session.
      }

      return updated;
    });
  }

  function isFavorite(city) {
    const key = getCityKey(city);

    return favorites.some(
      (favorite) => getCityKey(favorite) === key
    );
  }

  function toggleFavorite(city) {
    if (!city) return;

    const key = getCityKey(city);

    updateFavorites((previous) => {
      const exists = previous.some(
        (favorite) => getCityKey(favorite) === key
      );

      if (exists) {
        return previous.filter(
          (favorite) => getCityKey(favorite) !== key
        );
      }

      return [...previous, city];
    });
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
}
