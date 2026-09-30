import { cn } from "../../utils/cn";

const PAGES = [1, 2, 3, 4, 5];

export default function Pagination() {
  return (
    <nav className="mt-12 flex justify-center gap-2">
      {PAGES.map((page) => (
        <button
          key={page}
          className={cn(
            "h-9 w-9 rounded-lg",
            page === 1 ? "bg-[#4f5de8] text-white" : "text-gray-500",
          )}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}