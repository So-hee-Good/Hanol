"use client";

import { useMemo, useState } from "react";
import { StudentTable } from "@/components/students/StudentTable";
import { StudentToolbar } from "@/components/students/StudentToolbar";
import { filterStudents } from "@/lib/students";
import type { Student, StudentFilters } from "@/types/student";

interface StudentsPageClientProps {
  students: Student[];
}

const initialFilters: StudentFilters = {
  query: "",
  school: "all",
  grade: "all",
  course: "all",
};

export function StudentsPageClient({ students }: StudentsPageClientProps) {
  const [filters, setFilters] = useState<StudentFilters>(initialFilters);

  const filteredStudents = useMemo(
    () => filterStudents(students, filters),
    [students, filters],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          학생 관리
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
          학생 정보를 관리하고 출결, 수업권, 수납, 상담을 한 곳에서 관리합니다.
        </p>
      </div>

      <StudentToolbar
        filters={filters}
        onFiltersChange={setFilters}
        onRegister={() => {
          // Registration flow will be wired to a modal/route later.
        }}
      />

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          총{" "}
          <span className="font-semibold text-slate-800">
            {filteredStudents.length}
          </span>
          명
        </p>
      </div>

      <StudentTable students={filteredStudents} />
    </div>
  );
}
