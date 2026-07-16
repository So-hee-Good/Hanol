"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/students", label: "학생 관리", icon: Users },
  { href: "/attendance", label: "출결", icon: CalendarDays },
  { href: "/payments", label: "수납", icon: CreditCard },
  { href: "/consultations", label: "상담", icon: MessageSquareText },
  { href: "/settings", label: "설정", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200/80 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm shadow-blue-600/25">
          H
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-slate-900">
            HANOL
          </p>
          <p className="text-xs text-slate-500">관리자</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-blue-600" : "text-slate-400",
                )}
                strokeWidth={1.75}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200/80 p-4">
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium text-slate-500">학원</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">
            한올 위례캠퍼스
          </p>
        </div>
      </div>
    </aside>
  );
}
