import Link from "next/link";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { SessionProgress } from "@/components/SessionProgress";
import type { StudentWithPackage } from "@/lib/types";

type RegistrationGuideProps = {
  students: StudentWithPackage[];
};

/** 수업 4회를 모두 소진한 학생을 대시보드에 자동으로 안내 */
export function RegistrationGuide({ students }: RegistrationGuideProps) {
  if (students.length === 0) {
    return (
      <section className="rounded-2xl border border-[var(--line)] bg-white/80 p-6">
        <h2 className="text-lg font-semibold text-[var(--ink)]">등록 안내</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          현재 결제가 필요한 학생이 없습니다. 출석으로 수업 횟수가 소진되면 여기에
          자동으로 표시됩니다.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[var(--alert)]/25 bg-[var(--alert-soft)]/40 p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--ink)]">등록 안내</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            기본 패키지 4회를 모두 사용한 학생입니다. 새 수업 횟수를 등록해 주세요.
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[var(--alert)]">
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
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/70 bg-white px-4 py-3 transition hover:border-[var(--accent)]/40 hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--ink)]">
                      {student.name}
                    </span>
                    <PaymentStatusBadge needsPayment />
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {student.grade || "학년 미입력"} · {student.phone || "연락처 없음"}
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
