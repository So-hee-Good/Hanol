import Link from "next/link";

export default function StudentNotFound() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        학생을 찾을 수 없습니다
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        삭제되었거나 잘못된 학생 ID일 수 있습니다.
      </p>
      <Link
        href="/students"
        className="mt-6 inline-flex rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
      >
        학생 목록으로
      </Link>
    </div>
  );
}
