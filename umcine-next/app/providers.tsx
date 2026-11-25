"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { isHTTPError } from "ky";
import { useAuthStore } from "@/src/stores/auth-store";
import { useBookmarkStore } from "@/src/stores/bookmark-store";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: (failureCount, error) => {
              if (
                isHTTPError(error) &&
                error.response.status >= 400 &&
                error.response.status < 500 &&
                error.response.status !== 429
              ) {
                return false;
              }

              return failureCount < 2;
            },
          },
        },
      }),
  );

  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state, previousState) => {
      if (state.accessToken === previousState.accessToken) return;

      for (const key of ["members", "favorites", "favorite", "ratings"]) {
        void queryClient.cancelQueries({ queryKey: [key] });
        queryClient.removeQueries({ queryKey: [key] });
      }

      useBookmarkStore.getState().clearBookmarks();
    });

    void Promise.resolve(useAuthStore.persist.rehydrate()).finally(() => {
      useAuthStore.getState().setHasHydrated(true);
    });

    return unsubscribe;
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
