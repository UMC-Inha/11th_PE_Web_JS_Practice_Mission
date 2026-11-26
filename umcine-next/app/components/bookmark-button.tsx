"use client";

import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";
import { useFavoriteMutations } from "@/hooks/use-favorite-mutations";
import { useFavoritesQuery } from "@/hooks/use-favorite-query";
import { useAuthStore } from "@/stores/auth-store";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: favorites } = useFavoritesQuery();
  const { addMutation, deleteMutation } = useFavoriteMutations(movieId);

  const isBookmarked = favorites?.some((favorite) => favorite.movieId === movieId) ?? false;
  const isPending = addMutation.isPending || deleteMutation.isPending;

  const handleClick = () => {
    if (!accessToken) {
      router.push("/login");
      return;
    }
    if (isBookmarked) deleteMutation.mutate();
    else addMutation.mutate();
  };

  return (
    // movie-card.tsx에 있던 포스터 위 아이콘 배지 스타일을 그대로 옮김
    <button
      type="button"
      aria-pressed={isBookmarked}
      disabled={isPending}
      onClick={handleClick}
      className={cn(
        "absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-lg border-none cursor-pointer transition-colors",
        isBookmarked ? "bg-blue-600" : "bg-black/55",
      )}
    >
      <img
        src={
          isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"
        }
        alt={isBookmarked ? "북마크 해제" : "북마크 추가"}
        className="size-4 invert" // SVG가 검정(fill=black)이라 어두운 배지 위에서 흰색으로 보이도록 반전
      />
    </button>
  );
}
