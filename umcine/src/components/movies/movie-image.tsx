import { cn } from "../../utils/cn";

interface MovieImageProps {
  src: string | null;
  alt: string;
  className?: string;
}
export function MovieImage({ src, alt, className }: MovieImageProps) {
  return src ? (
    <img src={src} alt={alt} className={className} />
  ) : (
    <div className={cn("flex items-center justify-center bg-gray-300 text-sm text-gray-700", className)}>
      이미지 없음
    </div>
  );
}