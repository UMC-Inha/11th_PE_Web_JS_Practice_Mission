export default function Pagination() {
  const buttonClass =
    'h-9 min-w-9 rounded-md border border-[#e3e6eb] bg-white px-2 text-sm text-[#17191e] hover:border-[#2563eb]'

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="영화 목록 페이지">
      <button className={buttonClass} type="button">이전</button>
      <button
        className="h-9 min-w-9 rounded-md border border-[#2563eb] bg-[#2563eb] px-2 text-sm text-white"
        type="button"
        aria-current="page"
      >
        1
      </button>
      <button className={buttonClass} type="button">2</button>
      <button className={buttonClass} type="button">3</button>
      <button className={buttonClass} type="button">다음</button>
    </nav>
  )
}
