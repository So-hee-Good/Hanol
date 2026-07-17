import { DEFAULT_PACKAGE_SESSIONS, PACKAGE_STATUS } from "./constants";
import type { StoreData } from "./types";

/** 수업 횟수 기준 시드. 기본 패키지는 항상 4회. */
export function createSeedData(): StoreData {
  const now = new Date("2026-07-16T09:00:00.000Z");

  const students = [
    student({
      id: "stu_01",
      name: "김서연",
      phone: "010-2341-8890",
      parentName: "김민수",
      parentPhone: "010-5211-3344",
      school: "위례중학교",
      grade: "중2",
      course: "수학 심화반",
      address: "경기도 성남시 수정구 위례광장로 320",
      note: "기본 4회 패키지 이용 중",
      createdAt: iso(now, -20),
    }),
    student({
      id: "stu_02",
      name: "박민준",
      phone: "010-7782-1045",
      parentName: "박현정",
      parentPhone: "010-3120-9981",
      school: "세곡중학교",
      grade: "중3",
      course: "영어 정규반",
      address: "서울특별시 강남구 세곡동 547-8",
      note: "",
      createdAt: iso(now, -18),
    }),
    student({
      id: "stu_03",
      name: "이하은",
      phone: "010-4501-6722",
      parentName: "이성훈",
      parentPhone: "010-8804-2210",
      school: "복정고등학교",
      grade: "중1",
      course: "수학 정규반",
      address: "경기도 성남시 수정구 복정로 112",
      note: "4회 소진 — 재등록 필요",
      createdAt: iso(now, -30),
    }),
    student({
      id: "stu_04",
      name: "최지우",
      phone: "010-9012-3345",
      parentName: "최미영",
      parentPhone: "010-6677-1200",
      school: "위례중학교",
      grade: "초6",
      course: "종합 관리반",
      address: "경기도 성남시 수정구 위례동로 88",
      note: "",
      createdAt: iso(now, -12),
    }),
    student({
      id: "stu_05",
      name: "정우진",
      phone: "010-2200-7811",
      parentName: "정하나",
      parentPhone: "010-4410-9090",
      school: "위례고등학교",
      grade: "중2",
      course: "국어 독해반",
      address: "경기도 성남시 수정구 창곡동 501",
      note: "신규 등록",
      createdAt: iso(now, -2),
    }),
    student({
      id: "stu_06",
      name: "한예린",
      phone: "010-5566-7788",
      parentName: "한지훈",
      parentPhone: "010-9988-1122",
      school: "세곡중학교",
      grade: "초5",
      course: "영어 회화반",
      address: "서울특별시 강남구 자곡로 140",
      note: "",
      createdAt: iso(now, -25),
      status: "paused",
    }),
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

  const payments = packages.map((item, index) => ({
    id: `pay_0${index + 1}`,
    studentId: item.studentId,
    packageId: item.id,
    sessionsGranted: DEFAULT_PACKAGE_SESSIONS,
    paidAt: item.purchasedAt,
    note: `${DEFAULT_PACKAGE_SESSIONS}회 수업 패키지`,
  }));

  return { students, packages, attendances, payments };
}

function student(input: {
  id: string;
  name: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  school: string;
  grade: string;
  course: string;
  address: string;
  note: string;
  createdAt: string;
  status?: "active" | "paused";
}) {
  return {
    ...input,
    status: input.status ?? ("active" as const),
  };
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
