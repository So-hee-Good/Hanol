import {
  CalendarCheck2,
  CreditCard,
  MessageSquareText,
  StickyNote,
} from "lucide-react";
import { formatDateTime } from "@/lib/students";
import { cn } from "@/lib/cn";
import type { TimelineEvent, TimelineEventType } from "@/types/student";

interface StudentTimelineProps {
  events: TimelineEvent[];
}

const eventMeta: Record<
  TimelineEventType,
  {
    label: string;
    icon: typeof CalendarCheck2;
    tone: string;
  }
> = {
  attendance: {
    label: "출석",
    icon: CalendarCheck2,
    tone: "bg-emerald-50 text-emerald-600",
  },
  payment: {
    label: "수납",
    icon: CreditCard,
    tone: "bg-blue-50 text-blue-600",
  },
  consultation: {
    label: "상담",
    icon: MessageSquareText,
    tone: "bg-violet-50 text-violet-600",
  },
  memo: {
    label: "메모",
    icon: StickyNote,
    tone: "bg-amber-50 text-amber-700",
  },
};

export function StudentTimeline({ events }: StudentTimelineProps) {
  const sorted = [...events].sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        최근 활동이 없습니다.
      </p>
    );
  }

  return (
    <ol className="space-y-4">
      {sorted.map((event, index) => {
        const meta = eventMeta[event.type];
        const Icon = meta.icon;

        return (
          <li key={event.id} className="relative flex gap-3">
            {index < sorted.length - 1 && (
              <span className="absolute top-10 left-[1.15rem] h-[calc(100%-0.75rem)] w-px bg-slate-100" />
            )}

            <div
              className={cn(
                "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                meta.tone,
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </div>

            <div className="min-w-0 flex-1 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    {event.title}
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
                    {meta.label}
                  </span>
                </div>
                <time className="text-xs text-slate-400">
                  {formatDateTime(event.occurredAt)}
                </time>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                {event.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
