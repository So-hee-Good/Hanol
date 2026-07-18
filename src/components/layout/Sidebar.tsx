"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { isNavActive, NAV_ITEMS } from "@/lib/nav";

/**
 * Next.js Link(소프트 라우팅) 대신 일반 <a>를 사용합니다.
 * Cursor 미리보기/포트포워딩 환경에서 메뉴 클릭이 무시되는 문제를 피합니다.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200/80 px-6">
        <a
          href="/"
          className="flex items-center gap-3"
          aria-label="HANOL 대시보드"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold text-white shadow-sm shadow-teal-700/25">
            H
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-900">
              HANOL
            </p>
            <p className="text-xs text-slate-500">통합 관리자</p>
          </div>
        </a>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="사이드 메뉴">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isNavActive(pathname, item.href);

          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-teal-50 text-teal-800"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  active ? "text-teal-700" : "text-slate-400",
                )}
                strokeWidth={1.75}
              />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="border-t border-slate-200/80 p-4">
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium text-slate-500">학원</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">
            한올 위례캠퍼스
          </p>
          <p className="mt-1 text-xs text-slate-500">
            학생 · 출결 · 수납 · 4회 패키지
          </p>
        </div>
      </div>
    </aside>
  );
}
