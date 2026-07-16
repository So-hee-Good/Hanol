import type { PACKAGE_STATUS } from "./constants";

export type PackageStatus =
  (typeof PACKAGE_STATUS)[keyof typeof PACKAGE_STATUS];

export type Student = {
  id: string;
  name: string;
  phone: string;
  grade: string;
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
