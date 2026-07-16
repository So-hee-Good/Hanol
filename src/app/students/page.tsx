import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { SessionProgress } from "@/components/SessionProgress";
import { DEFAULT_PACKAGE_SESSIONS } from "@/lib/constants";
import { listStudents } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const students = await listStudents();

  return (
    <AppShell
      title="학생 목록"
      subtitle="각 학생은 수업 횟수 패키지를 기준으로 관리됩니다. 월별 등록금 계산은 사용하지 않습니다."
      actions={
        <Link
          href="/students/new"
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
        >
          새 학생 등록
        </Link>
      }
    >
      <div className="grid gap-3">
        {students.map((student) => {
          const used = student.package?.usedSessions ?? 0;
          const total =
            student.package?.totalSessions ?? DEFAULT_PACKAGE_SESSIONS;

          return (
            <Link
              key={student.id}
              href={`/students/${student.id}`}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-white/85 px-5 py-4 transition hover:border-[var(--accent)]/50 hover:shadow-sm"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">{student.name}</h2>
                  <PaymentStatusBadge needsPayment={student.needsPayment} />
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {student.grade || "학년 미입력"} ·{" "}
                  {student.phone || "연락처 없음"}
                </p>
              </div>
              <SessionProgress usedSessions={used} totalSessions={total} />
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
