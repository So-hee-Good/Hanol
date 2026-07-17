import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Settings,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/** 하나의 관리자 프로그램에서 쓰는 공통 메뉴 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/students", label: "학생", icon: Users },
  { href: "/attendance", label: "출결", icon: CalendarDays },
  { href: "/payments", label: "수납", icon: CreditCard },
  { href: "/students/new", label: "등록", icon: UserPlus },
  { href: "/settings", label: "설정", icon: Settings },
];

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/students") {
    return (
      pathname === "/students" ||
      (pathname.startsWith("/students/") &&
        !pathname.startsWith("/students/new"))
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
