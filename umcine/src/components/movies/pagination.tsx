import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const buttonClass =
  "grid size-9 cursor-pointer place-items-center rounded-lg border border-[#e5e7eb] bg-white text-[13px] text-[#555] disabled:cursor-not-allowed disabled:opacity-40";

// 현재 페이지 양옆으로 보여 줄 번호 개수
const SIBLING_COUNT = 2;

function getPageItems(currentPage: number, totalPages: number) {
  const items: (number | "ellipsis")[] = [];

  const start = Math.max(2, currentPage - SIBLING_COUNT);
  const end = Math.min(totalPages - 1, currentPage + SIBLING_COUNT);

  items.push(1);

  if (start > 2) {
    items.push("ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < totalPages - 1) {
    items.push("ellipsis");
  }

  if (totalPages > 1) {
    items.push(totalPages);
  }

  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageItems = getPageItems(currentPage, totalPages);

  return (
    <nav aria-label="페이지 이동" className="mt-10 flex justify-center gap-2">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={buttonClass}
      >
        <img src="/icons/chevron-left.svg" alt="" className="size-4" />
      </button>

      {pageItems.map((item, index) => {
        if (item === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="grid size-9 place-items-center text-[13px] text-[#9ca3af]"
            >
              …
            </span>
          );
        }

        const isActive = item === currentPage;

        return (
          <button
            key={item}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className={cn(
              buttonClass,
              isActive && "border-[#4b5ee4] bg-[#4b5ee4] font-bold text-white",
            )}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={buttonClass}
      >
        <img src="/icons/chevron-right.svg" alt="" className="size-4" />
      </button>
    </nav>
  );
}