import {
  SESSION_LIMIT,
  needsRenewal,
  remainingSessions,
  type AttendanceRecord,
  type AttendanceType,
  type PaymentRecord,
  type Student,
  type StudentStatus,
} from "./types";

function nowIso(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function createStudent(input: {
  name: string;
  phone: string;
  parentPhone: string;
  grade: string;
  memo?: string;
}): Student {
  const ts = nowIso();
  return {
    id: newId("stu"),
    name: input.name.trim(),
    phone: input.phone.trim(),
    parentPhone: input.parentPhone.trim(),
    grade: input.grade.trim(),
    memo: (input.memo ?? "").trim(),
    status: "active",
    usedCount: 0,
    packageSize: SESSION_LIMIT,
    paymentStatus: "normal",
    lastPaymentAt: null,
    createdAt: ts,
    updatedAt: ts,
  };
}

export function updateStudent(
  student: Student,
  patch: Partial<
    Pick<Student, "name" | "phone" | "parentPhone" | "grade" | "memo" | "status">
  >
): Student {
  return {
    ...student,
    ...patch,
    name: patch.name?.trim() ?? student.name,
    phone: patch.phone?.trim() ?? student.phone,
    parentPhone: patch.parentPhone?.trim() ?? student.parentPhone,
    grade: patch.grade?.trim() ?? student.grade,
    memo: patch.memo?.trim() ?? student.memo,
    updatedAt: nowIso(),
  };
}

/** 출석/보강 시 usedCount 증가. packageSize 도달 시 paymentStatus = due */
export function applyAttendance(
  student: Student,
  type: AttendanceType,
  date: string,
  note = ""
): { student: Student; record: AttendanceRecord } {
  const counted =
    (type === "present" || type === "makeup") &&
    student.status !== "withdrawn" &&
    student.usedCount < student.packageSize;

  let next = student;
  if (counted) {
    const nextUsed = Math.min(student.usedCount + 1, student.packageSize);
    next = {
      ...student,
      usedCount: nextUsed,
      paymentStatus:
        nextUsed >= student.packageSize ? "due" : student.paymentStatus,
      updatedAt: nowIso(),
    };
  }

  const record: AttendanceRecord = {
    id: newId("att"),
    studentId: student.id,
    studentName: student.name,
    date,
    type,
    counted,
    note: note.trim(),
    createdAt: nowIso(),
  };

  return { student: next, record };
}

/** 수납 완료 후 새 4회권 자동 시작 */
export function completePayment(
  student: Student,
  amount: number,
  note = ""
): { student: Student; payment: PaymentRecord } {
  const paidAt = nowIso();

  const payment: PaymentRecord = {
    id: newId("pay"),
    studentId: student.id,
    studentName: student.name,
    amount,
    paidAt,
    note: note.trim(),
  };

  const nextStudent: Student = {
    ...student,
    usedCount: 0,
    packageSize: SESSION_LIMIT,
    paymentStatus: "normal",
    lastPaymentAt: payment.paidAt,
    status: student.status === "withdrawn" ? "withdrawn" : "active",
    updatedAt: paidAt,
  };

  return { student: nextStudent, payment };
}

export type StudentListFilter = StudentStatus | "renewal_needed" | "all";

export function filterStudents(
  students: Student[],
  query: string,
  status: StudentListFilter
): Student[] {
  const q = query.trim().toLowerCase();
  return students.filter((s) => {
    const statusOk =
      status === "all" ||
      (status === "renewal_needed" ? needsRenewal(s) : s.status === status);
    if (!statusOk) return false;
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      s.parentPhone.includes(q) ||
      s.grade.toLowerCase().includes(q)
    );
  });
}

export function dashboardStats(
  students: Student[],
  attendance: AttendanceRecord[]
) {
  const today = new Date().toISOString().slice(0, 10);
  return {
    total: students.length,
    active: students.filter((s) => s.status === "active" && !needsRenewal(s))
      .length,
    renewalNeeded: students.filter((s) => needsRenewal(s)).length,
    paused: students.filter((s) => s.status === "paused").length,
    todayAttendance: attendance.filter((a) => a.date === today).length,
    lowSessions: students.filter(
      (s) =>
        s.status === "active" &&
        !needsRenewal(s) &&
        remainingSessions(s) <= 1
    ).length,
  };
}

export { remainingSessions, needsRenewal };
