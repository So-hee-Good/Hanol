"use client";

import { useState, type FormEvent } from "react";
import type { Student, StudentStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

type Mode = "create" | "edit";

interface Props {
  mode: Mode;
  initial?: Student | null;
  onSubmit: (values: {
    name: string;
    phone: string;
    parentPhone: string;
    school: string;
    className: string;
    grade: string;
    memo: string;
    status?: StudentStatus;
  }) => void;
  onCancel?: () => void;
}

export function StudentForm({ mode, initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [parentPhone, setParentPhone] = useState(initial?.parentPhone ?? "");
  const [school, setSchool] = useState(initial?.school ?? "");
  const [className, setClassName] = useState(
    initial?.className || initial?.grade || ""
  );
  const [memo, setMemo] = useState(initial?.memo ?? "");
  const [status, setStatus] = useState<StudentStatus>(
    initial?.status ?? "active"
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name,
      phone,
      parentPhone,
      school,
      className,
      grade: className,
      memo,
      ...(mode === "edit" ? { status } : {}),
    });
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        학생 이름
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="예: 김서연"
        />
      </label>
      <label>
        학생 연락처
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="010-0000-0000"
        />
      </label>
      <label>
        학부모 연락처
        <input
          value={parentPhone}
          onChange={(e) => setParentPhone(e.target.value)}
          placeholder="010-0000-0000"
        />
      </label>
      <label>
        학교
        <input
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          placeholder="예: 위례초등학교"
        />
      </label>
      <label>
        반/학년
        <input
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="예: 초3"
        />
      </label>
      {mode === "edit" && (
        <label>
          상태
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StudentStatus)}
          >
            {(Object.keys(STATUS_LABELS) as StudentStatus[]).map((key) => (
              <option key={key} value={key}>
                {STATUS_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="full">
        메모
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={2}
          placeholder="수업 요일, 특이사항 등"
        />
      </label>
      <div className="form-actions full">
        {onCancel && (
          <button type="button" className="btn ghost" onClick={onCancel}>
            취소
          </button>
        )}
        <button type="submit" className="btn primary">
          {mode === "create" ? "학생 등록" : "수정 저장"}
        </button>
      </div>
    </form>
  );
}
