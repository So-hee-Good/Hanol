type PaymentStatusBadgeProps = {
  needsPayment: boolean;
};

export function PaymentStatusBadge({ needsPayment }: PaymentStatusBadgeProps) {
  if (needsPayment) {
    return (
      <span className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-100">
        결제 필요
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
      이용 중
    </span>
  );
}
