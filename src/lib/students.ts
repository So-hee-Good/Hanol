import type { StudentFilters, StudentWithPackage } from "@/lib/types";

export function filterStudents(
  source: StudentWithPackage[],
  filters: StudentFilters,
): StudentWithPackage[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return source.filter((student) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      student.name.toLowerCase().includes(normalizedQuery) ||
      student.school.toLowerCase().includes(normalizedQuery) ||
      student.parentName.toLowerCase().includes(normalizedQuery) ||
      student.phone.replace(/-/g, "").includes(
        normalizedQuery.replace(/-/g, ""),
      ) ||
      student.parentPhone
        .replace(/-/g, "")
        .includes(normalizedQuery.replace(/-/g, ""));

    const matchesSchool =
      filters.school === "all" || student.school === filters.school;
    const matchesGrade =
      filters.grade === "all" || student.grade === filters.grade;
    const matchesCourse =
      filters.course === "all" || student.course === filters.course;

    return matchesQuery && matchesSchool && matchesGrade && matchesCourse;
  });
}
