"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useProfileStore } from "@/stores/profile-store";

const ONE_MINUTE = 60 * 1000;

export function Providers({ children }: { children: ReactNode }) {
  // 모듈 전역이 아니라 state로 만들어야 서버에서 요청 간에 캐시가 공유되지 않는다.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: ONE_MINUTE } },
      }),
  );

  // localStorage는 브라우저에만 있으므로, 마운트된 뒤(=클라이언트)에 persist 스토어를 복원한다.
  useEffect(() => {
    useAuthStore.persist.rehydrate();
    useBookmarkStore.persist.rehydrate();
    useProfileStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
