import { DEFAULT_PACKAGE_SESSIONS, PACKAGE_STATUS } from "./constants";
import type { StoreData } from "./types";

/** 수업 횟수 기준 시드 데이터. 월 납부/등록금 필드 없음. */
export function createSeedData(): StoreData {
  const now = new Date("2026-07-16T09:00:00.000Z");

  const students = [
    {
      id: "stu_01",
      name: "김서연",
      phone: "010-1234-5678",
      grade: "초3",
      note: "기본 4회 패키지 이용 중",
      createdAt: iso(now, -20),
    },
    {
      id: "stu_02",
      name: "박민준",
      phone: "010-2345-6789",
      grade: "초5",
      note: "",
      createdAt: iso(now, -18),
    },
    {
      id: "stu_03",
      name: "이하은",
      phone: "010-3456-7890",
      grade: "중1",
      note: "4회 소진 — 재등록 필요",
      createdAt: iso(now, -30),
    },
    {
      id: "stu_04",
      name: "최지우",
      phone: "010-4567-8901",
      grade: "초4",
      note: "",
      createdAt: iso(now, -12),
    },
    {
      id: "stu_05",
      name: "정우진",
      phone: "010-5678-9012",
      grade: "중2",
      note: "신규 등록",
      createdAt: iso(now, -2),
    },
    {
      id: "stu_06",
      name: "한예린",
      phone: "010-6789-0123",
      grade: "초6",
      note: "",
      createdAt: iso(now, -25),
    },
  ];

  const packages = [
    pkg("pkg_01", "stu_01", 3, PACKAGE_STATUS.ACTIVE, iso(now, -14)),
    pkg("pkg_02", "stu_02", 1, PACKAGE_STATUS.ACTIVE, iso(now, -10)),
    pkg(
      "pkg_03",
      "stu_03",
      DEFAULT_PACKAGE_SESSIONS,
      PACKAGE_STATUS.PAYMENT_REQUIRED,
      iso(now, -28),
    ),
    pkg("pkg_04", "stu_04", 2, PACKAGE_STATUS.ACTIVE, iso(now, -9)),
    pkg("pkg_05", "stu_05", 0, PACKAGE_STATUS.ACTIVE, iso(now, -2)),
    pkg(
      "pkg_06",
      "stu_06",
      DEFAULT_PACKAGE_SESSIONS,
      PACKAGE_STATUS.PAYMENT_REQUIRED,
      iso(now, -22),
    ),
  ];

  const attendances = [
    att("att_01", "stu_01", "pkg_01", iso(now, -12), "정규 수업"),
    att("att_02", "stu_01", "pkg_01", iso(now, -8), "정규 수업"),
    att("att_03", "stu_01", "pkg_01", iso(now, -3), "정규 수업"),
    att("att_04", "stu_02", "pkg_02", iso(now, -5), "정규 수업"),
    att("att_05", "stu_03", "pkg_03", iso(now, -20), "정규 수업"),
    att("att_06", "stu_03", "pkg_03", iso(now, -16), "정규 수업"),
    att("att_07", "stu_03", "pkg_03", iso(now, -11), "정규 수업"),
    att("att_08", "stu_03", "pkg_03", iso(now, -4), "정규 수업"),
    att("att_09", "stu_04", "pkg_04", iso(now, -7), "정규 수업"),
    att("att_10", "stu_04", "pkg_04", iso(now, -2), "정규 수업"),
    att("att_11", "stu_06", "pkg_06", iso(now, -18), "정규 수업"),
    att("att_12", "stu_06", "pkg_06", iso(now, -14), "정규 수업"),
    att("att_13", "stu_06", "pkg_06", iso(now, -9), "정규 수업"),
    att("att_14", "stu_06", "pkg_06", iso(now, -1), "정규 수업"),
  ];

  const payments = [
    {
      id: "pay_01",
      studentId: "stu_01",
      packageId: "pkg_01",
      sessionsGranted: DEFAULT_PACKAGE_SESSIONS,
      paidAt: iso(now, -14),
      note: "4회 수업 패키지",
    },
    {
      id: "pay_02",
      studentId: "stu_02",
      packageId: "pkg_02",
      sessionsGranted: DEFAULT_PACKAGE_SESSIONS,
      paidAt: iso(now, -10),
      note: "4회 수업 패키지",
    },
    {
      id: "pay_03",
      studentId: "stu_03",
      packageId: "pkg_03",
      sessionsGranted: DEFAULT_PACKAGE_SESSIONS,
      paidAt: iso(now, -28),
      note: "4회 수업 패키지",
    },
    {
      id: "pay_04",
      studentId: "stu_04",
      packageId: "pkg_04",
      sessionsGranted: DEFAULT_PACKAGE_SESSIONS,
      paidAt: iso(now, -9),
      note: "4회 수업 패키지",
    },
    {
      id: "pay_05",
      studentId: "stu_05",
      packageId: "pkg_05",
      sessionsGranted: DEFAULT_PACKAGE_SESSIONS,
      paidAt: iso(now, -2),
      note: "4회 수업 패키지",
    },
    {
      id: "pay_06",
      studentId: "stu_06",
      packageId: "pkg_06",
      sessionsGranted: DEFAULT_PACKAGE_SESSIONS,
      paidAt: iso(now, -22),
      note: "4회 수업 패키지",
    },
  ];

  return { students, packages, attendances, payments };
}

function pkg(
  id: string,
  studentId: string,
  usedSessions: number,
  status: (typeof PACKAGE_STATUS)[keyof typeof PACKAGE_STATUS],
  purchasedAt: string,
) {
  return {
    id,
    studentId,
    totalSessions: DEFAULT_PACKAGE_SESSIONS,
    usedSessions,
    status,
    purchasedAt,
  };
}

function att(
  id: string,
  studentId: string,
  packageId: string,
  attendedAt: string,
  note: string,
) {
  return {
    id,
    studentId,
    packageId,
    attendedAt,
    note,
    createdAt: attendedAt,
  };
}

function iso(base: Date, dayOffset: number): string {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + dayOffset);
  return d.toISOString();
}
