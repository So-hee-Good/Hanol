"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createStudentAction } from "@/app/actions";
import { COURSES, GRADES, SCHOOLS } from "@/lib/types";

export function StudentCreateForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
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
      <p className="text-sm text-slate-500">
        등록과 동시에 기본 수업 패키지 <strong>4회</strong>가 발급됩니다. 월
        납부가 아닌 수업 횟수 기준입니다.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="이름" name="name" required placeholder="예: 김서연" />
        <Field label="학생 연락처" name="phone" placeholder="010-0000-0000" />
        <Field label="학부모 이름" name="parentName" placeholder="예: 김민수" />
        <Field
          label="학부모 연락처"
          name="parentPhone"
          placeholder="010-0000-0000"
        />
        <SelectField label="학교" name="school" options={[...SCHOOLS]} />
        <SelectField label="학년" name="grade" options={[...GRADES]} />
        <SelectField
          label="수업"
          name="course"
          options={[...COURSES]}
          className="sm:col-span-2"
        />
        <label className="block text-sm text-slate-500 sm:col-span-2">
          주소
          <input
            name="address"
            placeholder="주소"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
          />
        </label>
        <label className="block text-sm text-slate-500 sm:col-span-2">
          메모
          <textarea
            name="note"
            rows={3}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-50"
      >
        {pending ? "등록 중..." : "학생 등록 + 4회 패키지 발급"}
      </button>
      {error ? (
        <p className="text-sm font-medium text-red-600">{error}</p>
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
    <label className="block text-sm text-slate-500">
      {label}
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  className = "",
}: {
  label: string;
  name: string;
  options: string[];
  className?: string;
}) {
  return (
    <label className={`block text-sm text-slate-500 ${className}`}>
      {label}
      <select
        name={name}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
        defaultValue=""
      >
        <option value="">선택</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
