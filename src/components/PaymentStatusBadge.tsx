type PaymentStatusBadgeProps = {
  needsPayment: boolean;
};

export function PaymentStatusBadge({ needsPayment }: PaymentStatusBadgeProps) {
  if (needsPayment) {
    return (
      <span className="inline-flex items-center rounded-md bg-[var(--alert-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--alert)]">
        결제 필요
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md bg-[var(--ok-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--ok)]">
      이용 중
    </span>
  );
}
