import { useState, useEffect } from "react";
import DailyStoria from "./pages/DailyStoria";
import DailyCheckin from "./pages/DailyCheckin";

// Route configuration
const ROUTES = {
  HOME: "/",
  DAILY_STORIA: "/daily-storia",
  DAILY_CHECKIN: "/daily-checkin",
};

// Map routes to page identifiers
const getPageFromPath = (pathname) => {
  switch (pathname) {
    case ROUTES.DAILY_STORIA:
      return "dailyStoria";
    case ROUTES.DAILY_CHECKIN:
      return "dailyCheckin";
    default:
      return "home";
  }
};

const App = () => {
  const [currentPage, setCurrentPage] = useState(() =>
    getPageFromPath(window.location.pathname)
  );

  useEffect(() => {
    // Handle browser back/forward buttons
    const handlePopState = () => {
      setCurrentPage(getPageFromPath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (route) => {
    setCurrentPage(getPageFromPath(route));
    window.history.pushState({}, "", route);
  };

  const navigateToHome = () => navigate(ROUTES.HOME);
  const navigateToDailyStoria = () => navigate(ROUTES.DAILY_STORIA);
  const navigateToDailyCheckin = () => navigate(ROUTES.DAILY_CHECKIN);

  // Render pages based on current route
  switch (currentPage) {
    case "dailyStoria":
      return <DailyStoria onNavigateHome={navigateToHome} />;
    case "dailyCheckin":
      return <DailyCheckin onNavigateHome={navigateToHome} />;
    default:
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <button
            style={{
              padding: "20px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
            onClick={navigateToDailyStoria}
          >
            Daily Storia
          </button>
          <button
            style={{
              padding: "20px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
            onClick={navigateToDailyCheckin}
          >
            Daily Check-in
          </button>
        </div>
      );
  }
};

export default App;
