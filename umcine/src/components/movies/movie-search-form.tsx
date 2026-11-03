import type { SubmitEvent } from "react";

interface MovieSearchFormProps {
  variant: "initial" | "results";
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onClear: () => void;
}

export function MovieSearchForm({ variant, searchText, onSearchTextChange, onSubmit, onClear }: MovieSearchFormProps) {
  return variant === "initial" ? (
    <form
      onSubmit={onSubmit}
      className="flex h-[74px] w-full items-center rounded-[10px] border-2 border-[#17191E] bg-white px-[17px]"
    >
      <img
        src="/icons/search.svg"
        alt=""
        className="h-[18px] w-[18px]"
      />

      <input
        aria-label="검색어"
        placeholder="예: 스파이더맨"
        value={searchText}
        onChange={(event) => onSearchTextChange(event.target.value)}
        className="ml-[14px] min-w-0 flex-1 border-none bg-transparent text-[14px] outline-none placeholder:text-[#969DA8]"
      />

      <button
        type="submit"
        className="flex h-[42px] w-[59px] items-center justify-center rounded-[8px] bg-[#17191E] text-[14px] font-bold text-white"
      >
        검색
      </button>
    </form>
  ) : (
    <form
      onSubmit={onSubmit}
      className="flex h-[56px] w-full items-center rounded-[10px] border border-[#DCE0E6] bg-white px-4"
    >
      <img
        src="/icons/search.svg"
        alt=""
        className="h-5 w-5"
      />

      <input
        aria-label="검색어"
        value={searchText}
        onChange={(event) => onSearchTextChange(event.target.value)}
        className="ml-4 min-w-0 flex-1 border-none bg-transparent text-[14px] font-semibold outline-none"
      />

      <button
        type="button"
        onClick={onClear}
        aria-label="검색어 지우기"
        className="mr-4 flex h-8 w-8 items-center justify-center text-[28px] font-light text-[#697281]"
      >
        ×
      </button>

      <button
        type="submit"
        className="flex h-[42px] items-center justify-center rounded-[8px] bg-[#17191E] px-4 text-[14px] font-bold text-white"
      >
        다시 검색
      </button>
    </form>
  );
}
