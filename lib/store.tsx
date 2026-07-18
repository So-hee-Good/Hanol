"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyTicketDelta,
  completePayment,
  createStudent,
  updateStudent,
  wouldCountAttendance,
  type StudentInput,
} from "./logic";
import { loadData, resetData, saveData } from "./storage";
import type {
  AppData,
  AttendanceType,
  MessageRecord,
  MessageRecipient,
  Student,
  StudentStatus,
} from "./types";

interface StoreValue {
  ready: boolean;
  data: AppData;
  addStudent: (input: StudentInput) => void;
  editStudent: (id: string, patch: Partial<StudentInput>) => void;
  removeStudent: (id: string) => void;
  markAttendance: (
    studentId: string,
    type: AttendanceType,
    date: string,
    note?: string
  ) => void;
  markPayment: (studentId: string, amount?: number, note?: string) => void;
  saveMessage: (input: {
    studentId: string;
    recipient: MessageRecipient;
    phone: string;
    body: string;
    status?: MessageRecord["status"];
  }) => MessageRecord | null;
  resetAll: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<AppData>({
    students: [],
    attendance: [],
    payments: [],
    messages: [],
  });

  useEffect(() => {
    setData(loadData());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveData(data);
  }, [data, ready]);

  const addStudent = useCallback((input: StudentInput) => {
    setData((prev) => ({
      ...prev,
      students: [createStudent(input), ...prev.students],
    }));
  }, []);

  const editStudent = useCallback(
    (id: string, patch: Partial<StudentInput>) => {
      setData((prev) => ({
        ...prev,
        students: prev.students.map((s) =>
          s.id === id ? updateStudent(s, patch) : s
        ),
      }));
    },
    []
  );

  const removeStudent = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== id),
    }));
  }, []);

  const markAttendance = useCallback(
    (studentId: string, status: AttendanceType, date: string, note = "") => {
      setData((data) => {
        const current = data.students.find((s) => s.id === studentId);
        if (!current) return data;

        const existing = data.attendance.find(
          (item) => item.studentId === studentId && item.date === date
        );
        if (existing && existing.status === status) return data;

        const wasCounted = existing?.counted ?? false;
        const baseline = wasCounted
          ? applyTicketDelta(current, -1)
          : current;
        const counted = wouldCountAttendance(baseline, status);
        const nextStudent = counted
          ? applyTicketDelta(baseline, 1)
          : baseline;

        const record = {
          id: existing?.id ?? `att_${Date.now().toString(36)}`,
          studentId,
          studentName: current.name,
          date,
          status,
          counted,
          note: note.trim(),
          createdAt: existing?.createdAt ?? new Date().toISOString(),
        };

        const attendance = existing
          ? data.attendance.map((item) =>
              item.id === existing.id ? record : item
            )
          : [record, ...data.attendance];

        return {
          ...data,
          students: data.students.map((student) =>
            student.id === studentId ? nextStudent : student
          ),
          attendance,
        };
      });
    },
    []
  );

  const markPayment = useCallback(
    (studentId: string, amount?: number, note = "") => {
      setData((data) => {
        const student = data.students.find((s) => s.id === studentId);
        if (!student) return data;
        const { payment } = completePayment(student, amount, note);

        return {
          ...data,
          students: data.students.map((item) =>
            item.id === studentId
              ? {
                  ...item,
                  usedCount: 0,
                  paymentStatus: "normal" as const,
                  lastPaymentAt: payment.paidAt,
                  updatedAt: payment.paidAt,
                }
              : item
          ),
          payments: [payment, ...data.payments],
        };
      });
    },
    []
  );

  const saveMessage = useCallback(
    (input: {
      studentId: string;
      recipient: MessageRecipient;
      phone: string;
      body: string;
      status?: MessageRecord["status"];
    }): MessageRecord | null => {
      const student = data.students.find((s) => s.id === input.studentId);
      if (!student) return null;

      const now = new Date().toISOString();
      const item: MessageRecord = {
        id: `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        studentId: input.studentId,
        studentName: student.name,
        recipient: input.recipient,
        phone: input.phone.trim(),
        body: input.body.trim(),
        status: input.status ?? "prepared",
        sentAt: now,
        createdAt: now,
      };

      setData((prev) => ({
        ...prev,
        messages: [item, ...prev.messages],
      }));

      return item;
    },
    [data.students]
  );

  const resetAll = useCallback(() => {
    setData(resetData());
  }, []);

  const value = useMemo(
    () => ({
      ready,
      data,
      addStudent,
      editStudent,
      removeStudent,
      markAttendance,
      markPayment,
      saveMessage,
      resetAll,
    }),
    [
      ready,
      data,
      addStudent,
      editStudent,
      removeStudent,
      markAttendance,
      markPayment,
      saveMessage,
      resetAll,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export type { Student, StudentStatus };
