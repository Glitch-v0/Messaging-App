import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppContext } from "./context.jsx";
import { toast } from "sonner";
import router from "./routes.jsx";

const handleDarkMode = () => {
  // read local storage for dark mode
  const isDark = localStorage.getItem("darkMode") === "true";
  const root = document.querySelector(":root");
  // console.log(`Dark mode is set to ${isDark}, ${typeof isDark}`);
  root.style.setProperty("--main-color", isDark ? "#000000" : "#38195e");
  root.style.setProperty(
    "--nav-background-color",
    isDark ? "#0d0d0d" : "#2a1346"
  );
  root.style.setProperty("--font-color", isDark ? "#c5c5c5" : "#fde2ff");
  root.style.setProperty(
    "--button-background-color",
    isDark ? "#252525" : "#2a1346"
  );
};

const queryClient = new QueryClient();

function App() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/whoami`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setHasToken(data.authenticated); // Update based on backend response
        handleDarkMode();
      })
      .catch((err) => {
        setHasToken(false);
        //don't toast for login or register page
        if (
          window.location.pathname === "/login" ||
          window.location.pathname === "/"
        ) {
          return;
        }
        toast.error(err.message);
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider
        value={{
          hasToken,
          setHasToken,
        }}
      >
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </AppContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
