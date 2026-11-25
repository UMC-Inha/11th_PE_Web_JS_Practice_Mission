"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="flex-1 px-5 py-12">
    <h1 className="text-xl font-bold">화면을 불러오지 못했어요.</h1>
    <button onClick={reset} className="mt-4 rounded bg-blue-600 px-4 py-2 text-white">다시 시도</button>
  </main>;
}
