"use client";

import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { StudentForm } from "@/components/StudentForm";
import {
  filterStudents,
  remainingSessions,
  type StudentListFilter,
} from "@/lib/logic";
import { useStore } from "@/lib/store";
import { STATUS_LABELS, type Student, type StudentStatus } from "@/lib/types";

export default function StudentsPage() {
  const { ready, data, addStudent, editStudent, removeStudent, markPayment } =
    useStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StudentListFilter>("all");
  const [editing, setEditing] = useState<Student | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [message, setMessage] = useState("");

  const filtered = useMemo(
    () => filterStudents(data.students, query, status),
    [data.students, query, status]
  );

  if (!ready) return <p className="muted">불러오는 중…</p>;

  return (
    <>
      <section className="page-head">
        <h1>학생 관리</h1>
        <p>등록·수정·삭제와 검색/상태 필터, 수납 완료 처리를 지원합니다.</p>
      </section>

      <section className="panel">
        <div className="split-actions">
          <h2>학생 목록</h2>
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setEditing(null);
              setShowCreate((v) => !v);
            }}
          >
            {showCreate ? "등록 폼 닫기" : "새 학생 등록"}
          </button>
        </div>

        {showCreate && (
          <div style={{ marginBottom: "1rem" }}>
            <StudentForm
              mode="create"
              onCancel={() => setShowCreate(false)}
              onSubmit={(values) => {
                addStudent(values);
                setShowCreate(false);
                setMessage(`${values.name} 학생이 등록되었습니다. (4회권 시작)`);
              }}
            />
          </div>
        )}

        <div className="toolbar">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름·연락처·학년 검색"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StudentListFilter)}
          >
            <option value="all">전체 상태</option>
            <option value="renewal_needed">등록 안내 필요</option>
            {(Object.keys(STATUS_LABELS) as StudentStatus[]).map((key) => (
              <option key={key} value={key}>
                {STATUS_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        {editing && (
          <div className="panel" style={{ marginBottom: "1rem", boxShadow: "none" }}>
            <h2>{editing.name} 수정</h2>
            <StudentForm
              mode="edit"
              initial={editing}
              onCancel={() => setEditing(null)}
              onSubmit={(values) => {
                editStudent(editing.id, values);
                setEditing(null);
                setMessage("학생 정보가 수정되었습니다.");
              }}
            />
          </div>
        )}

        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>이름</th>
                <th>학년</th>
                <th>학부모</th>
                <th>사용 / 패키지</th>
                <th>상태</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <p className="empty">조건에 맞는 학생이 없습니다.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.name}</strong>
                      <div className="muted">{s.phone || "-"}</div>
                    </td>
                    <td>{s.grade || "-"}</td>
                    <td>{s.parentPhone || "-"}</td>
                    <td>
                      {s.usedCount}/{s.packageSize}
                      <div className="muted">잔여 {remainingSessions(s)}회</div>
                    </td>
                    <td>
                      <StatusBadge student={s} />
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="btn sm ghost"
                          onClick={() => {
                            setShowCreate(false);
                            setEditing(s);
                          }}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="btn sm accent"
                          onClick={() => {
                            const amountRaw = prompt(
                              "수납 금액을 입력하세요 (원)",
                              "120000"
                            );
                            if (amountRaw == null) return;
                            const amount = Number(amountRaw.replace(/,/g, ""));
                            if (!Number.isFinite(amount) || amount < 0) {
                              alert("올바른 금액을 입력하세요.");
                              return;
                            }
                            markPayment(s.id, amount, "수납 완료");
                            setMessage(
                              `${s.name} 수납 완료 → 새 4회권이 시작되었습니다.`
                            );
                          }}
                        >
                          수납 완료
                        </button>
                        <button
                          type="button"
                          className="btn sm danger"
                          onClick={() => {
                            if (confirm(`${s.name} 학생을 삭제할까요?`)) {
                              removeStudent(s.id);
                              setMessage("학생이 삭제되었습니다.");
                            }
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {message && <div className="toast">{message}</div>}
      </section>
    </>
  );
}
