"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center gap-4 px-5 py-16">
      <h1 className="text-xl font-bold">화면을 불러오지 못했어요.</h1>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-blue-600 px-5 py-3 text-white"
      >
        다시 시도
      </button>
    </main>
  );
}
