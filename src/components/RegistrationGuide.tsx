import Link from "next/link";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { SessionProgress } from "@/components/SessionProgress";
import type { StudentWithPackage } from "@/lib/types";

/** 수업 4회를 모두 소진한 학생을 대시보드에 자동으로 안내 */
export function RegistrationGuide({
  students,
}: {
  students: StudentWithPackage[];
}) {
  if (students.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">등록 안내</h3>
        <p className="mt-2 text-sm text-slate-500">
          현재 결제가 필요한 학생이 없습니다. 출석으로 수업 횟수가 소진되면
          여기에 자동으로 표시됩니다.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-red-200 bg-red-50/60 p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">등록 안내</h3>
          <p className="mt-1 text-sm text-slate-600">
            기본 패키지 4회를 모두 사용한 학생입니다. 새 수업 횟수를 등록해
            주세요.
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-red-700">
          {students.length}명
        </span>
      </div>

      <ul className="mt-5 space-y-3">
        {students.map((student) => {
          const used = student.package?.usedSessions ?? 0;
          const total = student.package?.totalSessions ?? 4;

          return (
            <li key={student.id}>
              <Link
                href={`/students/${student.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/70 bg-white px-4 py-3 transition hover:border-teal-300 hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {student.name}
                    </span>
                    <PaymentStatusBadge needsPayment />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {student.school || "학교 미입력"} ·{" "}
                    {student.grade || "-"} · {student.phone || "연락처 없음"}
                  </p>
                </div>
                <SessionProgress usedSessions={used} totalSessions={total} />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
