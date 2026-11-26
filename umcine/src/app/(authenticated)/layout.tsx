"use client";

import {
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/auth-store";

function subscribeToHydration(onChange: () => void) {
  const unsubscribeStart =
    useAuthStore.persist.onHydrate(onChange);

  const unsubscribeFinish =
    useAuthStore.persist.onFinishHydration(onChange);

  return () => {
    unsubscribeStart();
    unsubscribeFinish();
  };
}

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );

  useEffect(() => {
    if (hasHydrated && !accessToken) {
      router.replace("/login");
    }
  }, [hasHydrated, accessToken, router]);

  if (!hasHydrated || !accessToken) {
    return (
      <main className="flex-1 px-5 py-6">
        로그인 정보를 확인하는 중이에요.
      </main>
    );
  }

  return <>{children}</>;
}