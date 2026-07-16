import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudentDetail } from "@/components/students/StudentDetail";
import { getAllStudents, getStudentById } from "@/lib/students";

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllStudents().map((student) => ({ id: student.id }));
}

export async function generateMetadata({
  params,
}: StudentDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const student = getStudentById(id);

  if (!student) {
    return { title: "학생 없음 | HANOL 관리자" };
  }

  return {
    title: `${student.name} | 학생 관리 | HANOL 관리자`,
    description: `${student.school} ${student.grade} ${student.name} 학생 상세`,
  };
}

export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
  const { id } = await params;
  const student = getStudentById(id);

  if (!student) {
    notFound();
  }

  return <StudentDetail student={student} />;
}
