"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { recordAttendanceAction } from "@/app/actions";

type AttendanceFormProps = {
  studentId: string;
  disabled?: boolean;
};

export function AttendanceForm({ studentId, disabled }: AttendanceFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setMessage(null);
        setError(null);
        startTransition(async () => {
          const result = await recordAttendanceAction(studentId, formData);
          if (result.ok) {
            setMessage(result.message);
            event.currentTarget.reset();
            router.refresh();
          } else {
            setError(result.message);
          }
        });
      }}
    >
      <label className="block text-sm text-[var(--muted)]">
        출석 메모
        <input
          name="note"
          type="text"
          placeholder="예: 정규 수업"
          disabled={disabled || pending}
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-[var(--ink)] outline-none focus:border-[var(--accent)]"
        />
      </label>
      <button
        type="submit"
        disabled={disabled || pending}
        className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "처리 중..." : "출석 처리 (수업 1회 소모)"}
      </button>
      {message ? (
        <p className="text-sm font-medium text-[var(--ok)]">{message}</p>
      ) : null}
      {error ? (
        <p className="text-sm font-medium text-[var(--alert)]">{error}</p>
      ) : null}
    </form>
  );
}
