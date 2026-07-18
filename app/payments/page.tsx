"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { needsRenewal, remainingSessions } from "@/lib/logic";
import { useStore } from "@/lib/store";

export default function PaymentsPage() {
  const { ready, data, markPayment } = useStore();

  if (!ready) return <p className="muted">불러오는 중…</p>;

  const due = data.students.filter((s) => needsRenewal(s));
  const recentPayments = data.payments.slice(0, 20);

  return (
    <>
      <section className="page-head">
        <h1>등록·수납 안내</h1>
        <p>
          4회 수업을 모두 사용한 학생을 확인하고 수납 완료 시 새 4회권을
          시작합니다.
        </p>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>등록 안내 대상</h2>
            <p>4회권을 모두 사용하여 재등록이 필요한 학생입니다.</p>
          </div>
          <Link href="/messages" className="btn sm accent">
            문자 작성
          </Link>
        </div>

        {due.length === 0 ? (
          <div className="empty">현재 등록 안내 대상이 없습니다.</div>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>학교 · 반</th>
                  <th>사용 회차</th>
                  <th>상태</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {due.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.name}</strong>
                      <div className="muted">{s.parentPhone || s.phone || "-"}</div>
                    </td>
                    <td>
                      {s.school || "-"} · {s.className || s.grade || "-"}
                    </td>
                    <td>
                      {s.usedCount}/{s.packageSize}
                      <div className="muted">잔여 {remainingSessions(s)}회</div>
                    </td>
                    <td>
                      <StatusBadge student={s} />
                    </td>
                    <td>
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
                        }}
                      >
                        수납 완료
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel" style={{ marginTop: "1rem" }}>
        <div className="panel-header">
          <div>
            <h2>최근 수납</h2>
            <p>수납 완료로 시작된 4회권 이력입니다.</p>
          </div>
        </div>
        {recentPayments.length === 0 ? (
          <div className="empty">수납 이력이 없습니다.</div>
        ) : (
          <div className="activity-list">
            {recentPayments.map((p) => (
              <div className="activity-item" key={p.id}>
                <span className="activity-dot" />
                <div>
                  <strong>{p.studentName}</strong>
                  <p>
                    {p.amount.toLocaleString("ko-KR")}원
                    {p.note ? ` · ${p.note}` : ""}
                  </p>
                </div>
                <time>
                  {new Date(p.paidAt).toLocaleString("ko-KR", {
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
