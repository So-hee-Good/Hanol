"use client";

import { Bell, Search } from "lucide-react";
import { MobileNav } from "@/components/layout/MobileNav";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "학생 관리" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
            HANOL Admin
          </p>
          <h1 className="text-base font-semibold text-slate-900">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="빠른 검색"
            className="h-10 w-56 rounded-xl border border-slate-200 bg-slate-50/80 pr-3 pl-9 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          aria-label="알림"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white py-1.5 pr-3 pl-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-semibold text-white">
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
