"use client";

import Link from "next/link";
import {
  needsRenewal,
  recentActivity,
  remainingSessions,
} from "@/lib/logic";
import { useStore } from "@/lib/store";

export default function DashboardPage() {
  const { ready, data, resetAll } = useStore();

  if (!ready) {
    return <p className="muted">불러오는 중…</p>;
  }

  const today = new Date().toISOString().slice(0, 10);
  const due = data.students.filter((s) => needsRenewal(s));
  const oneLeft = data.students.filter(
    (s) =>
      s.status === "active" &&
      !needsRenewal(s) &&
      remainingSessions(s) === 1
  );
  const todayAttendance = data.attendance.filter((a) => a.date === today);
  const active = data.students.filter(
    (s) => s.status === "active" && !needsRenewal(s)
  );
  const recent = recentActivity(data);

  return (
    <div>
      <section className="page-head">
        <div className="split-actions">
          <div>
            <h1>운영 대시보드</h1>
            <p>
              4회 출석 완료 시 등록 안내 대상이 자동으로 올라옵니다. 데이터는
              이 브라우저에 저장됩니다.
            </p>
          </div>
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              if (confirm("샘플 데이터로 초기화할까요?")) resetAll();
            }}
          >
            샘플 초기화
          </button>
        </div>
      </section>

      <section className="stat-grid">
        <Link href="/payments" className="stat-card danger">
          <span className="stat-label">등록 안내</span>
          <strong>{due.length}명</strong>
          <small>4회 출석 완료</small>
        </Link>
        <Link href="/students" className="stat-card warning">
          <span className="stat-label">잔여 1회</span>
          <strong>{oneLeft.length}명</strong>
          <small>다음 수업 전 안내 추천</small>
        </Link>
        <Link href="/attendance" className="stat-card info">
          <span className="stat-label">오늘 출결</span>
          <strong>{todayAttendance.length}건</strong>
          <small>재원생 {active.length}명</small>
        </Link>
        <Link href="/messages" className="stat-card success">
          <span className="stat-label">문자 기록</span>
          <strong>{data.messages.length}건</strong>
          <small>발송 준비·이력</small>
        </Link>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>등록 안내 대상</h2>
              <p>4회 수업을 모두 사용한 학생입니다.</p>
            </div>
            <Link href="/messages">문자 작성 →</Link>
          </div>
          <div className="simple-list">
            {due.length === 0 ? (
              <div className="empty">현재 등록 안내 대상이 없습니다.</div>
            ) : (
              due.map((student) => (
                <div className="simple-row" key={student.id}>
                  <div>
                    <strong>{student.name}</strong>
                    <span>
                      {student.school || "학교 미입력"} ·{" "}
                      {student.grade || "-"} · {student.className || "-"}
                    </span>
                  </div>
                  <div className="ticket-mini danger-text">
                    {student.usedCount}/{student.packageSize}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>최근 활동</h2>
              <p>출결과 수납 변경 기록입니다.</p>
            </div>
          </div>
          <div className="activity-list">
            {recent.length === 0 ? (
              <div className="empty">아직 활동 기록이 없습니다.</div>
            ) : (
              recent.map((item) => (
                <div className="activity-item" key={item.id}>
                  <span className="activity-dot" />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                  <time>
                    {new Date(item.date).toLocaleString("ko-KR", {
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
