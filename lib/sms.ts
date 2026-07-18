import type { SmsTemplateKey, Student } from "./types";

export interface SmsTemplate {
  key: SmsTemplateKey;
  label: string;
  description: string;
  body: string;
}

export const SMS_TEMPLATES: SmsTemplate[] = [
  {
    key: "renewal",
    label: "등록 안내",
    description: "4회권 소진 후 재등록 안내",
    body: "[HANOL] {학생이름} 학생의 4회 수업이 모두 완료되었습니다. 새로운 4회권 등록을 안내드립니다. 문의: 학원으로 연락 부탁드립니다.",
  },
  {
    key: "attendance",
    label: "출석 안내",
    description: "당일 출석 확인 문자",
    body: "[HANOL] {학생이름} 학생이 오늘 수업에 출석하였습니다. 남은 회차: {남은회차}회",
  },
  {
    key: "absent",
    label: "결석 안내",
    description: "결석 확인 문자",
    body: "[HANOL] {학생이름} 학생이 오늘 수업에 결석하였습니다. 보강이 필요하시면 연락 주세요.",
  },
  {
    key: "custom",
    label: "직접 작성",
    description: "자유 문구",
    body: "[HANOL] {학생이름} 학부모님께 안내드립니다. ",
  },
];

export function renderSmsBody(template: string, student: Student): string {
  return template
    .replaceAll("{학생이름}", student.name)
    .replaceAll("{남은회차}", String(student.remainingSessions))
    .replaceAll("{학년}", student.grade || "-");
}

export function getTemplate(key: SmsTemplateKey): SmsTemplate {
  return SMS_TEMPLATES.find((t) => t.key === key) ?? SMS_TEMPLATES[3];
}
