import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { DEFAULT_PACKAGE_SESSIONS } from "./constants";
import { createSeedData } from "./seed";
import {
  applyAttendanceToPackage,
  createFreshPackage,
  getRemainingSessions,
  isPaymentRequired,
} from "./session-package";
import type {
  Attendance,
  Payment,
  SessionPackage,
  StoreData,
  Student,
  StudentWithPackage,
} from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

async function ensureStore(): Promise<StoreData> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as StoreData;
  } catch {
    const seed = createSeedData();
    await persist(seed);
    return seed;
  }
}

async function persist(data: StoreData): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
}

function getActivePackage(
  data: StoreData,
  studentId: string,
): SessionPackage | null {
  const packages = data.packages
    .filter((pkg) => pkg.studentId === studentId)
    .sort(
      (a, b) =>
        new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime(),
    );
  return packages[0] ?? null;
}

function toStudentWithPackage(
  student: Student,
  pkg: SessionPackage | null,
): StudentWithPackage {
  return {
    ...student,
    package: pkg,
    remainingSessions: pkg ? getRemainingSessions(pkg) : 0,
    needsPayment: pkg ? isPaymentRequired(pkg) : true,
  };
}

export async function listStudents(): Promise<StudentWithPackage[]> {
  const data = await ensureStore();
  return data.students
    .map((student) =>
      toStudentWithPackage(student, getActivePackage(data, student.id)),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "ko"));
}

export async function listStudentsNeedingPayment(): Promise<
  StudentWithPackage[]
> {
  const students = await listStudents();
  return students.filter((student) => student.needsPayment);
}

export async function getStudent(
  studentId: string,
): Promise<StudentWithPackage | null> {
  const data = await ensureStore();
  const student = data.students.find((item) => item.id === studentId);
  if (!student) return null;
  return toStudentWithPackage(student, getActivePackage(data, studentId));
}

export async function listAttendancesForStudent(
  studentId: string,
): Promise<Attendance[]> {
  const data = await ensureStore();
  return data.attendances
    .filter((item) => item.studentId === studentId)
    .sort(
      (a, b) =>
        new Date(b.attendedAt).getTime() - new Date(a.attendedAt).getTime(),
    );
}

export async function listPaymentsForStudent(
  studentId: string,
): Promise<Payment[]> {
  const data = await ensureStore();
  return data.payments
    .filter((item) => item.studentId === studentId)
    .sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime(),
    );
}

export async function createStudent(input: {
  name: string;
  phone: string;
  grade: string;
  note?: string;
}): Promise<StudentWithPackage> {
  const data = await ensureStore();
  const now = new Date().toISOString();
  const student: Student = {
    id: `stu_${randomUUID().slice(0, 8)}`,
    name: input.name.trim(),
    phone: input.phone.trim(),
    grade: input.grade.trim(),
    note: input.note?.trim() ?? "",
    createdAt: now,
  };

  const pkg = createFreshPackage({
    id: `pkg_${randomUUID().slice(0, 8)}`,
    studentId: student.id,
    purchasedAt: now,
  });

  const payment: Payment = {
    id: `pay_${randomUUID().slice(0, 8)}`,
    studentId: student.id,
    packageId: pkg.id,
    sessionsGranted: DEFAULT_PACKAGE_SESSIONS,
    paidAt: now,
    note: `${DEFAULT_PACKAGE_SESSIONS}회 수업 패키지`,
  };

  data.students.push(student);
  data.packages.push(pkg);
  data.payments.push(payment);
  await persist(data);

  return toStudentWithPackage(student, pkg);
}

/**
 * 출석 기록 시 활성 패키지에서 수업 1회를 자동 소모.
 * 4/4가 되면 결제 필요 상태로 전환.
 */
export async function recordAttendance(input: {
  studentId: string;
  note?: string;
  attendedAt?: string;
}): Promise<{ student: StudentWithPackage; attendance: Attendance }> {
  const data = await ensureStore();
  const student = data.students.find((item) => item.id === input.studentId);
  if (!student) {
    throw new Error("학생을 찾을 수 없습니다.");
  }

  const pkg = getActivePackage(data, input.studentId);
  if (!pkg) {
    throw new Error("활성 수업 패키지가 없습니다. 먼저 등록(결제)하세요.");
  }
  if (isPaymentRequired(pkg)) {
    throw new Error(
      "수업 횟수를 모두 사용했습니다. 결제 후 새 패키지를 등록하세요.",
    );
  }

  const attendedAt = input.attendedAt ?? new Date().toISOString();
  const updated = applyAttendanceToPackage(pkg);
  const index = data.packages.findIndex((item) => item.id === pkg.id);
  data.packages[index] = updated;

  const attendance: Attendance = {
    id: `att_${randomUUID().slice(0, 8)}`,
    studentId: student.id,
    packageId: pkg.id,
    attendedAt,
    note: input.note?.trim() || "정규 수업",
    createdAt: new Date().toISOString(),
  };
  data.attendances.push(attendance);
  await persist(data);

  return {
    student: toStudentWithPackage(student, updated),
    attendance,
  };
}

/** 결제 완료 시 새 4회 수업 패키지를 발급. 월별 등록금 계산 없음. */
export async function renewPackage(input: {
  studentId: string;
  note?: string;
}): Promise<StudentWithPackage> {
  const data = await ensureStore();
  const student = data.students.find((item) => item.id === input.studentId);
  if (!student) {
    throw new Error("학생을 찾을 수 없습니다.");
  }

  const now = new Date().toISOString();
  const pkg = createFreshPackage({
    id: `pkg_${randomUUID().slice(0, 8)}`,
    studentId: student.id,
    purchasedAt: now,
  });

  const payment: Payment = {
    id: `pay_${randomUUID().slice(0, 8)}`,
    studentId: student.id,
    packageId: pkg.id,
    sessionsGranted: DEFAULT_PACKAGE_SESSIONS,
    paidAt: now,
    note: input.note?.trim() || `${DEFAULT_PACKAGE_SESSIONS}회 수업 패키지`,
  };

  data.packages.push(pkg);
  data.payments.push(payment);
  await persist(data);

  return toStudentWithPackage(student, pkg);
}

export async function resetStore(): Promise<void> {
  const seed = createSeedData();
  await persist(seed);
}
