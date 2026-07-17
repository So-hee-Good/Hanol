"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { COURSES, GRADES, SCHOOLS, type StudentFilters } from "@/lib/types";

interface StudentToolbarProps {
  filters: StudentFilters;
  onFiltersChange: (filters: StudentFilters) => void;
}

export function StudentToolbar({
  filters,
  onFiltersChange,
}: StudentToolbarProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/60 lg:flex-row lg:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={filters.query}
          onChange={(event) =>
            onFiltersChange({ ...filters, query: event.target.value })
          }
          placeholder="학생 이름 / 학교 / 학부모 / 연락처 검색"
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pr-3 pl-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:items-center">
        <FilterSelect
          ariaLabel="학교"
          value={filters.school}
          onChange={(school) => onFiltersChange({ ...filters, school })}
        >
          <option value="all">학교</option>
          {SCHOOLS.map((school) => (
            <option key={school} value={school}>
              {school}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          ariaLabel="학년"
          value={filters.grade}
          onChange={(grade) => onFiltersChange({ ...filters, grade })}
        >
          <option value="all">학년</option>
          {GRADES.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          ariaLabel="수업"
          value={filters.course}
          onChange={(course) => onFiltersChange({ ...filters, course })}
          className="col-span-2 sm:col-span-1"
        >
          <option value="all">수업</option>
          {COURSES.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </FilterSelect>
      </div>

      <button
        type="button"
        onClick={() => router.push("/students/new")}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white shadow-sm shadow-teal-700/25 transition hover:bg-teal-800"
      >
        <Plus className="h-4 w-4" />
        등록
      </button>
    </div>
  );
}

function FilterSelect({
  ariaLabel,
  value,
  onChange,
  children,
  className = "",
}: {
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`h-11 min-w-[7.5rem] rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-teal-300 focus:ring-4 focus:ring-teal-100 ${className}`}
    >
      {children}
    </select>
  );
}
