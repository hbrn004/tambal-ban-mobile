"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

import {
  HOURS_LABEL,
  HOURS_LABEL_SHORT,
  getBusinessStatus,
  getMsUntilNextTransition,
  type BusinessStatus,
} from "@/lib/business-hours";

export type OperatingStatusVariant = "badge" | "card";
export type OperatingStatusTone = "dark" | "light";

type StatusState = "open" | "closed" | "loading";

/** Hard ceiling on how long we sleep before re-reading the clock. Protects
 *  against a device that was asleep/throttled when the boundary fired. */
const MAX_SLEEP_MS = 30 * 60 * 1000;
const MIN_SLEEP_MS = 1000;
/** Wake slightly after the boundary so we never sample a hair before it. */
const BOUNDARY_BUFFER_MS = 250;

const LABELS: Record<StatusState, string> = {
  open: "SEDANG BUKA",
  closed: "SEDANG TUTUP",
  loading: "MEMUAT STATUS",
};

/**
 * Live operating status, recomputed from the browser clock.
 *
 * Starts as `null` so the server HTML and the first client render are
 * identical (no hydration mismatch on a clock-derived value). The real
 * status is applied in an effect, then refreshed only when the schedule
 * boundary is reached, the tab becomes visible, or the window regains focus.
 */
function useBusinessStatus(): BusinessStatus | null {
  const [status, setStatus] = useState<BusinessStatus | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    const sync = () => {
      if (disposed) return;

      const next = getBusinessStatus();

      // Keep the previous object when nothing user-visible changed, so React
      // can skip the re-render entirely.
      setStatus((prev) =>
        prev && prev.state === next.state && prev.message === next.message ? prev : next,
      );

      if (timer) clearTimeout(timer);
      const delay = Math.min(getMsUntilNextTransition(), MAX_SLEEP_MS);
      timer = setTimeout(sync, Math.max(MIN_SLEEP_MS, delay + BOUNDARY_BUFFER_MS));
    };

    const syncWhenVisible = () => {
      if (document.visibilityState === "visible") sync();
    };

    sync();
    document.addEventListener("visibilitychange", syncWhenVisible);
    window.addEventListener("focus", sync);

    return () => {
      disposed = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", syncWhenVisible);
      window.removeEventListener("focus", sync);
    };
  }, []);

  return status;
}

function StatusBadge({
  state,
  tone,
  className = "",
}: {
  state: StatusState;
  tone: OperatingStatusTone;
  className?: string;
}) {
  return (
    <span
      className={`status-shell px-3 py-1.5 ${className}`}
      data-state={state}
      data-tone={tone}
    >
      <span className="status-dot" aria-hidden="true" />
      {/* Fixed min width: swapping MEMUAT STATUS -> SEDANG TUTUP must not
          shift the surrounding layout. */}
      <span className="status-fade min-w-[124px] text-xs font-bold tracking-wide whitespace-nowrap">
        {LABELS[state]}
      </span>
      <span
        className="hidden h-3 w-px bg-current opacity-20 sm:block"
        aria-hidden="true"
      />
      <span className="hidden text-[11px] font-semibold whitespace-nowrap opacity-85 sm:block">
        {HOURS_LABEL}
      </span>
      <span className="text-[10px] font-semibold whitespace-nowrap opacity-85 sm:hidden">
        18.00–05.00 WIB
      </span>
    </span>
  );
}

export default function OperatingStatus({
  variant = "badge",
  tone = "dark",
  className = "",
}: {
  variant?: OperatingStatusVariant;
  tone?: OperatingStatusTone;
  className?: string;
}) {
  const status = useBusinessStatus();
  const state: StatusState = status ? status.state : "loading";
  const message = status?.message ?? `Memeriksa jam operasional…`;

  if (variant === "badge") {
    return (
      <div className={className} role="status" aria-live="polite">
        <StatusBadge state={state} tone={tone} />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-md md:p-7">
      <div
        className="status-aura -top-10 -right-8 h-32 w-32"
        data-state={state}
        aria-hidden="true"
      />
      <div className="relative flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
          <Clock className="h-5 w-5 text-red-600" />
        </div>
        <div className="min-w-0">
          <h3 className="mb-2 text-sm font-bold text-gray-900 md:text-base">
            Jam Operasional
          </h3>
          <div role="status" aria-live="polite">
            <StatusBadge state={state} tone={tone} />
            <p
              key={state}
              className="status-fade mt-2 min-h-[2.5rem] text-xs leading-relaxed text-gray-500"
            >
              {message}
            </p>
          </div>
          <p className="mt-1 text-sm font-semibold text-gray-900">{HOURS_LABEL_SHORT}</p>
        </div>
      </div>
    </div>
  );
}
