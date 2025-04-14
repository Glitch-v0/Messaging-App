import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Toaster } from "sonner";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster
      toastOptions={{
        style: {
          border: "1px solid var(--font-color)",
          color: "var(--font-color)",
          background: "var(--nav-background-color)",
          fontSize: "1rem",
        },
        closeButton: true,
      }}
      position="top-center"
    />
    <App />
  </StrictMode>
);
