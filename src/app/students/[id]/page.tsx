import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AttendanceForm } from "@/components/AttendanceForm";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { RenewPackageButton } from "@/components/RenewPackageButton";
import { SessionProgress } from "@/components/SessionProgress";
import { DEFAULT_PACKAGE_SESSIONS } from "@/lib/constants";
import {
  getStudent,
  listAttendancesForStudent,
  listPaymentsForStudent,
} from "@/lib/store";

export const dynamic = "force-dynamic";

type StudentDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
  const { id } = await params;
  const student = await getStudent(id);
  if (!student) notFound();

  const [attendances, payments] = await Promise.all([
    listAttendancesForStudent(id),
    listPaymentsForStudent(id),
  ]);

  const used = student.package?.usedSessions ?? 0;
  const total = student.package?.totalSessions ?? DEFAULT_PACKAGE_SESSIONS;

  return (
    <AppShell
      title={student.name}
      subtitle="학생 상세의 수업 진행은 항상 횟수 블록으로 표시됩니다. 예: ■■■□ 3 / 4"
      actions={
        <Link
          href="/students"
          className="rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm font-medium"
        >
          목록으로
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-[var(--line)] bg-white/90 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold">수업 패키지</h2>
                <PaymentStatusBadge needsPayment={student.needsPayment} />
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">
                기본 패키지 {DEFAULT_PACKAGE_SESSIONS}회 · 출석 시 수업 1회 자동
                소모
              </p>
            </div>
            <SessionProgress
              usedSessions={used}
              totalSessions={total}
              size="lg"
            />
          </div>

          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <Info label="학년" value={student.grade || "미입력"} />
            <Info label="연락처" value={student.phone || "미입력"} />
            <Info
              label="남은 수업"
              value={`${student.remainingSessions}회`}
            />
            <Info
              label="패키지 구매일"
              value={
                student.package
                  ? formatDate(student.package.purchasedAt)
                  : "없음"
              }
            />
          </dl>

          {student.note ? (
            <p className="mt-4 rounded-xl bg-[var(--canvas)] px-4 py-3 text-sm text-[var(--muted)]">
              {student.note}
            </p>
          ) : null}

          {student.needsPayment ? (
            <div className="mt-6 rounded-xl border border-[var(--alert)]/30 bg-[var(--alert-soft)]/50 p-4">
              <p className="text-sm font-semibold text-[var(--alert)]">
                출석 {total}회 중 {used}회가 생성되어 결제가 필요합니다.
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                대시보드 등록 안내에도 자동으로 표시됩니다. 결제 후 새 4회
                패키지를 등록하세요.
              </p>
              <div className="mt-4">
                <RenewPackageButton studentId={student.id} />
              </div>
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white/90 p-6">
          <h2 className="text-lg font-semibold">출석 처리</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            출석을 기록하면 활성 패키지에서 수업 1회가 소모됩니다.
          </p>
          <div className="mt-4">
            <AttendanceForm
              studentId={student.id}
              disabled={student.needsPayment}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white/90 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">출석 기록</h2>
          {attendances.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">
              아직 출석 기록이 없습니다.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[var(--line)]">
              {attendances.map((attendance) => (
                <li
                  key={attendance.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                >
                  <span className="font-medium">
                    {formatDate(attendance.attendedAt)}
                  </span>
                  <span className="text-[var(--muted)]">{attendance.note}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white/90 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">패키지 결제 기록</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            결제는 수업 횟수 패키지 단위입니다. 월별 등록금 항목은 없습니다.
          </p>
          <ul className="mt-4 divide-y divide-[var(--line)]">
            {payments.map((payment) => (
              <li
                key={payment.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
              >
                <span className="font-medium">{formatDate(payment.paidAt)}</span>
                <span className="text-[var(--muted)]">
                  {payment.sessionsGranted}회 · {payment.note}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--canvas)] px-4 py-3">
      <dt className="text-xs text-[var(--muted)]">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
