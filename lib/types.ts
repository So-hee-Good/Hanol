export type StudentStatus = "active" | "paused" | "withdrawn";

export type PaymentStatus = "normal" | "due";

export type AttendanceType = "present" | "absent" | "makeup";

export type StudentListFilter = "all" | "active" | "one" | "due" | "paused";

export interface Student {
  id: string;
  name: string;
  studentPhone: string;
  parentName: string;
  parentPhone: string;
  school: string;
  grade: string;
  className: string;
  note: string;
  status: StudentStatus;
  usedCount: number;
  packageSize: number;
  tuition: number;
  paymentStatus: PaymentStatus;
  lastPaymentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  type: AttendanceType;
  counted: boolean;
  note: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  paidAt: string;
  note: string;
}

export type SmsTemplateKey =
  | "renewal"
  | "attendance"
  | "absent"
  | "custom";

export interface SmsHistoryItem {
  id: string;
  templateKey: SmsTemplateKey;
  templateLabel: string;
  body: string;
  recipients: { studentId: string; name: string; phone: string }[];
  sentAt: string;
  status: "queued";
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface AppData {
  students: Student[];
  attendance: AttendanceRecord[];
  payments: PaymentRecord[];
  messages: SmsHistoryItem[];
}

export const STATUS_LABELS: Record<StudentStatus, string> = {
  active: "재원",
  paused: "휴원",
  withdrawn: "퇴원",
};

export const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  normal: "수강 중",
  due: "등록 안내 필요",
};

export const ATTENDANCE_LABELS: Record<AttendanceType, string> = {
  present: "출석",
  absent: "결석",
  makeup: "보강",
};

export const GRADE_OPTIONS = [
  "초1",
  "초2",
  "초3",
  "초4",
  "초5",
  "초6",
  "중1",
  "중2",
  "중3",
  "고1",
  "고2",
  "고3",
] as const;

export const PACKAGE_OPTIONS = [4, 6, 8, 10, 12] as const;

export const SESSION_LIMIT = 4;

export function remainingSessions(student: Student): number {
  return Math.max(0, student.packageSize - student.usedCount);
}

export function needsRenewal(student: Student): boolean {
  return (
    student.paymentStatus === "due" || student.usedCount >= student.packageSize
  );
}
