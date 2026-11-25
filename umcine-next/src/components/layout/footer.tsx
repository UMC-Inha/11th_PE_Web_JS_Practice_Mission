import Image from "next/image";

export default function Footer() {
  return (
    <footer className="h-[87px] w-full shrink-0 border-t border-gray-200 bg-white">
      <div className="flex h-full w-full items-center justify-end gap-2 px-5 xl:px-20">
        <Image
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
          width={274}
          height={36}
          className="h-auto w-14"
        />

        <p className="text-[11px] text-gray-500">
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
