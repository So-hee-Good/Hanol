import Link from "next/link";
import { AttendanceForm } from "@/components/AttendanceForm";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { SessionProgress } from "@/components/SessionProgress";
import { formatDateTime } from "@/lib/cn";
import { DEFAULT_PACKAGE_SESSIONS } from "@/lib/constants";
import { listRecentAttendances, listStudents } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const [students, recent] = await Promise.all([
    listStudents(),
    listRecentAttendances(15),
  ]);

  const attendable = students.filter((student) => !student.needsPayment);
  const blocked = students.filter((student) => student.needsPayment);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          출결
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
          학생 관리와 같은 데이터를 사용합니다. 출석 1회마다 수업 패키지 1회가
          자동으로 소모됩니다.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            오늘 출석 처리
          </h3>
          {attendable.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
              출석 가능한 학생이 없습니다.{" "}
              <Link href="/payments" className="font-semibold text-teal-800">
                수납
              </Link>
              에서 패키지를 먼저 등록하세요.
            </div>
          ) : (
            attendable.map((student) => {
              const used = student.package?.usedSessions ?? 0;
              const total =
                student.package?.totalSessions ?? DEFAULT_PACKAGE_SESSIONS;

              return (
                <article
                  key={student.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/students/${student.id}`}
                        className="text-lg font-semibold text-slate-900 hover:text-teal-800"
                      >
                        {student.name}
                      </Link>
                      <p className="mt-1 text-sm text-slate-500">
                        {student.school || "학교 미입력"} ·{" "}
                        {student.course || "-"}
                      </p>
                    </div>
                    <SessionProgress
                      usedSessions={used}
                      totalSessions={total}
                      size="sm"
                    />
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <AttendanceForm studentId={student.id} />
                  </div>
                </article>
              );
            })
          )}

          {blocked.length > 0 ? (
            <div className="rounded-2xl border border-red-200 bg-red-50/70 p-5">
              <h4 className="text-sm font-semibold text-red-700">
                결제 필요로 출석 불가
              </h4>
              <ul className="mt-3 space-y-2">
                {blocked.map((student) => (
                  <li
                    key={student.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/students/${student.id}`}
                        className="font-medium text-slate-900 hover:text-teal-800"
                      >
                        {student.name}
                      </Link>
                      <PaymentStatusBadge needsPayment />
                    </div>
                    <Link
                      href="/payments"
                      className="text-sm font-semibold text-red-700 hover:underline"
                    >
                      수납으로 이동
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">
            최근 출석 기록
          </h3>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">기록이 없습니다.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {recent.map((item) => (
                <li key={item.id} className="py-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/students/${item.studentId}`}
                      className="font-semibold text-slate-900 hover:text-teal-800"
                    >
                      {item.studentName}
                    </Link>
                    <span className="text-xs text-slate-400">
                      {formatDateTime(item.attendedAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-slate-500">{item.note}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
