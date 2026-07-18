"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import {
  ATTENDANCE_OPTIONS,
  type AttendanceType,
} from "@/lib/types";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function AttendancePage() {
  const { ready, data, markAttendance } = useStore();
  const [date, setDate] = useState(todayStr());
  const [classFilter, setClassFilter] = useState("all");

  const classes = useMemo(
    () =>
      Array.from(
        new Set(
          data.students
            .map((s) => s.className.trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b, "ko")),
    [data.students]
  );

  const students = useMemo(
    () =>
      data.students.filter((s) => {
        if (s.status !== "active") return false;
        if (classFilter === "all") return true;
        return s.className === classFilter;
      }),
    [data.students, classFilter]
  );

  const options = ATTENDANCE_OPTIONS;

  function mark(studentId: string, status: AttendanceType) {
    markAttendance(studentId, status, date);
  }

  if (!ready) return <p className="muted">불러오는 중…</p>;

  return (
    <div>
      <section className="page-head">
        <h1>출결 입력</h1>
        <p>
          수업일·수강반별로 출결을 기록합니다. 출석·보강은 수업권을 차감하고,
          같은 날 다시 누르면 기록을 바꿉니다.
        </p>
      </section>

      <div className="toolbar">
        <label className="inline-field">
          수업일
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="all">전체 수강반</option>
          {classes.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="attendance-grid">
        {students.map((student) => {
          const todayRecord = data.attendance.find(
            (item) => item.studentId === student.id && item.date === date
          );
          const remaining = Math.max(
            student.packageSize - student.usedCount,
            0
          );
          return (
            <article className="attendance-card" key={student.id}>
              <div className="student-card-head">
                <div>
                  <strong>{student.name}</strong>
                  <p>
                    {student.school || "학교 미입력"} ·{" "}
                    {student.className || "-"}
                  </p>
                </div>
                <span
                  className={
                    student.paymentStatus === "due"
                      ? "badge danger"
                      : remaining === 1
                        ? "badge warning"
                        : "badge success"
                  }
                >
                  {student.paymentStatus === "due"
                    ? "등록 필요"
                    : `잔여 ${remaining}회`}
                </span>
              </div>

              <div
                className="ticket-boxes"
                aria-label={`${student.usedCount}/${student.packageSize}`}
              >
                {Array.from({ length: student.packageSize }).map((_, index) => (
                  <span
                    key={index}
                    className={index < student.usedCount ? "used" : ""}
                  />
                ))}
              </div>

              {todayRecord && (
                <p className="today-record">
                  현재 기록:{" "}
                  {options.find((o) => o.value === todayRecord.status)?.label}
                </p>
              )}

              <div className="attendance-actions">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => mark(student.id, option.value)}
                    className={`attendance-${option.value}${
                      todayRecord?.status === option.value ? " selected" : ""
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
      {students.length === 0 && (
        <div className="empty">표시할 재원생이 없습니다.</div>
      )}
    </div>
  );
}
