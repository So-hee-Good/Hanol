import {
  SESSION_LIMIT,
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
    remainingSessions: SESSION_LIMIT,
    totalSessions: SESSION_LIMIT,
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

/** 출석/보강 시 4회권 차감. 0회가 되면 등록 안내 필요로 전환 */
export function applyAttendance(
  student: Student,
  type: AttendanceType,
  date: string,
  note = ""
): { student: Student; record: AttendanceRecord } {
  const shouldDeduct =
    (type === "present" || type === "makeup") &&
    student.status !== "withdrawn" &&
    student.remainingSessions > 0;

  let remaining = student.remainingSessions;
  let status: StudentStatus = student.status;

  if (shouldDeduct) {
    remaining = Math.max(0, remaining - 1);
    if (remaining === 0 && status === "active") {
      status = "renewal_needed";
    }
  }

  const nextStudent: Student = {
    ...student,
    remainingSessions: remaining,
    status,
    updatedAt: nowIso(),
  };

  const record: AttendanceRecord = {
    id: newId("att"),
    studentId: student.id,
    studentName: student.name,
    date,
    type,
    deducted: shouldDeduct,
    note: note.trim(),
    createdAt: nowIso(),
  };

  return { student: nextStudent, record };
}

/** 수납 완료 후 새 4회권 자동 시작 */
export function completePayment(
  student: Student,
  amount: number,
  note = ""
): { student: Student; payment: PaymentRecord } {
  const nextStudent: Student = {
    ...student,
    remainingSessions: SESSION_LIMIT,
    totalSessions: SESSION_LIMIT,
    status: student.status === "withdrawn" ? "withdrawn" : "active",
    updatedAt: nowIso(),
  };

  const payment: PaymentRecord = {
    id: newId("pay"),
    studentId: student.id,
    studentName: student.name,
    amount,
    paidAt: nowIso(),
    note: note.trim(),
  };

  return { student: nextStudent, payment };
}

export function filterStudents(
  students: Student[],
  query: string,
  status: StudentStatus | "all"
): Student[] {
  const q = query.trim().toLowerCase();
  return students.filter((s) => {
    const statusOk = status === "all" || s.status === status;
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

export function dashboardStats(students: Student[], attendance: AttendanceRecord[]) {
  const today = new Date().toISOString().slice(0, 10);
  return {
    total: students.length,
    active: students.filter((s) => s.status === "active").length,
    renewalNeeded: students.filter((s) => s.status === "renewal_needed").length,
    paused: students.filter((s) => s.status === "paused").length,
    todayAttendance: attendance.filter((a) => a.date === today).length,
    lowSessions: students.filter(
      (s) => s.status === "active" && s.remainingSessions <= 1
    ).length,
  };
}
