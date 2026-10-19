
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <DashboardLayout>
      {({
        selectedCity,
        isFavorite,
        onToggleFavorite,
      }) => (
        <Dashboard
          selectedCity={selectedCity}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </DashboardLayout>
  );
}

export default App;
