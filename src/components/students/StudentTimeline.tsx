import { CalendarCheck2, CreditCard } from "lucide-react";
import { cn, formatDateTime } from "@/lib/cn";
import type { TimelineEvent } from "@/lib/types";

export function StudentTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-500">
        아직 기록이 없습니다.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {events.map((event) => {
        const Icon = event.type === "attendance" ? CalendarCheck2 : CreditCard;
        return (
          <li key={event.id} className="flex gap-3">
            <div
              className={cn(
                "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                event.type === "attendance"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-teal-50 text-teal-700",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  {event.title}
                </p>
                <p className="text-xs text-slate-400">
                  {formatDateTime(event.occurredAt)}
                </p>
              </div>
              <p className="mt-0.5 text-sm text-slate-500">{event.description}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
