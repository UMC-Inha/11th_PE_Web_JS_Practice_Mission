"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "../stores/auth-store";

export function Providers({ children }: { children: ReactNode }) {
  // staleTime 동안은 같은 key의 요청을 다시 보내지 않고 cache를 재사용함.
  // 요청마다 새 인스턴스가 생기지 않도록 state로 한 번만 만듦.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 1000 * 60, retry: 1 },
        },
      }),
  );

  // localStorage의 토큰은 브라우저에서만 복원할 수 있음
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
