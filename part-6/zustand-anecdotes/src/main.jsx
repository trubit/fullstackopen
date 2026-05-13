import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import App from "./App.jsx";

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </QueryClientProvider>,
);
