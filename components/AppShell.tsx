"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV = [
  { href: "/", label: "대시보드" },
  { href: "/students", label: "학생" },
  { href: "/attendance", label: "출결" },
  { href: "/sms", label: "문자" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <Link href="/" className="brand">
            HANOL
          </Link>
          <span className="brand-sub">Manager</span>
        </div>
        <nav className="nav" aria-label="주요 메뉴">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "nav-link active" : "nav-link"}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}
