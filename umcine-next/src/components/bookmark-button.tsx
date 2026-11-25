"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createFavorite } from "../api/favorites/create-favorite";
import { deleteFavorite } from "../api/favorites/delete-favorite";
import { getFavorites } from "../api/favorites/get-favorites";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "icon" | "label";
}

export function BookmarkButton({
  movieId,
  variant = "icon",
}: BookmarkButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const router = useRouter();

  const isDetail = variant === "label";
  const isLoggedIn = Boolean(accessToken);

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: isLoggedIn && !isDetail,
    retry: false,
  });

  const statusQuery = useQuery({
    queryKey: ["favorites", "status", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: isLoggedIn && isDetail,
    retry: false,
  });

  const isBookmarked = isDetail
    ? (statusQuery.data ?? false)
    : (favoritesQuery.data?.some((favorite) => favorite.movieId === movieId) ??
      false);

  const applyResult = (nextIsFavorite: boolean) => {
    queryClient.setQueryData(["favorites", "status", movieId], nextIsFavorite);
    queryClient.invalidateQueries({ queryKey: ["favorites"], exact: true });
  };

  const createMutation = useMutation({
    mutationFn: () => createFavorite(movieId),
    onSuccess: () => applyResult(true),
    onError: () => {
      alert("즐겨찾기 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteFavorite(movieId),
    onSuccess: () => applyResult(false),
    onError: () => {
      alert("즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.");
    },
  });

  const isPending = createMutation.isPending || deleteMutation.isPending;

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (isPending) return;

    if (isBookmarked) {
      deleteMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const iconSrc = isBookmarked
    ? "/icons/bookmark.svg"
    : "/icons/bookmark-outline.svg";

  if (variant === "label") {
    return (
      <button
        type="button"
        aria-pressed={isBookmarked}
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          "mt-5 inline-flex h-9 cursor-pointer items-center gap-2 rounded-md px-3.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-60",
          isBookmarked ? "bg-[#1d4ed8]" : "bg-[#2563EB]",
        )}
      >
        <img src={iconSrc} alt="" className="size-3.5 brightness-0 invert" />
        즐겨찾기
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "absolute top-2 right-2 grid size-7 cursor-pointer place-items-center rounded-md border p-0 disabled:cursor-not-allowed disabled:opacity-60",
        isBookmarked
          ? "border-[#2563EB] bg-[#2563EB]"
          : "border-white/85 bg-black/55",
      )}
    >
      <img src={iconSrc} alt="" className="size-3.5 brightness-0 invert" />
    </button>
  );
}