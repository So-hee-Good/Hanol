import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  getLessonProgressRatio,
  getRemainingLessons,
  type LessonPackage,
} from "@/types/student";

interface StudentProgressProps {
  lessonPackage: LessonPackage;
  compact?: boolean;
}

export function StudentProgress({
  lessonPackage,
  compact = false,
}: StudentProgressProps) {
  const remaining = getRemainingLessons(lessonPackage);
  const ratio = getLessonProgressRatio(lessonPackage);
  const isWarning = remaining === 1;
  const isComplete = remaining === 0;

  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      <div className="flex items-end justify-between gap-3">
        <div>
          {!compact && (
            <p className="text-sm font-medium text-slate-500">수업권 진행</p>
          )}
          <p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900">
            {lessonPackage.used}
            <span className="text-slate-400"> / </span>
            {lessonPackage.total}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">남은 수업</p>
          <p
            className={cn(
              "text-lg font-semibold",
              isComplete && "text-red-600",
              isWarning && "text-orange-500",
              !isComplete && !isWarning && "text-blue-600",
            )}
          >
            {remaining}
          </p>
        </div>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isComplete && "bg-red-500",
            isWarning && "bg-orange-400",
            !isComplete && !isWarning && "bg-blue-600",
          )}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>

      {(isWarning || isComplete) && (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
            isWarning && "bg-orange-50 text-orange-600",
            isComplete && "bg-red-50 text-red-600",
          )}
        >
          {isWarning ? (
            <>
              <AlertTriangle className="h-3.5 w-3.5" />
              잔여 1회 · 재등록 권장
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              완료 · 안내 필요
            </>
          )}
        </div>
      )}
    </div>
  );
}
