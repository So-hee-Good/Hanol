export type StudentStatus =
  | "active"
  | "renewal_needed"
  | "paused"
  | "withdrawn";

export type AttendanceType = "present" | "absent" | "makeup";

export interface Student {
  id: string;
  name: string;
  phone: string;
  parentPhone: string;
  grade: string;
  memo: string;
  status: StudentStatus;
  remainingSessions: number;
  totalSessions: number;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  type: AttendanceType;
  deducted: boolean;
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

export interface AppData {
  students: Student[];
  attendance: AttendanceRecord[];
  payments: PaymentRecord[];
  smsHistory: SmsHistoryItem[];
}

export const STATUS_LABELS: Record<StudentStatus, string> = {
  active: "수강중",
  renewal_needed: "등록 안내 필요",
  paused: "휴원",
  withdrawn: "퇴원",
};

export const ATTENDANCE_LABELS: Record<AttendanceType, string> = {
  present: "출석",
  absent: "결석",
  makeup: "보강",
};

export const SESSION_LIMIT = 4;
