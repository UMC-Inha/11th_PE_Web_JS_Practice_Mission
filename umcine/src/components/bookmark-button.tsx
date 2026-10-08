import { useBookmarkStore } from '../stores/bookmark-store'

interface BookmarkButtonProps {
  movieId: number
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  )
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark)

  return (
    <button
      className="mt-4 inline-flex h-8 items-center gap-1 rounded bg-[#2563eb] px-3 text-xs font-semibold text-white hover:bg-[#1d4ed8]"
      type="button"
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        className="h-3.5 w-3.5 brightness-0 invert"
        src={isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
        alt=""
      />
      {isBookmarked ? '즐겨찾기 해제' : '즐겨찾기'}
    </button>
  )
}