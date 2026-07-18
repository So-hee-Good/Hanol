"use client";

import { useMemo, useState, type FormEvent } from "react";
import { filterStudents } from "@/lib/logic";
import { useStore } from "@/lib/store";
import {
  GRADE_OPTIONS,
  PACKAGE_OPTIONS,
  SESSION_LIMIT,
  type Student,
  type StudentListFilter,
  type StudentStatus,
} from "@/lib/types";

type FormState = {
  name: string;
  school: string;
  grade: string;
  className: string;
  studentPhone: string;
  parentName: string;
  parentPhone: string;
  packageSize: number;
  tuition: number;
  status: "active" | "paused";
  note: string;
};

const emptyForm = (): FormState => ({
  name: "",
  school: "",
  grade: "초3",
  className: "",
  studentPhone: "",
  parentName: "",
  parentPhone: "",
  packageSize: SESSION_LIMIT,
  tuition: 120000,
  status: "active",
  note: "",
});

function toForm(student: Student): FormState {
  return {
    name: student.name,
    school: student.school,
    grade: student.grade || "초3",
    className: student.className,
    studentPhone: student.studentPhone,
    parentName: student.parentName,
    parentPhone: student.parentPhone,
    packageSize: student.packageSize,
    tuition: student.tuition,
    status: student.status === "paused" ? "paused" : "active",
    note: student.note,
  };
}

export default function StudentsPage() {
  const { ready, data, addStudent, editStudent, removeStudent } = useStore();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StudentListFilter>("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [toast, setToast] = useState("");

  const filtered = useMemo(
    () => filterStudents(data.students, query, statusFilter),
    [data.students, query, statusFilter]
  );

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setShowForm(true);
  }

  function openEdit(student: Student) {
    setEditing(student);
    setForm(toForm(student));
    setShowForm(true);
  }

  function remove(student: Student) {
    if (!confirm(`${student.name} 학생을 삭제할까요?`)) return;
    removeStudent(student.id);
    setToast("학생이 삭제되었습니다.");
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("학생 이름을 입력하세요.");
      return;
    }
    if (editing) {
      editStudent(editing.id, form);
      setToast("학생 정보가 수정되었습니다.");
    } else {
      addStudent(form);
      setToast(`${form.name} 학생이 등록되었습니다.`);
    }
    setShowForm(false);
    setEditing(null);
  }

  if (!ready) return <p className="muted">불러오는 중…</p>;

  return (
    <div>
      <section className="page-head">
        <div className="split-actions">
          <div>
            <h1>학생 관리</h1>
            <p>출결·수납·문자에 사용할 학생 기본 정보를 관리합니다.</p>
          </div>
          <button type="button" className="btn primary" onClick={openCreate}>
            새 학생 등록
          </button>
        </div>
      </section>

      <div className="toolbar">
        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="학생 이름 / 학교 / 수업 / 학부모 검색"
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as StudentListFilter)
          }
        >
          <option value="all">전체 상태</option>
          <option value="active">재원생</option>
          <option value="one">잔여 1회</option>
          <option value="due">등록 안내 필요</option>
          <option value="paused">휴원</option>
        </select>
      </div>

      <div className="table-panel">
        <table>
          <thead>
            <tr>
              <th>학생명</th>
              <th>학교·학년</th>
              <th>수강반</th>
              <th>학부모 연락처</th>
              <th>수업권</th>
              <th>상태</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => {
              const remaining = student.packageSize - student.usedCount;
              return (
                <tr key={student.id}>
                  <td>
                    <strong>{student.name}</strong>
                    <small>
                      {student.studentPhone || "학생 연락처 없음"}
                    </small>
                  </td>
                  <td>
                    {student.school || "-"}
                    <small>{student.grade || "-"}</small>
                  </td>
                  <td>{student.className || "-"}</td>
                  <td>
                    {student.parentPhone || "-"}
                    <small>{student.parentName || "학부모 미입력"}</small>
                  </td>
                  <td>
                    <div className="progress-label">
                      <span>
                        {student.usedCount}/{student.packageSize}
                      </span>
                      <small>잔여 {Math.max(remaining, 0)}회</small>
                    </div>
                    <div className="progress-track">
                      <span
                        style={{
                          width: `${Math.min(
                            (student.usedCount / student.packageSize) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    {student.paymentStatus === "due" ? (
                      <span className="badge danger">등록 안내 필요</span>
                    ) : remaining === 1 ? (
                      <span className="badge warning">잔여 1회</span>
                    ) : student.status === "paused" ? (
                      <span className="badge paused">휴원</span>
                    ) : (
                      <span className="badge success">수강 중</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button type="button" onClick={() => openEdit(student)}>
                        수정
                      </button>
                      <button
                        type="button"
                        className="text-danger"
                        onClick={() => remove(student)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty">조건에 맞는 학생이 없습니다.</div>
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setShowForm(false)}
        >
          <form
            className="modal-card"
            onSubmit={submit}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>{editing ? "학생 정보 수정" : "학생 등록"}</h2>
                <p>출결·수납·문자에 사용될 기본 정보를 입력합니다.</p>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <div className="form-grid">
              <label>
                학생 이름
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>
              <label>
                학교
                <input
                  value={form.school}
                  onChange={(e) => setForm({ ...form, school: e.target.value })}
                />
              </label>
              <label>
                학년
                <select
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: e.target.value })}
                >
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                수강반
                <input
                  value={form.className}
                  onChange={(e) =>
                    setForm({ ...form, className: e.target.value })
                  }
                />
              </label>
              <label>
                학생 연락처
                <input
                  value={form.studentPhone}
                  onChange={(e) =>
                    setForm({ ...form, studentPhone: e.target.value })
                  }
                />
              </label>
              <label>
                학부모 성함
                <input
                  value={form.parentName}
                  onChange={(e) =>
                    setForm({ ...form, parentName: e.target.value })
                  }
                />
              </label>
              <label>
                학부모 연락처
                <input
                  value={form.parentPhone}
                  onChange={(e) =>
                    setForm({ ...form, parentPhone: e.target.value })
                  }
                />
              </label>
              <label>
                기본 수업권
                <select
                  value={form.packageSize}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      packageSize: Number(e.target.value),
                    })
                  }
                >
                  {PACKAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}회권
                    </option>
                  ))}
                </select>
              </label>
              <label>
                수강료
                <input
                  type="number"
                  value={form.tuition}
                  onChange={(e) =>
                    setForm({ ...form, tuition: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                재원 상태
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as StudentStatus &
                        ("active" | "paused"),
                    })
                  }
                >
                  <option value="active">재원</option>
                  <option value="paused">휴원</option>
                </select>
              </label>
              <label className="full">
                메모
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={3}
                />
              </label>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowForm(false)}
              >
                취소
              </button>
              <button type="submit" className="primary-button">
                {editing ? "수정 저장" : "학생 등록"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
