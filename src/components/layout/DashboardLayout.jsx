
import { useState } from "react";

import Navbar from "./Navbar";
import SavedCities from "../weather/SavedCities";
import { useFavoriteCities } from "../../hooks/useFavoriteCities";

const DEFAULT_CITY = {
  id: "delhi-default",
  name: "Delhi",
  country: "India",
  latitude: 28.6139,
  longitude: 77.209,
};

function DashboardLayout({ children }) {
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY);

  const {
    favorites,
    isFavorite,
    toggleFavorite,
  } = useFavoriteCities();

  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Navbar onSelectCity={setSelectedCity} />

        <main className="pb-12">
          <SavedCities
            favorites={favorites}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            onRemoveCity={toggleFavorite}
          />

          {typeof children === "function"
            ? children({
                selectedCity,
                isFavorite: isFavorite(selectedCity),
                onToggleFavorite: () =>
                  toggleFavorite(selectedCity),
              })
            : children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
