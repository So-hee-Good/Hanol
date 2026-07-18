import {
  PAYMENT_LABELS,
  STATUS_LABELS,
  needsRenewal,
  type Student,
  type StudentStatus,
} from "@/lib/types";

export function StatusBadge({
  status,
  student,
}: {
  status?: StudentStatus;
  student?: Student;
}) {
  if (student && needsRenewal(student)) {
    return (
      <span className="badge badge-renewal_needed">{PAYMENT_LABELS.due}</span>
    );
  }

  const value = student?.status ?? status ?? "active";
  return (
    <span className={`badge badge-${value}`}>{STATUS_LABELS[value]}</span>
  );
}
