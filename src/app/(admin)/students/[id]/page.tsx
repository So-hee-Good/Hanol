import { notFound } from "next/navigation";
import { StudentDetailView } from "@/components/students/StudentDetailView";
import { getStudent, listTimelineForStudent } from "@/lib/store";

export const dynamic = "force-dynamic";

type StudentDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
  const { id } = await params;
  const student = await getStudent(id);
  if (!student) notFound();

  const timeline = await listTimelineForStudent(id);

  return <StudentDetailView student={student} timeline={timeline} />;
}
