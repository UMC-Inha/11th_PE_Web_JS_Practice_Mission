import { cn } from "../../utils/cn";

interface PosterImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

function PosterImage({ src, alt, className }: PosterImageProps) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={`${alt} (이미지 없음)`}
        className={cn(
          "flex items-center justify-center bg-gray-200 text-sm text-gray-500",
          className,
        )}
      >
        이미지 없음
      </div>
    );
  }

  return <img className={className} src={src} alt={alt} />;
}

export default PosterImage;
