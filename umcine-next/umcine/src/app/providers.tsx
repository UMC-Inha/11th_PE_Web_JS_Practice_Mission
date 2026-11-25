"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "@/stores/auth-store";

const ONE_MINUTE = 60 * 1000;

export function Providers({ children }: { children: React.ReactNode }) {
  // 모듈 최상단에서 만들면 서버에서 여러 요청이 같은 캐시를 공유하므로 컴포넌트 안에서 한 번만 생성
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: ONE_MINUTE } },
      }),
  );

  // useEffect는 브라우저에서만 실행되므로 여기서 localStorage 로그인 정보를 불러옴
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
