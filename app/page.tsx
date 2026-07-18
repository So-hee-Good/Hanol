"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { dashboardStats } from "@/lib/logic";
import { useStore } from "@/lib/store";

export default function DashboardPage() {
  const { ready, data, resetAll } = useStore();

  if (!ready) {
    return <p className="muted">불러오는 중…</p>;
  }

  const stats = dashboardStats(data.students, data.attendance);
  const renewal = data.students.filter((s) => s.status === "renewal_needed");
  const recent = data.attendance.slice(0, 5);

  return (
    <>
      <section className="page-head">
        <h1>HANOL Manager</h1>
        <p>
          브라우저에 저장되는 Sprint 1 MVP입니다. 학생·출결·4회권 차감·수납·문자
          대상을 한곳에서 관리합니다.
        </p>
      </section>

      <div className="stats">
        <div className="stat">
          <span className="label">전체 학생</span>
          <span className="value">{stats.total}</span>
        </div>
        <div className="stat">
          <span className="label">수강중</span>
          <span className="value">{stats.active}</span>
        </div>
        <div className="stat">
          <span className="label">등록 안내 필요</span>
          <span className="value">{stats.renewalNeeded}</span>
        </div>
        <div className="stat">
          <span className="label">오늘 출결</span>
          <span className="value">{stats.todayAttendance}</span>
        </div>
        <div className="stat">
          <span className="label">잔여 1회 이하</span>
          <span className="value">{stats.lowSessions}</span>
        </div>
      </div>

      <div className="two-col">
        <section className="panel">
          <div className="split-actions">
            <h2>등록 안내가 필요한 학생</h2>
            <Link href="/sms" className="btn sm accent">
              문자 보내기
            </Link>
          </div>
          {renewal.length === 0 ? (
            <p className="empty">현재 대상 학생이 없습니다.</p>
          ) : (
            <ul className="list-plain">
              {renewal.map((s) => (
                <li key={s.id}>
                  <div>
                    <strong>{s.name}</strong>
                    <div className="muted">
                      {s.grade || "학년 미입력"} · 잔여 {s.remainingSessions}회
                    </div>
                  </div>
                  <StatusBadge status={s.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <div className="split-actions">
            <h2>최근 출결</h2>
            <Link href="/attendance" className="btn sm ghost">
              출결 입력
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="empty">출결 기록이 없습니다.</p>
          ) : (
            <ul className="list-plain">
              {recent.map((a) => (
                <li key={a.id}>
                  <div>
                    <strong>{a.studentName}</strong>
                    <div className="muted">
                      {a.date} ·{" "}
                      {a.type === "present"
                        ? "출석"
                        : a.type === "absent"
                          ? "결석"
                          : "보강"}
                      {a.deducted ? " · 회차 차감" : ""}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="panel" style={{ marginTop: "1rem" }}>
        <div className="split-actions">
          <div>
            <h2>빠른 이동</h2>
            <p className="muted">데이터는 이 브라우저의 localStorage에 저장됩니다.</p>
          </div>
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              if (confirm("샘플 데이터로 초기화할까요?")) resetAll();
            }}
          >
            샘플 데이터 초기화
          </button>
        </div>
        <div className="row-actions" style={{ marginTop: "0.75rem" }}>
          <Link href="/students" className="btn primary">
            학생 관리
          </Link>
          <Link href="/attendance" className="btn ghost">
            출결 입력
          </Link>
          <Link href="/sms" className="btn ghost">
            문자 대상
          </Link>
        </div>
      </section>
    </>
  );
}
