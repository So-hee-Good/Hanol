import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
        <p className="text-sm font-semibold text-teal-700">HANOL</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          앱 주소는{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-800">
            http://localhost:3000
          </code>{" "}
          입니다. GitHub PR 주소나 에이전트 페이지가 아닌, 실행 중인 앱 포트로
          접속해 주세요.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/"
            className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
          >
            대시보드로 이동
          </Link>
          <Link
            href="/students"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            학생 목록
          </Link>
        </div>
      </div>
    </div>
  );
}
