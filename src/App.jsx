
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider } from "./context/AuthContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";

function WeatherDashboard() {
  return (
    <DashboardLayout>
      {({ selectedCity, isFavorite, onToggleFavorite }) => (
        <Dashboard
          selectedCity={selectedCity}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </DashboardLayout>
  );
}

function App() {
  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<WeatherDashboard />} />
            <Route path="/auth/:mode" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
