import { students } from "@/data/students";
import type { Student, StudentFilters } from "@/types/student";

export function getAllStudents(): Student[] {
  return students;
}

export function getStudentById(id: string): Student | undefined {
  return students.find((student) => student.id === id);
}

export function filterStudents(
  source: Student[],
  filters: StudentFilters,
): Student[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return source.filter((student) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      student.name.toLowerCase().includes(normalizedQuery) ||
      student.school.toLowerCase().includes(normalizedQuery) ||
      student.parentName.toLowerCase().includes(normalizedQuery) ||
      student.contact.parentPhone.replace(/-/g, "").includes(
        normalizedQuery.replace(/-/g, ""),
      );

    const matchesSchool =
      filters.school === "all" || student.school === filters.school;

    const matchesGrade =
      filters.grade === "all" || student.grade === filters.grade;

    const matchesCourse =
      filters.course === "all" || student.course === filters.course;

    return matchesQuery && matchesSchool && matchesGrade && matchesCourse;
  });
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
