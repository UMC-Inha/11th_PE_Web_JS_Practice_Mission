"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

const navLinkClass = "text-sm leading-[17px] font-bold";
const activeNavLinkClass = "text-[#17191E] underline";
const inactiveNavLinkClass = "text-[#606774]";

// 현재 주소를 읽어 메뉴 활성 표시 (TanStack의 useMatchRoute, activeProps 대체)
export function HeaderNav() {
  const pathname = usePathname();
  return <HeaderNavLinks pathname={pathname} />;
}

// pathname이 null이면 모두 비활성으로 그림 (Suspense fallback용)
export function HeaderNavLinks({ pathname }: { pathname: string | null }) {
  const isActive = (path: string) =>
    pathname === path || Boolean(pathname?.startsWith(`${path}/`));

  const links = [
    { href: "/", label: "영화", active: pathname === "/" || isActive("/movies") },
    { href: "/search", label: "검색", active: isActive("/search") },
    { href: "/me", label: "내 정보", active: isActive("/me") },
  ];

  return (
    <nav aria-label="주요 메뉴" className="flex items-center gap-[30px]">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            navLinkClass,
            link.active ? activeNavLinkClass : inactiveNavLinkClass,
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
