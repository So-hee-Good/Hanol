import { StudentsPageClient } from "@/components/students/StudentsPageClient";
import { listStudents } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const students = await listStudents();
  return <StudentsPageClient students={students} />;
}
