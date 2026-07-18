"use client";

import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { getTemplate, renderSmsBody, SMS_TEMPLATES } from "@/lib/sms";
import { filterStudents, remainingSessions, type StudentListFilter } from "@/lib/logic";
import { useStore } from "@/lib/store";
import type { SmsTemplateKey } from "@/lib/types";

export default function SmsPage() {
  const { ready, data, sendSms } = useStore();
  const [filter, setFilter] = useState<StudentListFilter>("due");
  const [templateKey, setTemplateKey] = useState<SmsTemplateKey>("renewal");
  const [customBody, setCustomBody] = useState(getTemplate("renewal").body);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const candidates = useMemo(
    () => filterStudents(data.students, "", filter),
    [data.students, filter]
  );

  const previewStudent =
    candidates.find((s) => selected.includes(s.id)) ?? candidates[0] ?? null;

  const preview = previewStudent
    ? renderSmsBody(customBody, previewStudent)
    : customBody;

  if (!ready) return <p className="muted">불러오는 중…</p>;

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function selectAll() {
    setSelected(candidates.map((s) => s.id));
  }

  return (
    <>
      <section className="page-head">
        <h1>문자 발송</h1>
        <p>
          조건별 대상을 고르고 템플릿을 미리본 뒤 발송 이력을 저장합니다. (실제
          SMS API 연동 전 단계)
        </p>
      </section>

      <div className="two-col">
        <section className="panel">
          <h2>대상 선택</h2>
          <div className="toolbar">
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as StudentListFilter);
                setSelected([]);
              }}
            >
              <option value="all">전체 학생</option>
              <option value="due">등록 안내 필요</option>
              <option value="one">잔여 1회</option>
              <option value="active">재원생</option>
              <option value="paused">휴원</option>
            </select>
            <button type="button" className="btn ghost sm" onClick={selectAll}>
              전체 선택
            </button>
            <button
              type="button"
              className="btn ghost sm"
              onClick={() => setSelected([])}
            >
              선택 해제
            </button>
          </div>

          {candidates.length === 0 ? (
            <p className="empty">해당 조건의 학생이 없습니다.</p>
          ) : (
            <div className="check-list">
              {candidates.map((s) => (
                <label key={s.id} className="check-item">
                  <input
                    type="checkbox"
                    checked={selected.includes(s.id)}
                    onChange={() => toggle(s.id)}
                  />
                  <span>
                    <strong>{s.name}</strong>
                    <div className="muted">
                      {s.parentPhone || s.studentPhone || "연락처 없음"} ·{" "}
                      {s.usedCount}/{s.packageSize} · 잔여{" "}
                      {remainingSessions(s)}회
                    </div>
                    <StatusBadge student={s} />
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <h2>템플릿 · 미리보기</h2>
          <form
            className="inline-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (selected.length === 0) {
                alert("발송 대상을 선택하세요.");
                return;
              }
              const item = sendSms(templateKey, selected, customBody);
              if (item) {
                setMessage(
                  `${item.recipients.length}명에게 문자 발송 이력을 저장했습니다. (대기열)`
                );
                setSelected([]);
              }
            }}
          >
            <label>
              템플릿
              <select
                value={templateKey}
                onChange={(e) => {
                  const key = e.target.value as SmsTemplateKey;
                  setTemplateKey(key);
                  setCustomBody(getTemplate(key).body);
                }}
              >
                {SMS_TEMPLATES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label} — {t.description}
                  </option>
                ))}
              </select>
            </label>
            <label>
              문구 편집
              <textarea
                rows={5}
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
              />
            </label>
            <p className="muted">
              변수: {"{학생이름}"}, {"{남은회차}"}, {"{사용회차}"}, {"{패키지}"},{" "}
              {"{학년}"} · 미리보기는 첫 선택 학생 기준
            </p>
            <div className="preview-box">{preview}</div>
            <button type="submit" className="btn primary">
              발송 이력 저장 ({selected.length}명)
            </button>
            {message && <div className="toast">{message}</div>}
          </form>
        </section>
      </div>

      <section className="panel" style={{ marginTop: "1rem" }}>
        <h2>발송 이력</h2>
        {data.messages.length === 0 ? (
          <p className="empty">저장된 발송 이력이 없습니다.</p>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>일시</th>
                  <th>템플릿</th>
                  <th>대상</th>
                  <th>미리보기</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {data.messages.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.sentAt).toLocaleString("ko-KR")}</td>
                    <td>{item.templateLabel}</td>
                    <td>
                      {item.recipients.map((r) => r.name).join(", ")}
                      <div className="muted">{item.recipients.length}명</div>
                    </td>
                    <td style={{ maxWidth: 280 }}>{item.body}</td>
                    <td>대기열</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
