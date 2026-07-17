import { ResetDemoButton } from "@/components/ResetDemoButton";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          설정
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          로컬 데모 데이터와 운영 안내를 확인합니다.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">데이터</h3>
        <p className="mt-2 text-sm text-slate-500">
          저장소는 `.data/store.json` 입니다. 외부 DB 없이 Server Action으로
          동작하며, 초기화하면 시드 데이터로 돌아갑니다.
        </p>
        <div className="mt-4">
          <ResetDemoButton />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">운영 규칙</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>월 납부 / 월별 등록금 계산을 사용하지 않습니다.</li>
          <li>기본 수업 패키지는 4회입니다.</li>
          <li>출석 1회 = 수업 1회 자동 소모</li>
          <li>4/4 소진 시 결제 필요 + 대시보드 등록 안내</li>
        </ul>
      </section>
    </div>
  );
}
