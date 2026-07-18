"use client";

import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { remainingSessions } from "@/lib/logic";
import { useStore } from "@/lib/store";
import { ATTENDANCE_LABELS, type AttendanceType } from "@/lib/types";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function AttendancePage() {
  const { ready, data, markAttendance } = useStore();
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState(todayStr());
  const [type, setType] = useState<AttendanceType>("present");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const selectable = useMemo(
    () => data.students.filter((s) => s.status !== "withdrawn"),
    [data.students]
  );

  const selected = selectable.find((s) => s.id === studentId) ?? null;

  if (!ready) return <p className="muted">불러오는 중…</p>;

  return (
    <>
      <section className="page-head">
        <h1>출결 입력</h1>
        <p>
          출석·보강 시 사용 회차가 증가합니다. 패키지를 모두 쓰면 상태가{" "}
          <strong>등록 안내 필요</strong>로 바뀝니다.
        </p>
      </section>

      <div className="two-col">
        <section className="panel">
          <h2>출결 기록하기</h2>
          <form
            className="inline-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!studentId) {
                alert("학생을 선택하세요.");
                return;
              }
              const before = data.students.find((s) => s.id === studentId);
              markAttendance(studentId, type, date, note);
              const afterName = before?.name ?? "학생";
              const willCount =
                (type === "present" || type === "makeup") &&
                (before?.usedCount ?? 0) < (before?.packageSize ?? 0);
              const nextUsed = willCount
                ? Math.min(
                    (before?.usedCount ?? 0) + 1,
                    before?.packageSize ?? 0
                  )
                : (before?.usedCount ?? 0);
              const nextRemaining = Math.max(
                0,
                (before?.packageSize ?? 0) - nextUsed
              );
              setMessage(
                willCount
                  ? `${afterName} ${ATTENDANCE_LABELS[type]} 처리 · 사용 ${nextUsed}/${before?.packageSize} · 잔여 ${nextRemaining}회${
                      nextRemaining === 0 ? " · 등록 안내 필요로 전환" : ""
                    }`
                  : `${afterName} ${ATTENDANCE_LABELS[type]} 기록 (회차 미차감)`
              );
              setNote("");
            }}
          >
            <label>
              학생
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              >
                <option value="">학생 선택</option>
                {selectable.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · {s.usedCount}/{s.packageSize} · 잔여{" "}
                    {remainingSessions(s)}회 ·{" "}
                    {s.paymentStatus === "due"
                      ? "등록 안내 필요"
                      : s.status === "paused"
                        ? "휴원"
                        : "수강중"}
                  </option>
                ))}
              </select>
            </label>
            <label>
              날짜
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
            <label>
              구분
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AttendanceType)}
              >
                {(Object.keys(ATTENDANCE_LABELS) as AttendanceType[]).map(
                  (key) => (
                    <option key={key} value={key}>
                      {ATTENDANCE_LABELS[key]}
                    </option>
                  )
                )}
              </select>
            </label>
            <label>
              메모
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="선택 사항"
              />
            </label>
            {selected && (
              <p className="muted">
                현재: 사용 {selected.usedCount}/{selected.packageSize} · 잔여{" "}
                {remainingSessions(selected)}회 ·{" "}
                <StatusBadge student={selected} />
              </p>
            )}
            <button type="submit" className="btn primary">
              출결 저장
            </button>
            {message && <div className="toast">{message}</div>}
          </form>
        </section>

        <section className="panel">
          <h2>출결 이력</h2>
          {data.attendance.length === 0 ? (
            <p className="empty">아직 출결 기록이 없습니다.</p>
          ) : (
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>학생</th>
                    <th>구분</th>
                    <th>차감</th>
                  </tr>
                </thead>
                <tbody>
                  {data.attendance.slice(0, 30).map((a) => (
                    <tr key={a.id}>
                      <td>{a.date}</td>
                      <td>{a.studentName}</td>
                      <td>{ATTENDANCE_LABELS[a.type]}</td>
                      <td>{a.counted ? "회차 +1" : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
