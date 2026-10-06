import { cn } from "../../utils/cn";

interface PaginationProps { currentPage: number; totalPages: number; }

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const buttonClassName = "grid size-8.5 place-items-center rounded-[5px] border border-transparent bg-transparent p-0 text-sm text-[#6d6977] enabled:hover:border-[#ddd9e6] enabled:hover:bg-white disabled:cursor-not-allowed disabled:opacity-36";

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="영화 목록 페이지">
      <button className={buttonClassName} type="button" aria-label="이전 페이지" disabled><img className="size-4.5" src="/icons/chevron-left.svg" alt="" /></button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button key={page} className={cn(buttonClassName, page === currentPage && "bg-[#201e2d] text-white")} type="button" aria-label={`${page}페이지`} aria-current={page === currentPage ? "page" : undefined}>{page}</button>
      ))}
      <button className={buttonClassName} type="button" aria-label="다음 페이지"><img className="size-4.5" src="/icons/chevron-right.svg" alt="" /></button>
    </nav>
  );
}
