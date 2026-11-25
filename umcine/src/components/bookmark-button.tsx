import { Link } from "@tanstack/react-router";
import { useFavoriteMutation, useFavoritesQuery, useFavoriteStatusQuery } from "../hooks/use-favorites-query";
import { useAuthStore } from "../stores/auth-store";
import { useBookmarkStore } from "../stores/bookmark-store";
import { getAuthMemberId } from "../utils/auth-member-id";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "icon" | "text";
  className?: string;
  checkStatus?: boolean;
}

export function BookmarkButton(props: BookmarkButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getAuthMemberId(accessToken);
  if (memberId !== null) {
    return <ServerBookmarkButton key={memberId} {...props} memberId={memberId} />;
  }

  return props.checkStatus ? (
    <Link to="/login" className={cn("inline-block text-sm font-semibold text-blue-700", props.className)}>
      로그인하고 즐겨찾기
    </Link>
  ) : <LocalBookmarkButton {...props} />;
}

function LocalBookmarkButton(props: BookmarkButtonProps) {
  const active = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(props.movieId));
  const toggle = useBookmarkStore((state) => state.toggleBookmark);
  return <BookmarkControl {...props} active={active} onClick={() => toggle(props.movieId)} />;
}

function ServerBookmarkButton({ memberId, ...props }: BookmarkButtonProps & { memberId: number }) {
  const { movieId, checkStatus } = props;
  const list = useFavoritesQuery(memberId, !checkStatus);
  const status = useFavoriteStatusQuery(memberId, movieId, Boolean(checkStatus));
  const mutation = useFavoriteMutation(memberId, movieId);
  const query = checkStatus ? status : list;
  const active = checkStatus
    ? status.data === true
    : list.data?.some((item) => Number(item.movieId) === movieId) === true;

  if (query.isError && query.data === undefined) {
    return (
      <button type="button" className={cn("rounded bg-white px-2 py-1 text-xs text-red-700", props.className)}
        onClick={() => void query.refetch()} aria-label="즐겨찾기 조회 다시 시도">
        {props.variant === "icon" ? "↻" : "즐겨찾기 조회 다시 시도"}
      </button>
    );
  }

  return (
    <BookmarkControl {...props} active={active} disabled={query.isPending || mutation.isPending}
      onClick={() => mutation.mutate(active, {
        onError: () => alert("즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요."),
      })} />
  );
}

function BookmarkControl({
  variant = "text", className, active, disabled, onClick,
}: Pick<BookmarkButtonProps, "variant" | "className"> & {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const label = active ? "북마크 해제" : "북마크 추가";

  return (
    <button type="button" aria-label={label} aria-pressed={active} disabled={disabled} onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-md text-white disabled:opacity-50",
        variant === "icon" ? "h-8 w-8 border border-white p-0" : "gap-2 px-4 py-3 text-sm font-bold",
        active ? "bg-[#2864fa]" : "bg-black/55",
        className,
      )}>
      <img src={active ? "/movie-icons/bookmark.svg" : "/movie-icons/bookmark-outline.svg"} alt=""
        className={cn("brightness-0 invert", variant === "icon" ? "h-5 w-5" : "h-4 w-4")} />
      {variant === "text" && label}
    </button>
  );
}
