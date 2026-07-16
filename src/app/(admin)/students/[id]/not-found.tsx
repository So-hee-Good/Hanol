import Link from "next/link";

export default function StudentNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm">
      <p className="text-sm font-medium text-blue-600">404</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">
        학생을 찾을 수 없습니다
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        요청하신 학생 정보가 없거나 삭제되었을 수 있습니다.
      </p>
      <Link
        href="/students"
        className="mt-6 inline-flex h-11 items-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        학생 목록으로
      </Link>
    </div>
  );
}
