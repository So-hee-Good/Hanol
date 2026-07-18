"use client";

import { useMemo, useState } from "react";
import { getTemplate, renderSmsBody, templates } from "@/lib/sms";
import { filterStudents, type StudentListFilter } from "@/lib/logic";
import { useStore } from "@/lib/store";
import type { MessageRecipient, SmsTemplateKey } from "@/lib/types";

export default function MessagesPage() {
  const { ready, data, saveMessage } = useStore();
  const [filter, setFilter] = useState<StudentListFilter>("due");
  const [templateKey, setTemplateKey] = useState<SmsTemplateKey>("payment");
  const [recipient, setRecipient] = useState<MessageRecipient>("parent");
  const [selected, setSelected] = useState<string[]>([]);

  const targets = useMemo(
    () => filterStudents(data.students, "", filter),
    [data.students, filter]
  );

  function renderBody(studentId: string): string {
    const student = data.students.find((s) => s.id === studentId);
    if (!student) return templates[templateKey];
    return renderSmsBody(getTemplate(templateKey), student);
  }

  function toggleAll() {
    if (targets.length > 0 && selected.length === targets.length) {
      setSelected([]);
      return;
    }
    setSelected(targets.map((s) => s.id));
  }

  function prepareMessages() {
    if (selected.length === 0) {
      alert("발송 대상을 선택하세요.");
      return;
    }

    selected.forEach((id) => {
      const student = data.students.find((s) => s.id === id);
      if (!student) return;
      const phone =
        recipient === "parent" ? student.parentPhone : student.studentPhone;
      saveMessage({
        studentId: id,
        recipient,
        phone,
        body: renderBody(id),
        status: "prepared",
      });
    });
    setSelected([]);
    alert(
      `${selected.length}건의 문자를 발송 준비 목록에 저장했습니다.\n실제 SMS API 연동은 다음 Sprint에서 진행합니다.`
    );
  }

  if (!ready) return <p className="muted">불러오는 중…</p>;

  return (
    <div>
      <section className="page-head">
        <h1>문자 발송</h1>
        <p>
          조건별 대상을 고르고 템플릿을 미리본 뒤 발송 준비 목록에 저장합니다.
        </p>
      </section>

      <div className="message-layout">
        <section className="panel">
          <div className="message-controls">
            <label>
              대상 조건
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value as StudentListFilter);
                  setSelected([]);
                }}
              >
                <option value="due">4회 완료 · 등록 안내</option>
                <option value="one">잔여 1회</option>
                <option value="active">전체 재원생</option>
                <option value="all">전체 학생</option>
              </select>
            </label>
            <label>
              수신자
              <select
                value={recipient}
                onChange={(e) =>
                  setRecipient(e.target.value as "parent" | "student")
                }
              >
                <option value="parent">학부모</option>
                <option value="student">학생</option>
              </select>
            </label>
          </div>

          <div className="selection-header">
            <label>
              <input
                type="checkbox"
                checked={
                  targets.length > 0 && selected.length === targets.length
                }
                onChange={toggleAll}
              />{" "}
              전체 선택
            </label>
            <span>{selected.length}명 선택</span>
          </div>

          <div className="recipient-list">
            {targets.map((student) => (
              <label className="recipient-item" key={student.id}>
                <input
                  type="checkbox"
                  checked={selected.includes(student.id)}
                  onChange={() =>
                    setSelected((prev) =>
                      prev.includes(student.id)
                        ? prev.filter((id) => id !== student.id)
                        : [...prev, student.id]
                    )
                  }
                />
                <div>
                  <strong>{student.name}</strong>
                  <span>
                    {student.school || "-"} · {student.className || "-"}
                  </span>
                </div>
                <small>
                  {recipient === "parent"
                    ? student.parentPhone || "-"
                    : student.studentPhone || "-"}
                </small>
              </label>
            ))}
            {targets.length === 0 && (
              <div className="empty">조건에 맞는 대상이 없습니다.</div>
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>문자 작성</h2>
              <p>학생별 변수는 자동 치환됩니다.</p>
            </div>
          </div>

          <label className="block-label">
            템플릿
            <select
              value={templateKey}
              onChange={(e) =>
                setTemplateKey(e.target.value as keyof typeof templates)
              }
            >
              <option value="payment">4회 완료 등록 안내</option>
              <option value="oneLeft">잔여 1회 사전 안내</option>
              <option value="absence">결석 안내</option>
            </select>
          </label>

          <div className="message-preview">
            <strong>미리보기</strong>
            <p>
              {selected[0] ? renderBody(selected[0]) : templates[templateKey]}
            </p>
          </div>

          <button
            type="button"
            className="primary-button full-width"
            onClick={prepareMessages}
          >
            선택 대상 문자 준비
          </button>

          <div className="prepared-log">
            <h3>최근 준비 이력</h3>
            {data.messages.length === 0 ? (
              <div className="empty">아직 준비된 문자가 없습니다.</div>
            ) : (
              data.messages.slice(0, 5).map((message) => {
                const student = data.students.find(
                  (s) => s.id === message.studentId
                );
                return (
                  <div key={message.id}>
                    <strong>{student?.name ?? message.studentName}</strong>
                    <span>{message.phone || "-"}</span>
                    <small>
                      {new Date(message.sentAt).toLocaleString("ko-KR")}
                    </small>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
