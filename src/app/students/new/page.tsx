import { AppShell } from "@/components/AppShell";
import { StudentCreateForm } from "@/components/StudentCreateForm";

export default function NewStudentPage() {
  return (
    <AppShell
      title="학생 등록"
      subtitle="등록 시 기본 수업 패키지 4회가 바로 발급됩니다. 월 납부 설정은 없습니다."
    >
      <StudentCreateForm />
    </AppShell>
  );
}
