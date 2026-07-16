import type { Metadata } from "next";
import { StudentsPageClient } from "@/components/students/StudentsPageClient";
import { getAllStudents } from "@/lib/students";

export const metadata: Metadata = {
  title: "학생 관리 | HANOL 관리자",
  description:
    "학생 정보를 관리하고 출결, 수업권, 수납, 상담을 한 곳에서 관리합니다.",
};

export default function StudentsPage() {
  const students = getAllStudents();

  return <StudentsPageClient students={students} />;
}
