import { useRouter } from "next/navigation";
import {
  useCreateFavoriteMutation,
  useDeleteFavoriteMutation,
  useFavoritesQuery,
} from "../hooks/use-favorites";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const favoritesQuery = useFavoritesQuery();
  const createFavoriteMutation = useCreateFavoriteMutation();
  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  const isBookmarked =
    favoritesQuery.data?.some((favorite) => favorite.movieId === movieId) ?? false;
  const isPending = createFavoriteMutation.isPending || deleteFavoriteMutation.isPending;

  const handleClick = () => {
    if (!accessToken) {
      router.push("/login");
      return;
    }
    if (isPending) return;

    if (isBookmarked) {
      deleteFavoriteMutation.mutate(movieId);
    } else {
      createFavoriteMutation.mutate(movieId);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md border",
        isBookmarked ? "border-[#4f5de8] bg-[#4f5de8]" : "border-white bg-black/40",
      )}
    >
      <img
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt={isBookmarked ? "북마크 해제" : "북마크 추가"}
        className="h-4 w-4 brightness-0 invert"
      />
    </button>
  );
}