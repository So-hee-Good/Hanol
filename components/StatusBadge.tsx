import { STATUS_LABELS, type StudentStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: StudentStatus }) {
  return (
    <span className={`badge badge-${status}`}>{STATUS_LABELS[status]}</span>
  );
}
