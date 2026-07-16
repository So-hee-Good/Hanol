"use client";

import Link from "next/link";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  getRemainingLessons,
  getStudentStatusLabel,
  type Student,
} from "@/types/student";

interface StudentTableProps {
  students: Student[];
}

export function StudentTable({ students }: StudentTableProps) {
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
              <th className="px-5 py-3.5 whitespace-nowrap">학생 연락처</th>
              <th className="px-5 py-3.5 whitespace-nowrap">학부모 연락처</th>
              <th className="px-5 py-3.5 whitespace-nowrap">남은 수업</th>
              <th className="px-5 py-3.5 whitespace-nowrap">상태</th>
              <th className="px-5 py-3.5 whitespace-nowrap">행동</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const remaining = getRemainingLessons(student.lessonPackage);

              return (
                <tr
                  key={student.id}
                  className="border-b border-slate-100 last:border-b-0 transition hover:bg-blue-50/40"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/students/${student.id}`}
                      className="group inline-flex items-center gap-2 font-semibold text-slate-900"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                        {student.name.slice(0, 1)}
                      </span>
                      <span className="group-hover:text-blue-700">
                        {student.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {student.school}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {student.grade}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {student.course}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {student.contact.studentPhone}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {student.contact.parentPhone}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <RemainingBadge remaining={remaining} />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/students/${student.id}`}
                        className="inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                      >
                        상세
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label={`${student.name} 더보기`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="divide-y divide-slate-100 md:hidden">
        {students.map((student) => {
          const remaining = getRemainingLessons(student.lessonPackage);

          return (
            <Link
              key={`mobile-${student.id}`}
              href={`/students/${student.id}`}
              className="flex items-start justify-between gap-3 px-4 py-4 transition hover:bg-blue-50/40"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900">{student.name}</p>
                  <StatusBadge status={student.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {student.school} · {student.grade} · {student.course}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  학부모 {student.contact.parentPhone}
                </p>
              </div>
              <RemainingBadge remaining={remaining} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function RemainingBadge({ remaining }: { remaining: number }) {
  return (
    <span
      className={cn(
        "inline-flex min-w-8 items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold",
        remaining === 0 && "bg-red-50 text-red-600",
        remaining === 1 && "bg-orange-50 text-orange-600",
        remaining > 1 && "bg-slate-100 text-slate-700",
      )}
    >
      {remaining}
    </span>
  );
}

function StatusBadge({ status }: { status: Student["status"] }) {
  const label = getStudentStatusLabel(status);

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "active"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600",
      )}
    >
      {label}
    </span>
  );
}
