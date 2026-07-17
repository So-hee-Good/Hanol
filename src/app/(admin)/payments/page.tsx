import Link from "next/link";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { RegistrationGuide } from "@/components/RegistrationGuide";
import { RenewPackageButton } from "@/components/RenewPackageButton";
import { SessionProgress } from "@/components/SessionProgress";
import { formatDate } from "@/lib/cn";
import { DEFAULT_PACKAGE_SESSIONS } from "@/lib/constants";
import { listStudents, listStudentsNeedingPayment } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const [students, needingPayment] = await Promise.all([
    listStudents(),
    listStudentsNeedingPayment(),
  ]);

  const active = students.filter((student) => !student.needsPayment);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          수납 · 패키지 등록
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
          월 납부가 아닙니다. 수업 횟수 패키지(기본 4회)를 등록하면 학생·출결
          화면의 잔여 횟수가 바로 갱신됩니다.
        </p>
      </div>

      <RegistrationGuide students={needingPayment} />

      {needingPayment.length > 0 ? (
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            바로 재등록
          </h3>
          {needingPayment.map((student) => {
            const used = student.package?.usedSessions ?? 0;
            const total =
              student.package?.totalSessions ?? DEFAULT_PACKAGE_SESSIONS;

            return (
              <article
                key={student.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/students/${student.id}`}
                      className="text-lg font-semibold text-slate-900 hover:text-teal-800"
                    >
                      {student.name}
                    </Link>
                    <PaymentStatusBadge needsPayment />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {student.school || "학교 미입력"} ·{" "}
                    {student.parentPhone || student.phone || "연락처 없음"}
                  </p>
                  <div className="mt-3">
                    <SessionProgress
                      usedSessions={used}
                      totalSessions={total}
                      size="sm"
                    />
                  </div>
                </div>
                <RenewPackageButton studentId={student.id} />
              </article>
            );
          })}
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          이용 중 패키지
        </h3>
        <ul className="mt-4 divide-y divide-slate-100">
          {active.map((student) => {
            const used = student.package?.usedSessions ?? 0;
            const total =
              student.package?.totalSessions ?? DEFAULT_PACKAGE_SESSIONS;

            return (
              <li
                key={student.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <Link
                    href={`/students/${student.id}`}
                    className="font-semibold text-slate-900 hover:text-teal-800"
                  >
                    {student.name}
                  </Link>
                  <p className="text-xs text-slate-500">
                    구매일{" "}
                    {student.package
                      ? formatDate(student.package.purchasedAt)
                      : "-"}
                  </p>
                </div>
                <SessionProgress
                  usedSessions={used}
                  totalSessions={total}
                  size="sm"
                />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
