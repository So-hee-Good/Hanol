"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { SessionProgress } from "@/components/SessionProgress";
import { cn } from "@/lib/cn";
import { DEFAULT_PACKAGE_SESSIONS } from "@/lib/constants";
import {
  getStudentStatusLabel,
  type StudentWithPackage,
} from "@/lib/types";

export function StudentTable({
  students,
}: {
  students: StudentWithPackage[];
}) {
  if (students.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm shadow-slate-200/40">
        <p className="text-base font-medium text-slate-800">
          조건에 맞는 학생이 없습니다
        </p>
        <p className="mt-1 text-sm text-slate-500">
          검색어나 필터를 변경해 다시 확인해 주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th className="px-5 py-3.5 whitespace-nowrap">학생명</th>
              <th className="px-5 py-3.5 whitespace-nowrap">학교</th>
              <th className="px-5 py-3.5 whitespace-nowrap">학년</th>
              <th className="px-5 py-3.5 whitespace-nowrap">수업</th>
              <th className="px-5 py-3.5 whitespace-nowrap">수업 진행</th>
              <th className="px-5 py-3.5 whitespace-nowrap">패키지</th>
              <th className="px-5 py-3.5 whitespace-nowrap">상태</th>
              <th className="px-5 py-3.5 whitespace-nowrap">행동</th>
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
                  className="border-b border-slate-100 last:border-b-0 transition hover:bg-teal-50/40"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/students/${student.id}`}
                      className="group inline-flex items-center gap-2 font-semibold text-slate-900"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-800">
                        {student.name.slice(0, 1)}
                      </span>
                      <span className="group-hover:text-teal-800">
                        {student.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-sm whitespace-nowrap text-slate-600">
                    {student.school || "-"}
                  </td>
                  <td className="px-5 py-4 text-sm whitespace-nowrap text-slate-600">
                    {student.grade || "-"}
                  </td>
                  <td className="px-5 py-4 text-sm whitespace-nowrap text-slate-600">
                    {student.course || "-"}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <SessionProgress
                      usedSessions={used}
                      totalSessions={total}
                      size="sm"
                    />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <PaymentStatusBadge needsPayment={student.needsPayment} />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Link
                      href={`/students/${student.id}`}
                      className="inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-sm font-medium text-teal-800 transition hover:bg-teal-50"
                    >
                      상세
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden">
        {students.map((student) => {
          const used = student.package?.usedSessions ?? 0;
          const total =
            student.package?.totalSessions ?? DEFAULT_PACKAGE_SESSIONS;

          return (
            <Link
              key={student.id}
              href={`/students/${student.id}`}
              className="flex items-center justify-between gap-3 px-4 py-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900">{student.name}</p>
                  <PaymentStatusBadge needsPayment={student.needsPayment} />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {student.school || "학교 미입력"} · {student.grade || "-"}
                </p>
                <div className="mt-2">
                  <SessionProgress
                    usedSessions={used}
                    totalSessions={total}
                    size="sm"
                  />
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "active" | "paused" }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "active"
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
      )}
    >
      {getStudentStatusLabel(status)}
    </span>
  );
}
