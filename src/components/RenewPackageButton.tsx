"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { renewPackageAction } from "@/app/actions";

export function RenewPackageButton({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setMessage(null);
          setError(null);
          startTransition(async () => {
            const result = await renewPackageAction(studentId);
            if (result.ok) {
              setMessage(result.message);
              router.refresh();
            } else {
              setError(result.message);
            }
          });
        }}
        className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
      >
        {pending ? "등록 중..." : "결제 완료 · 4회 패키지 등록"}
      </button>
      {message ? (
        <p className="text-sm font-medium text-emerald-700">{message}</p>
      ) : null}
      {error ? (
        <p className="text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
