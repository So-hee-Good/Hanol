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
  applyAttendance,
  completePayment,
  createStudent,
  updateStudent,
} from "./logic";
import { loadData, resetData, saveData } from "./storage";
import { getTemplate, renderSmsBody } from "./sms";
import type {
  AppData,
  AttendanceType,
  SmsHistoryItem,
  SmsTemplateKey,
  Student,
  StudentStatus,
} from "./types";

interface StoreValue {
  ready: boolean;
  data: AppData;
  addStudent: (input: {
    name: string;
    phone: string;
    parentPhone: string;
    grade: string;
    memo?: string;
  }) => void;
  editStudent: (
    id: string,
    patch: Partial<
      Pick<Student, "name" | "phone" | "parentPhone" | "grade" | "memo" | "status">
    >
  ) => void;
  removeStudent: (id: string) => void;
  markAttendance: (
    studentId: string,
    type: AttendanceType,
    date: string,
    note?: string
  ) => void;
  markPayment: (studentId: string, amount: number, note?: string) => void;
  sendSms: (
    templateKey: SmsTemplateKey,
    studentIds: string[],
    customBody?: string
  ) => SmsHistoryItem | null;
  resetAll: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<AppData>({
    students: [],
    attendance: [],
    payments: [],
    smsHistory: [],
  });

  useEffect(() => {
    setData(loadData());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveData(data);
  }, [data, ready]);

  const addStudent = useCallback(
    (input: {
      name: string;
      phone: string;
      parentPhone: string;
      grade: string;
      memo?: string;
    }) => {
      setData((prev) => ({
        ...prev,
        students: [createStudent(input), ...prev.students],
      }));
    },
    []
  );

  const editStudent = useCallback(
    (
      id: string,
      patch: Partial<
        Pick<Student, "name" | "phone" | "parentPhone" | "grade" | "memo" | "status">
      >
    ) => {
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
    (studentId: string, type: AttendanceType, date: string, note = "") => {
      setData((data) => {
        const current = data.students.find((s) => s.id === studentId);
        if (!current) return data;

        const { record } = applyAttendance(current, type, date, note);
        const counted = record.counted;

        const students = data.students.map((student) => {
          if (student.id !== studentId || !counted) return student;
          const nextUsed = Math.min(
            student.usedCount + 1,
            student.packageSize
          );
          return {
            ...student,
            usedCount: nextUsed,
            paymentStatus:
              nextUsed >= student.packageSize ? "due" : student.paymentStatus,
            updatedAt: record.createdAt,
          };
        });

        return {
          ...data,
          students,
          attendance: [record, ...data.attendance],
        };
      });
    },
    []
  );

  const markPayment = useCallback(
    (studentId: string, amount: number, note = "") => {
      setData((prev) => {
        const student = prev.students.find((s) => s.id === studentId);
        if (!student) return prev;
        const { student: next, payment } = completePayment(
          student,
          amount,
          note
        );
        return {
          ...prev,
          students: prev.students.map((s) => (s.id === studentId ? next : s)),
          payments: [payment, ...prev.payments],
        };
      });
    },
    []
  );

  const sendSms = useCallback(
    (
      templateKey: SmsTemplateKey,
      studentIds: string[],
      customBody?: string
    ): SmsHistoryItem | null => {
      const template = getTemplate(templateKey);
      const targets = data.students.filter((s) => studentIds.includes(s.id));
      if (targets.length === 0) return null;

      const bodySource = customBody?.trim() || template.body;
      const previewBody = renderSmsBody(bodySource, targets[0]);

      const item: SmsHistoryItem = {
        id: `sms_${Date.now().toString(36)}`,
        templateKey,
        templateLabel: template.label,
        body: previewBody,
        recipients: targets.map((s) => ({
          studentId: s.id,
          name: s.name,
          phone: s.parentPhone || s.phone,
        })),
        sentAt: new Date().toISOString(),
        status: "queued",
      };

      setData((prev) => ({
        ...prev,
        smsHistory: [item, ...prev.smsHistory],
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
      sendSms,
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
      sendSms,
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

export type { StudentStatus };
