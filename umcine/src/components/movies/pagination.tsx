import { cn } from "../../utils/cn";

const pageButton =
  "grid size-8 place-items-center rounded-lg text-sm disabled:cursor-default disabled:opacity-30";

export default function Pagination() {
  return (
    <nav className="flex items-center justify-center gap-2" aria-label="페이지 이동">
      <button type="button" className={pageButton} disabled aria-label="이전 페이지">
        <img src="/icons/chevron-left.svg" alt="" width={16} height={16} />
      </button>
      <button
        type="button"
        className={cn(pageButton, "bg-blue-600 text-white")}
        aria-current="page"
      >
        1
      </button>
      <button type="button" className={pageButton} disabled aria-label="다음 페이지">
        <img src="/icons/chevron-right.svg" alt="" width={16} height={16} />
      </button>
    </nav>
  );
}