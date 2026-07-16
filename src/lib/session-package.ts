import { DEFAULT_PACKAGE_SESSIONS, PACKAGE_STATUS } from "./constants";
import type { SessionPackage } from "./types";

/** 출석으로 소모된 칸을 ■, 남은 칸을 □ 로 표시. 예: ■■■□ */
export function formatSessionBlocks(
  usedSessions: number,
  totalSessions: number = DEFAULT_PACKAGE_SESSIONS,
): string {
  const used = clamp(usedSessions, 0, totalSessions);
  return "■".repeat(used) + "□".repeat(totalSessions - used);
}

/** 예: ■■■□ 3 / 4 */
export function formatSessionProgress(
  usedSessions: number,
  totalSessions: number = DEFAULT_PACKAGE_SESSIONS,
): string {
  const used = clamp(usedSessions, 0, totalSessions);
  return `${formatSessionBlocks(used, totalSessions)} ${used} / ${totalSessions}`;
}

export function getRemainingSessions(pkg: SessionPackage): number {
  return Math.max(0, pkg.totalSessions - pkg.usedSessions);
}

export function isPaymentRequired(pkg: SessionPackage): boolean {
  return (
    pkg.status === PACKAGE_STATUS.PAYMENT_REQUIRED ||
    pkg.usedSessions >= pkg.totalSessions
  );
}

/**
 * 출석 1회 = 수업 1회 소모.
 * 패키지 횟수를 모두 쓰면 결제 필요로 전환.
 * 월별 등록금 계산은 사용하지 않음.
 */
export function applyAttendanceToPackage(
  pkg: SessionPackage,
): SessionPackage {
  if (pkg.usedSessions >= pkg.totalSessions) {
    return {
      ...pkg,
      status: PACKAGE_STATUS.PAYMENT_REQUIRED,
    };
  }

  const usedSessions = pkg.usedSessions + 1;
  const exhausted = usedSessions >= pkg.totalSessions;

  return {
    ...pkg,
    usedSessions,
    status: exhausted
      ? PACKAGE_STATUS.PAYMENT_REQUIRED
      : PACKAGE_STATUS.ACTIVE,
  };
}

export function createFreshPackage(input: {
  id: string;
  studentId: string;
  purchasedAt: string;
  totalSessions?: number;
}): SessionPackage {
  return {
    id: input.id,
    studentId: input.studentId,
    totalSessions: input.totalSessions ?? DEFAULT_PACKAGE_SESSIONS,
    usedSessions: 0,
    status: PACKAGE_STATUS.ACTIVE,
    purchasedAt: input.purchasedAt,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
