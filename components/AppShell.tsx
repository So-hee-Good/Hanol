"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const menu = [
  { href: "/", label: "대시보드", icon: "대" },
  { href: "/students", label: "학생", icon: "학" },
  { href: "/attendance", label: "출결", icon: "출" },
  { href: "/sms", label: "문자", icon: "문" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Link href="/" className="brand">
            한올
          </Link>
          <span className="brand-sub">국어학원</span>
        </div>

        <nav aria-label="주요 메뉴">
          {menu.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${active ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-note">
          <strong>횟수제 수강 관리</strong>
          <p>4회 출석 완료 시 등록 안내 대상이 자동 생성됩니다.</p>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-title">
            <strong>한올국어학원</strong>
            <span>운영 관리 시스템</span>
          </div>
          <div className="profile">
            <span>{new Date().toLocaleDateString("ko-KR")}</span>
            <span className="avatar">원</span>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
