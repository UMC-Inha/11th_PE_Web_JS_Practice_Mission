import { cn } from "../../utils/cn";

export default function Pagination() {
  const buttonClass =
    "flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-transparent p-0  text-sm";

  return (
    <div className="flex h-9 items-center justify-center gap-1">
      <button className={buttonClass} type="button">
        <img
          src="/icons/chevron-left.svg"
          alt="이전 페이지"
          className="h-6 w-6"
        />
      </button>

      <button
        className={cn(buttonClass, "bg-[#2563eb] text-white")}
        type="button"
      >
        1
      </button>

      <button className={buttonClass} type="button">
        2
      </button>

      <button className={buttonClass} type="button">
        3
      </button>

      <button className={buttonClass} type="button">
        4
      </button>

      <button className={buttonClass} type="button">
        5
      </button>

      <button className={buttonClass} type="button">
        <img
          src="/icons/chevron-right.svg"
          alt="다음 페이지"
          className="h-6 w-6"
        />
      </button>
    </div>
  );
}