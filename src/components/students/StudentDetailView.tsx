import Link from "next/link";
import { InfoRow, StudentCard } from "@/components/students/StudentCard";
import { StudentTimeline } from "@/components/students/StudentTimeline";
import { AttendanceForm } from "@/components/AttendanceForm";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { RenewPackageButton } from "@/components/RenewPackageButton";
import { SessionProgress } from "@/components/SessionProgress";
import { formatDate } from "@/lib/cn";
import { DEFAULT_PACKAGE_SESSIONS } from "@/lib/constants";
import {
  getStudentStatusLabel,
  type StudentWithPackage,
  type TimelineEvent,
} from "@/lib/types";

export function StudentDetailView({
  student,
  timeline,
}: {
  student: StudentWithPackage;
  timeline: TimelineEvent[];
}) {
  const used = student.package?.usedSessions ?? 0;
  const total = student.package?.totalSessions ?? DEFAULT_PACKAGE_SESSIONS;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/students"
            className="mb-3 inline-flex text-sm font-medium text-slate-500 transition hover:text-teal-800"
          >
            ← 학생 목록
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {student.name}
            </h2>
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
              {getStudentStatusLabel(student.status)}
            </span>
            <PaymentStatusBadge needsPayment={student.needsPayment} />
          </div>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            {student.school || "학교 미입력"} · {student.grade || "-"} ·{" "}
            {student.course || "-"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-slate-400">등록일</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">
            {formatDate(student.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <StudentCard
            title="학생정보"
            description="기본 연락처와 학적 정보를 확인합니다."
          >
            <dl>
              <InfoRow label="학생 연락처" value={student.phone || "미입력"} />
              <InfoRow
                label="학부모 연락처"
                value={
                  student.parentName || student.parentPhone
                    ? `${student.parentName || "학부모"} · ${student.parentPhone || "미입력"}`
                    : "미입력"
                }
              />
              <InfoRow label="주소" value={student.address || "미입력"} />
              <InfoRow label="학교" value={student.school || "미입력"} />
              <InfoRow label="학년" value={student.grade || "미입력"} />
              <InfoRow label="수업" value={student.course || "미입력"} />
            </dl>
          </StudentCard>

          <StudentCard
            title="최근 타임라인"
            description="출석과 패키지 등록 기록을 시간순으로 확인합니다."
          >
            <StudentTimeline events={timeline} />
          </StudentCard>
        </div>

        <div className="space-y-5">
          <StudentCard
            title="수업 패키지"
            description={`기본 ${DEFAULT_PACKAGE_SESSIONS}회 · 출석 시 1회 자동 소모`}
          >
            <SessionProgress
              usedSessions={used}
              totalSessions={total}
              size="lg"
            />
            <p className="mt-3 text-sm text-slate-500">
              남은 수업{" "}
              <span className="font-semibold text-slate-800">
                {student.remainingSessions}회
              </span>
            </p>

            {student.needsPayment ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">
                  출석 {total}회 중 {used}회 — 결제 필요
                </p>
                <p className="mt-1 text-sm text-red-600/80">
                  대시보드 등록 안내에도 자동 표시됩니다.
                </p>
                <div className="mt-3">
                  <RenewPackageButton studentId={student.id} />
                </div>
              </div>
            ) : null}
          </StudentCard>

          <StudentCard
            title="출석 처리"
            description="출석하면 활성 패키지에서 수업 1회가 소모됩니다."
          >
            <AttendanceForm
              studentId={student.id}
              disabled={student.needsPayment}
            />
          </StudentCard>
        </div>
      </div>
    </div>
  );
}
