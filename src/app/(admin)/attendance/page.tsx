export default function AttendancePage() {
  return (
    <Placeholder
      title="출결"
      description="출결 모듈은 학생 상세의 Quick Actions와 연동될 예정입니다."
    />
  );
}

function Placeholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-16 text-center shadow-sm shadow-slate-200/50">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}
