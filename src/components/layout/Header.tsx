"use client";

import { Bell } from "lucide-react";
import { MobileNav } from "@/components/layout/MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div>
          <p className="text-sm font-semibold text-slate-900">한올 관리자</p>
          <p className="text-xs text-slate-500">
            학생 관리 · 수업 횟수 패키지
          </p>
        </div>
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
    </header>
  );
}
