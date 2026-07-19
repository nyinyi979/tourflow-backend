"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function QueryClientProviderComponent({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClientInstance}>
      {children}
    </QueryClientProvider>
  );
}
