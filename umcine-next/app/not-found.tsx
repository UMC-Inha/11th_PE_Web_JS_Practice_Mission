import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 px-5 py-12 xl:px-20">
      <h1 className="text-2xl font-bold">페이지를 찾을 수 없어요.</h1>
      <Link href="/" className="mt-5 inline-block text-blue-600 underline">
        영화 목록으로
      </Link>
    </main>
  );
}
