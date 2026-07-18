"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/cn";
import { isNavActive, NAV_ITEMS } from "@/lib/nav";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <MobileNav />
          <a href="/" className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              HANOL 통합 관리자
            </p>
            <p className="truncate text-xs text-slate-500">
              학생 · 출결 · 수납 · 수업 횟수
            </p>
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
            aria-label="알림"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white py-1.5 pr-3 pl-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-xs font-semibold text-white">
              김
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-800">김한올</p>
              <p className="text-xs text-slate-500">원장</p>
            </div>
          </div>
        </div>
      </div>

      <nav
        aria-label="주요 메뉴"
        className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 lg:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition",
                active
                  ? "bg-teal-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
