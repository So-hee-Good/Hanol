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
      className="rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:opacity-50"
    >
      {pending ? "초기화 중..." : "데모 데이터 초기화"}
    </button>
  );
}
