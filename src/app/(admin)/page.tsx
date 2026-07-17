import Link from "next/link";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { ResetDemoButton } from "@/components/ResetDemoButton";
import { SessionProgress } from "@/components/SessionProgress";
import { RegistrationGuide } from "@/components/RegistrationGuide";
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            대시보드
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            월 납부가 아닌 수업 횟수 패키지 기준입니다. 기본 4회, 출석마다 1회
            소모, 4/4면 결제 필요와 등록 안내가 자동으로 표시됩니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/students"
              className="rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            >
              학생 관리
            </Link>
            <Link
              href="/attendance"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              출결
            </Link>
            <Link
              href="/payments"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              수납
            </Link>
          </div>
        </div>
        <ResetDemoButton />
      </div>

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

      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              전체 학생 수업 현황
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              학생 상세에서는 항상 ■■■□ 3 / 4 형식으로 진행률을 확인합니다.
            </p>
          </div>
          <Link
            href="/students"
            className="text-sm font-semibold text-teal-800 hover:underline"
          >
            학생 목록 보기
          </Link>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr className="border-b border-slate-100">
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
                    className="border-b border-slate-100 last:border-none"
                  >
                    <td className="py-3 pr-4">
                      <Link
                        href={`/students/${student.id}`}
                        className="font-semibold text-slate-900 hover:text-teal-800"
                      >
                        {student.name}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {student.school || "학교 미입력"} ·{" "}
                        {student.grade || "-"}
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
                    <td className="py-3 tabular-nums text-slate-500">
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
    <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm shadow-slate-200/40">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}
