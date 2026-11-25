import NextImage from "next/image";
import { cn } from "../../utils/cn";

interface MovieImageProps {
  src: string | null;
  alt: string;
  className?: string;
}
export function MovieImage({ src, alt, className }: MovieImageProps) {
  return src ? (
    <NextImage width={src.includes("/w1280") ? 1280 : 500} height={src.includes("/w1280") ? 720 : 750} src={src} alt={alt} className={className} />
  ) : (
    <div className={cn("flex items-center justify-center bg-gray-300 text-sm text-gray-700", className)}>
      이미지 없음
    </div>
  );
}
