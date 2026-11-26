"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/auth-store";

function subscribeToHydration(callback: () => void) {
  const unsubscribeHydrate = useAuthStore.persist.onHydrate(callback);
  const unsubscribeFinish = useAuthStore.persist.onFinishHydration(callback);

  return () => {
    unsubscribeHydrate();
    unsubscribeFinish();
  };
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
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
  }, [accessToken, hasHydrated, router]);

  if (!hasHydrated) {
    return (
      <main className="py-16 text-center text-sm text-[#606774]">
        로그인 정보를 확인하는 중이에요.
      </main>
    );
  }

  if (!accessToken) {
    return null;
  }

  return <>{children}</>;
}
