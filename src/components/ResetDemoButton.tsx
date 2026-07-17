"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { resetDemoDataAction } from "@/app/actions";

export function ResetDemoButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await resetDemoDataAction();
          router.refresh();
        });
      }}
      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 transition hover:border-slate-400 hover:text-slate-800 disabled:opacity-50"
    >
      {pending ? "초기화 중..." : "데모 데이터 초기화"}
    </button>
  );
}
