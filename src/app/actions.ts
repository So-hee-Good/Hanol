"use server";

import { revalidatePath } from "next/cache";
import {
  createStudent,
  recordAttendance,
  renewPackage,
  resetStore,
} from "@/lib/store";

export type ActionResult = {
  ok: boolean;
  message: string;
  studentId?: string;
};

export async function createStudentAction(
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const parentName = String(formData.get("parentName") ?? "").trim();
  const parentPhone = String(formData.get("parentPhone") ?? "").trim();
  const school = String(formData.get("school") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim();
  const course = String(formData.get("course") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!name) {
    return { ok: false, message: "이름을 입력하세요." };
  }

  try {
    const student = await createStudent({
      name,
      phone,
      parentName,
      parentPhone,
      school,
      grade,
      course,
      address,
      note,
    });
    revalidatePath("/");
    revalidatePath("/students");
    revalidatePath(`/students/${student.id}`);
    return {
      ok: true,
      message: "학생이 등록되었고 4회 수업 패키지가 발급되었습니다.",
      studentId: student.id,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "등록에 실패했습니다.",
    };
  }
}

export async function recordAttendanceAction(
  studentId: string,
  formData?: FormData,
): Promise<ActionResult> {
  const note = String(formData?.get("note") ?? "").trim();

  try {
    const { student } = await recordAttendance({ studentId, note });
    revalidatePath("/");
    revalidatePath("/students");
    revalidatePath(`/students/${studentId}`);

    if (student.needsPayment) {
      return {
        ok: true,
        message: "출석 처리됨. 수업 4회를 모두 사용해 결제가 필요합니다.",
        studentId,
      };
    }

    return {
      ok: true,
      message: `출석 처리됨. 남은 수업 ${student.remainingSessions}회.`,
      studentId,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "출석 처리에 실패했습니다.",
    };
  }
}

export async function renewPackageAction(
  studentId: string,
): Promise<ActionResult> {
  try {
    await renewPackage({ studentId });
    revalidatePath("/");
    revalidatePath("/students");
    revalidatePath(`/students/${studentId}`);
    return {
      ok: true,
      message: "결제 완료. 새 4회 수업 패키지가 등록되었습니다.",
      studentId,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "패키지 등록에 실패했습니다.",
    };
  }
}

export async function resetDemoDataAction(): Promise<ActionResult> {
  await resetStore();
  revalidatePath("/");
  revalidatePath("/students");
  return { ok: true, message: "데모 데이터를 초기화했습니다." };
}
