export type StudentStatus = "active" | "paused";

export type Grade =
  | "중1"
  | "중2"
  | "중3"
  | "고1"
  | "고2"
  | "고3";

export type School =
  | "위례중학교"
  | "세곡중학교"
  | "복정고등학교"
  | "위례고등학교";

export type Course =
  | "수학 정규반"
  | "수학 심화반"
  | "영어 정규반"
  | "영어 회화반"
  | "국어 독해반"
  | "종합 관리반";

export type TimelineEventType =
  | "attendance"
  | "payment"
  | "consultation"
  | "memo";

export interface LessonPackage {
  total: number;
  used: number;
}

export interface StudentContact {
  studentPhone: string;
  parentPhone: string;
  address: string;
}

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  occurredAt: string;
}

export interface Student {
  id: string;
  name: string;
  school: School;
  grade: Grade;
  course: Course;
  status: StudentStatus;
  contact: StudentContact;
  parentName: string;
  lessonPackage: LessonPackage;
  enrolledAt: string;
  timeline: TimelineEvent[];
}

export interface StudentFilters {
  query: string;
  school: School | "all";
  grade: Grade | "all";
  course: Course | "all";
}

export const SCHOOLS: readonly School[] = [
  "위례중학교",
  "세곡중학교",
  "복정고등학교",
  "위례고등학교",
] as const;

export const GRADES: readonly Grade[] = [
  "중1",
  "중2",
  "중3",
  "고1",
  "고2",
  "고3",
] as const;

export const COURSES: readonly Course[] = [
  "수학 정규반",
  "수학 심화반",
  "영어 정규반",
  "영어 회화반",
  "국어 독해반",
  "종합 관리반",
] as const;

export function getRemainingLessons(lessonPackage: LessonPackage): number {
  return Math.max(lessonPackage.total - lessonPackage.used, 0);
}

export function getLessonProgressRatio(lessonPackage: LessonPackage): number {
  if (lessonPackage.total === 0) {
    return 0;
  }

  return Math.min(lessonPackage.used / lessonPackage.total, 1);
}

export function getStudentStatusLabel(status: StudentStatus): "재원생" | "휴원" {
  return status === "active" ? "재원생" : "휴원";
}
