import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck2,
  CreditCard,
  MessageSquareText,
  Send,
} from "lucide-react";
import { StudentCard, InfoRow } from "@/components/students/StudentCard";
import { StudentProgress } from "@/components/students/StudentProgress";
import { StudentTimeline } from "@/components/students/StudentTimeline";
import { cn } from "@/lib/cn";
import { getStudentStatusLabel, type Student } from "@/types/student";

interface StudentDetailProps {
  student: Student;
}

export function StudentDetail({ student }: StudentDetailProps) {
  const statusLabel = getStudentStatusLabel(student.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/students"
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            학생 목록
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {student.name}
            </h2>
            <span
              className={cn(
                "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                student.status === "active"
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                  : "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
              )}
            >
              {statusLabel}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            {student.school} · {student.grade} · {student.course}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm shadow-slate-200/40">
          <p className="text-xs font-medium text-slate-400">등록일</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">
            {student.enrolledAt}
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
              <InfoRow
                label="학생 연락처"
                value={student.contact.studentPhone}
              />
              <InfoRow
                label="학부모 연락처"
                value={`${student.parentName} · ${student.contact.parentPhone}`}
              />
              <InfoRow label="주소" value={student.contact.address} />
              <InfoRow label="학교" value={student.school} />
              <InfoRow label="학년" value={student.grade} />
            </dl>
          </StudentCard>

          <StudentCard
            title="최근 타임라인"
            description="출석, 수납, 상담, 메모를 시간순으로 확인합니다."
          >
            <StudentTimeline events={student.timeline} />
          </StudentCard>
        </div>

        <div className="space-y-5">
          <StudentCard
            title="수업권"
            description="잔여 회차와 진행 상태를 한눈에 봅니다."
          >
            <StudentProgress lessonPackage={student.lessonPackage} />
          </StudentCard>

          <StudentCard
            title="Quick Actions"
            description="자주 쓰는 업무를 바로 실행합니다."
          >
            <div className="grid grid-cols-2 gap-3">
              <QuickAction
                icon={CalendarCheck2}
                label="출석하기"
                tone="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              />
              <QuickAction
                icon={CreditCard}
                label="수납하기"
                tone="bg-blue-50 text-blue-700 hover:bg-blue-100"
              />
              <QuickAction
                icon={Send}
                label="문자보내기"
                tone="bg-sky-50 text-sky-700 hover:bg-sky-100"
              />
              <QuickAction
                icon={MessageSquareText}
                label="상담기록"
                tone="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              />
            </div>
          </StudentCard>
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: typeof CalendarCheck2;
  label: string;
  tone: string;
}

function QuickAction({ icon: Icon, label, tone }: QuickActionProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-col items-start gap-3 rounded-2xl px-4 py-4 text-left transition",
        tone,
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}
