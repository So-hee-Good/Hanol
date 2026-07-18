"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { isNavActive, NAV_ITEMS } from "@/lib/nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 lg:hidden"
        aria-label="메뉴 열기"
      >
        <Menu className="h-4 w-4" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px]"
            aria-label="메뉴 닫기"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
              <a href="/" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold text-white">
                  H
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">HANOL</p>
                  <p className="text-xs text-slate-500">관리자</p>
                </div>
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 p-4">
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
                        : "text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}
