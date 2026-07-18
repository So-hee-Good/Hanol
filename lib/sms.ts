import {
  remainingSessions,
  type SmsTemplateKey,
  type Student,
} from "./types";

export const templates: Record<SmsTemplateKey, string> = {
  payment:
    "[한올국어학원] {학생이름} 학생의 수업권({패키지}회)이 모두 완료되었습니다. 새로운 수업권 등록을 안내드립니다. 문의 부탁드립니다.",
  oneLeft:
    "[한올국어학원] {학생이름} 학생의 수업권이 1회 남았습니다. 다음 수업 전 등록 일정을 확인해 주세요. 잔여 {남은회차}회",
  absence:
    "[한올국어학원] {학생이름} 학생이 오늘 수업에 결석하였습니다. 보강이 필요하시면 학원으로 연락 주세요.",
};

export const SMS_TEMPLATES = (
  Object.keys(templates) as SmsTemplateKey[]
).map((key) => ({
  key,
  label:
    key === "payment"
      ? "4회 완료 등록 안내"
      : key === "oneLeft"
        ? "잔여 1회 사전 안내"
        : "결석 안내",
  description: templates[key],
  body: templates[key],
}));

export function renderSmsBody(template: string, student: Student): string {
  return template
    .replaceAll("{학생이름}", student.name)
    .replaceAll("{남은회차}", String(remainingSessions(student)))
    .replaceAll("{사용회차}", String(student.usedCount))
    .replaceAll("{패키지}", String(student.packageSize))
    .replaceAll("{학년}", student.grade || "-")
    .replaceAll("{수강반}", student.className || "-");
}

export function getTemplate(key: SmsTemplateKey): string {
  return templates[key] ?? templates.payment;
}
