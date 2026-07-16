"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createStudentAction } from "@/app/actions";

export function StudentCreateForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="mx-auto max-w-xl space-y-4 rounded-2xl border border-[var(--line)] bg-white/90 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setError(null);
        startTransition(async () => {
          const result = await createStudentAction(formData);
          if (result.ok && result.studentId) {
            router.push(`/students/${result.studentId}`);
            router.refresh();
          } else {
            setError(result.message);
          }
        });
      }}
    >
      <p className="text-sm text-[var(--muted)]">
        등록과 동시에 기본 수업 패키지 <strong>4회</strong>가 발급됩니다. 월
        납부가 아닌 수업 횟수 기준입니다.
      </p>

      <Field label="이름" name="name" required placeholder="예: 김서연" />
      <Field label="연락처" name="phone" placeholder="010-0000-0000" />
      <Field label="학년" name="grade" placeholder="예: 초3" />
      <label className="block text-sm text-[var(--muted)]">
        메모
        <textarea
          name="note"
          rows={3}
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-[var(--ink)] outline-none focus:border-[var(--accent)]"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-50"
      >
        {pending ? "등록 중..." : "학생 등록 + 4회 패키지 발급"}
      </button>
      {error ? (
        <p className="text-sm font-medium text-[var(--alert)]">{error}</p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm text-[var(--muted)]">
      {label}
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-[var(--ink)] outline-none focus:border-[var(--accent)]"
      />
    </label>
  );
}
