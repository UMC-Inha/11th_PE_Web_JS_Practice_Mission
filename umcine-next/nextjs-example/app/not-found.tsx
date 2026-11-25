import Link from "next/link";
export default function NotFound() {
  return <main className="mx-auto w-full max-w-320 flex-1 px-5 py-12">
    <h1 className="text-2xl font-bold">페이지를 찾을 수 없어요.</h1>
    <Link href="/" className="mt-4 inline-block text-blue-700">영화 목록으로</Link>
  </main>;
}
