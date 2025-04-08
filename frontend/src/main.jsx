import { StrictMode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Toaster } from "sonner";
import "./index.css";

const queryClient = new QueryClient();

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
      }}
      position="top-center"
    />
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
