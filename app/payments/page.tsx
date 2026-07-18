"use client";

import Link from "next/link";
import { needsRenewal } from "@/lib/logic";
import { useStore } from "@/lib/store";

export default function PaymentsPage() {
  const { ready, data, markPayment } = useStore();

  if (!ready) return <p className="muted">불러오는 중…</p>;

  const students = data.students.filter((s) => needsRenewal(s));

  function pay(studentId: string, tuition: number) {
    markPayment(studentId, tuition, "수납 완료");
  }

  return (
    <div>
      <section className="page-head">
        <div className="split-actions">
          <div>
            <h1>등록·수납 안내</h1>
            <p>
              수업권을 모두 사용한 학생만 표시됩니다. 수납 완료 시 새 수업권이
              시작됩니다.
            </p>
          </div>
          <Link href="/messages" className="btn sm accent">
            문자 작성
          </Link>
        </div>
      </section>

      <div className="table-panel">
        <table>
          <thead>
            <tr>
              <th>학생</th>
              <th>수강반</th>
              <th>현재 수업권</th>
              <th>수강료</th>
              <th>상태</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>
                  <strong>{student.name}</strong>
                  <small>{student.parentPhone || "연락처 없음"}</small>
                </td>
                <td>{student.className || "-"}</td>
                <td>
                  {student.usedCount}/{student.packageSize}
                  <small>
                    잔여 {Math.max(student.packageSize - student.usedCount, 0)}
                    회
                  </small>
                </td>
                <td>{student.tuition.toLocaleString("ko-KR")}원</td>
                <td>
                  {student.paymentStatus === "due" ? (
                    <span className="badge danger">등록 안내 필요</span>
                  ) : (
                    <span className="badge success">정상</span>
                  )}
                </td>
                <td>
                  {student.paymentStatus === "due" && (
                    <button
                      type="button"
                      className="primary-button compact"
                      onClick={() => pay(student.id, student.tuition)}
                    >
                      수납 완료
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && (
          <div className="empty">등록 안내가 필요한 학생이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
