import { StudentCreateForm } from "@/components/StudentCreateForm";

export default function NewStudentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          학생 등록
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
          등록과 동시에 기본 수업 패키지 4회가 발급됩니다. 월 납부 설정은
          없습니다.
        </p>
      </div>
      <StudentCreateForm />
    </div>
  );
}
