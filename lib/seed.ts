import { SESSION_LIMIT, type AppData, type Student } from "./types";

function id(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export function createSeedData(): AppData {
  const now = new Date().toISOString();

  const students: Student[] = [
    {
      id: id("stu"),
      name: "김서연",
      phone: "010-1111-2222",
      parentPhone: "010-3333-4444",
      grade: "초3",
      memo: "화·목 16:00",
      status: "active",
      usedCount: 1,
      packageSize: SESSION_LIMIT,
      paymentStatus: "normal",
      lastPaymentAt: daysAgo(20),
      createdAt: daysAgo(20),
      updatedAt: now,
    },
    {
      id: id("stu"),
      name: "이준호",
      phone: "010-5555-6666",
      parentPhone: "010-7777-8888",
      grade: "초5",
      memo: "월·수 17:00",
      status: "active",
      usedCount: SESSION_LIMIT,
      packageSize: SESSION_LIMIT,
      paymentStatus: "due",
      lastPaymentAt: daysAgo(35),
      createdAt: daysAgo(35),
      updatedAt: daysAgo(1),
    },
    {
      id: id("stu"),
      name: "박민지",
      phone: "010-9999-0000",
      parentPhone: "010-1212-3434",
      grade: "중1",
      memo: "토 10:00",
      status: "active",
      usedCount: 3,
      packageSize: SESSION_LIMIT,
      paymentStatus: "normal",
      lastPaymentAt: daysAgo(12),
      createdAt: daysAgo(12),
      updatedAt: now,
    },
    {
      id: id("stu"),
      name: "최하은",
      phone: "010-4545-6767",
      parentPhone: "010-8989-0101",
      grade: "초4",
      memo: "휴원 예정",
      status: "paused",
      usedCount: 2,
      packageSize: SESSION_LIMIT,
      paymentStatus: "normal",
      lastPaymentAt: daysAgo(40),
      createdAt: daysAgo(40),
      updatedAt: daysAgo(3),
    },
  ];

  return {
    students,
    attendance: [
      {
        id: id("att"),
        studentId: students[0].id,
        studentName: students[0].name,
        date: daysAgo(2).slice(0, 10),
        type: "present",
        counted: true,
        note: "",
        createdAt: daysAgo(2),
      },
      {
        id: id("att"),
        studentId: students[1].id,
        studentName: students[1].name,
        date: daysAgo(1).slice(0, 10),
        type: "present",
        counted: true,
        note: "4회차 완료",
        createdAt: daysAgo(1),
      },
    ],
    payments: [],
    smsHistory: [],
  };
}
