import type { PACKAGE_STATUS } from "./constants";

export type PackageStatus =
  (typeof PACKAGE_STATUS)[keyof typeof PACKAGE_STATUS];

export type StudentStatus = "active" | "paused";

export type Student = {
  id: string;
  name: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  school: string;
  grade: string;
  course: string;
  status: StudentStatus;
  address: string;
  note: string;
  createdAt: string;
};

/** 수업 횟수 패키지. 월별 등록금과 무관. */
export type SessionPackage = {
  id: string;
  studentId: string;
  totalSessions: number;
  usedSessions: number;
  status: PackageStatus;
  purchasedAt: string;
};

export type Attendance = {
  id: string;
  studentId: string;
  packageId: string;
  attendedAt: string;
  note: string;
  createdAt: string;
};

export type Payment = {
  id: string;
  studentId: string;
  packageId: string;
  sessionsGranted: number;
  paidAt: string;
  note: string;
};

export type TimelineEventType = "attendance" | "payment";

export type TimelineEvent = {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  occurredAt: string;
};

export type StoreData = {
  students: Student[];
  packages: SessionPackage[];
  attendances: Attendance[];
  payments: Payment[];
};

export type StudentWithPackage = Student & {
  package: SessionPackage | null;
  remainingSessions: number;
  needsPayment: boolean;
};

export type StudentFilters = {
  query: string;
  school: string | "all";
  grade: string | "all";
  course: string | "all";
};

export const SCHOOLS = [
  "위례중학교",
  "세곡중학교",
  "복정고등학교",
  "위례고등학교",
] as const;

export const GRADES = ["초3", "초4", "초5", "초6", "중1", "중2", "중3"] as const;

export const COURSES = [
  "수학 정규반",
  "수학 심화반",
  "영어 정규반",
  "영어 회화반",
  "국어 독해반",
  "종합 관리반",
] as const;

export function getStudentStatusLabel(
  status: StudentStatus,
): "재원생" | "휴원" {
  return status === "active" ? "재원생" : "휴원";
}
