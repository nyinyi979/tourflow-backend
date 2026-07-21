import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AppProviders } from "@/app/AppProviders";
import { queryClient } from "@/app/queryClient";
import { router } from "@/app/router";
import { ADMIN_UNAUTHORIZED_EVENT } from "@/lib/auth";
import "./index.css";

window.addEventListener(ADMIN_UNAUTHORIZED_EVENT, () => {
  queryClient.clear();
  void router.navigate({ to: "/login", replace: true });
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element was not found");
}

ReactDOM.createRoot(rootElement).render(
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>,
);
