import {
  ATTENDANCE_LABELS,
  SESSION_LIMIT,
  needsRenewal,
  remainingSessions,
  type ActivityItem,
  type AppData,
  type AttendanceRecord,
  type AttendanceType,
  type PaymentRecord,
  type Student,
  type StudentListFilter,
  type StudentStatus,
} from "./types";

function nowIso(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export type StudentInput = {
  name: string;
  studentPhone?: string;
  parentName?: string;
  parentPhone?: string;
  school?: string;
  grade?: string;
  className?: string;
  note?: string;
  packageSize?: number;
  tuition?: number;
  status?: StudentStatus;
};

export function createStudent(input: StudentInput): Student {
  const ts = nowIso();
  const packageSize = input.packageSize ?? SESSION_LIMIT;
  return {
    id: newId("stu"),
    name: input.name.trim(),
    studentPhone: (input.studentPhone ?? "").trim(),
    parentName: (input.parentName ?? "").trim(),
    parentPhone: (input.parentPhone ?? "").trim(),
    school: (input.school ?? "").trim(),
    grade: (input.grade ?? "").trim(),
    className: (input.className ?? "").trim(),
    note: (input.note ?? "").trim(),
    status: input.status ?? "active",
    usedCount: 0,
    packageSize,
    tuition: input.tuition ?? 120000,
    paymentStatus: "normal",
    lastPaymentAt: null,
    createdAt: ts,
    updatedAt: ts,
  };
}

export function updateStudent(
  student: Student,
  patch: Partial<StudentInput>
): Student {
  return {
    ...student,
    name: patch.name?.trim() ?? student.name,
    studentPhone: patch.studentPhone?.trim() ?? student.studentPhone,
    parentName: patch.parentName?.trim() ?? student.parentName,
    parentPhone: patch.parentPhone?.trim() ?? student.parentPhone,
    school: patch.school?.trim() ?? student.school,
    grade: patch.grade?.trim() ?? student.grade,
    className: patch.className?.trim() ?? student.className,
    note: patch.note?.trim() ?? student.note,
    packageSize: patch.packageSize ?? student.packageSize,
    tuition: patch.tuition ?? student.tuition,
    status: patch.status ?? student.status,
    updatedAt: nowIso(),
  };
}

export function wouldCountAttendance(
  student: Student,
  status: AttendanceType
): boolean {
  return (
    (status === "present" || status === "makeup") &&
    student.status !== "withdrawn" &&
    student.usedCount < student.packageSize
  );
}

export function applyTicketDelta(
  student: Student,
  delta: number
): Student {
  const usedCount = Math.min(
    student.packageSize,
    Math.max(0, student.usedCount + delta)
  );
  return {
    ...student,
    usedCount,
    paymentStatus:
      usedCount >= student.packageSize
        ? "due"
        : usedCount < student.packageSize && student.paymentStatus === "due"
          ? "normal"
          : student.paymentStatus,
    updatedAt: nowIso(),
  };
}

/** 출석/보강 시 usedCount 증가. packageSize 도달 시 paymentStatus = due */
export function applyAttendance(
  student: Student,
  status: AttendanceType,
  date: string,
  note = ""
): { student: Student; record: AttendanceRecord } {
  const counted = wouldCountAttendance(student, status);
  const next = counted ? applyTicketDelta(student, 1) : student;

  const record: AttendanceRecord = {
    id: newId("att"),
    studentId: student.id,
    studentName: student.name,
    date,
    status,
    counted,
    note: note.trim(),
    createdAt: nowIso(),
  };

  return { student: next, record };
}

/** 수납 완료 후 새 4회권 자동 시작 */
export function completePayment(
  student: Student,
  amount?: number,
  note = ""
): { student: Student; payment: PaymentRecord } {
  const paidAt = nowIso();
  const paymentAmount = amount ?? student.tuition;

  const payment: PaymentRecord = {
    id: newId("pay"),
    studentId: student.id,
    studentName: student.name,
    amount: paymentAmount,
    paidAt,
    note: note.trim(),
  };

  const nextStudent: Student = {
    ...student,
    usedCount: 0,
    paymentStatus: "normal",
    lastPaymentAt: payment.paidAt,
    status: student.status === "withdrawn" ? "withdrawn" : "active",
    updatedAt: paidAt,
  };

  return { student: nextStudent, payment };
}

export function filterStudents(
  students: Student[],
  query: string,
  status: StudentListFilter
): Student[] {
  const q = query.trim().toLowerCase();
  return students.filter((s) => {
    const remaining = remainingSessions(s);
    const statusOk =
      status === "all" ||
      (status === "due"
        ? needsRenewal(s)
        : status === "one"
          ? !needsRenewal(s) && remaining === 1
          : status === "active"
            ? s.status === "active" && !needsRenewal(s)
            : s.status === status);
    if (!statusOk) return false;
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.school.toLowerCase().includes(q) ||
      s.className.toLowerCase().includes(q) ||
      s.grade.toLowerCase().includes(q) ||
      s.parentName.toLowerCase().includes(q) ||
      s.parentPhone.includes(q) ||
      s.studentPhone.includes(q)
    );
  });
}

export function recentActivity(data: AppData, limit = 8): ActivityItem[] {
  const attendanceItems: ActivityItem[] = data.attendance.map((a) => ({
    id: a.id,
    title: `${a.studentName} ${ATTENDANCE_LABELS[a.status]}`,
    description: a.counted
      ? `${a.date} · 회차 반영${a.note ? ` · ${a.note}` : ""}`
      : `${a.date} · 회차 미차감${a.note ? ` · ${a.note}` : ""}`,
    date: a.createdAt,
  }));

  const paymentItems: ActivityItem[] = data.payments.map((p) => ({
    id: p.id,
    title: `${p.studentName} 수납 완료`,
    description: `${p.amount.toLocaleString("ko-KR")}원 · 새 수업권 시작${
      p.note ? ` · ${p.note}` : ""
    }`,
    date: p.paidAt,
  }));

  return [...attendanceItems, ...paymentItems]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export type { StudentListFilter };
export { remainingSessions, needsRenewal };
