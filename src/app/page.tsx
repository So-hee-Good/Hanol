import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { RegistrationGuide } from "@/components/RegistrationGuide";
import { ResetDemoButton } from "@/components/ResetDemoButton";
import { SessionProgress } from "@/components/SessionProgress";
import { DEFAULT_PACKAGE_SESSIONS } from "@/lib/constants";
import { listStudents, listStudentsNeedingPayment } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [students, needingPayment] = await Promise.all([
    listStudents(),
    listStudentsNeedingPayment(),
  ]);

  const activeCount = students.filter((student) => !student.needsPayment).length;
  const remainingTotal = students.reduce(
    (sum, student) => sum + student.remainingSessions,
    0,
  );

  return (
    <AppShell
      title="수업 횟수 대시보드"
      subtitle="이 아카데미는 월 납부를 사용하지 않습니다. 학생은 기본 4회 수업 패키지를 구매하고, 출석마다 수업 1회가 자동으로 소모됩니다."
      actions={<ResetDemoButton />}
    >
      <div className="grid gap-6">
        <section className="grid gap-3 sm:grid-cols-3">
          <Stat label="전체 학생" value={`${students.length}명`} />
          <Stat label="이용 중" value={`${activeCount}명`} />
          <Stat
            label="남은 수업 합계"
            value={`${remainingTotal}회`}
            hint={`기본 패키지 ${DEFAULT_PACKAGE_SESSIONS}회`}
          />
        </section>

        <RegistrationGuide students={needingPayment} />

        <section className="rounded-2xl border border-[var(--line)] bg-white/80 p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">전체 학생 수업 현황</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                학생 상세에서는 항상 ■■■□ 3 / 4 형식으로 진행률을 확인합니다.
              </p>
            </div>
            <Link
              href="/students"
              className="text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              학생 목록 보기
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[var(--muted)]">
                <tr className="border-b border-[var(--line)]">
                  <th className="py-2 pr-4 font-medium">학생</th>
                  <th className="py-2 pr-4 font-medium">상태</th>
                  <th className="py-2 pr-4 font-medium">수업 진행</th>
                  <th className="py-2 font-medium">남은 횟수</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const used = student.package?.usedSessions ?? 0;
                  const total =
                    student.package?.totalSessions ?? DEFAULT_PACKAGE_SESSIONS;

                  return (
                    <tr
                      key={student.id}
                      className="border-b border-[var(--line)]/70 last:border-none"
                    >
                      <td className="py-3 pr-4">
                        <Link
                          href={`/students/${student.id}`}
                          className="font-semibold hover:text-[var(--accent)]"
                        >
                          {student.name}
                        </Link>
                        <p className="text-xs text-[var(--muted)]">
                          {student.grade || "학년 미입력"}
                        </p>
                      </td>
                      <td className="py-3 pr-4">
                        <PaymentStatusBadge needsPayment={student.needsPayment} />
                      </td>
                      <td className="py-3 pr-4">
                        <SessionProgress
                          usedSessions={used}
                          totalSessions={total}
                          size="sm"
                        />
                      </td>
                      <td className="py-3 tabular-nums text-[var(--muted)]">
                        {student.remainingSessions}회
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/80 px-5 py-4">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}
