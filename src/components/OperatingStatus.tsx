"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

import {
  HOURS_LABEL,
  HOURS_LINE_LABEL,
  getBusinessStatus,
  getMsUntilNextTransition,
  type BusinessStatus,
} from "@/lib/business-hours";

export type OperatingStatusVariant = "hero" | "card";
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

/** Compact hours shown inside the pill on narrow screens. */
const HOURS_COMPACT = "18.00–05.00 WIB";

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
      // can skip the re-render (and the entrance animation stays put).
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
  fullWidth = false,
  fullHours = true,
}: {
  state: StatusState;
  tone: OperatingStatusTone;
  /** Stretch the pill to the full content width (card layout). */
  fullWidth?: boolean;
  /** Show the long schedule label next to the state (hero layout). */
  fullHours?: boolean;
}) {
  return (
    <span
      className={`status-shell px-3 py-1.5 ${fullWidth ? "w-full" : ""}`}
      data-state={state}
      data-tone={tone}
    >
      {/* Keyed by state so the sweep remounts (and replays) once per flip. */}
      <span key={state} className="status-sheen" aria-hidden="true" />

      <span className="status-content">
        <span className="status-dot" aria-hidden="true" />
        <span className="min-w-[96px] text-center text-[11px] font-bold tracking-wide whitespace-nowrap sm:min-w-[124px] sm:text-xs">
          {LABELS[state]}
        </span>
        <span className="h-3 w-px shrink-0 bg-current opacity-20" aria-hidden="true" />

        {fullHours ? (
          <>
            <span className="hidden text-[11px] font-semibold whitespace-nowrap opacity-85 sm:block">
              {HOURS_LABEL}
            </span>
            <span className="text-[9px] font-semibold whitespace-nowrap opacity-85 sm:hidden">
              {HOURS_COMPACT}
            </span>
          </>
        ) : (
          <span className="text-[9px] font-semibold whitespace-nowrap opacity-85 sm:text-[11px]">
            {HOURS_COMPACT}
          </span>
        )}
      </span>
    </span>
  );
}

/**
 * Animated status copy.
 *
 * The inner span is keyed by `state`, so `.status-desc-text` is remounted —
 * and its fade-up replayed — only when the open/closed state actually flips,
 * never on an incidental parent re-render.
 */
function StatusDescription({
  state,
  tone,
  message,
  className = "",
}: {
  state: StatusState;
  tone: OperatingStatusTone;
  message: string;
  className?: string;
}) {
  return (
    <p className={`status-desc ${className}`} data-state={state} data-tone={tone}>
      <span key={state} className="status-desc-text">
        {message}
      </span>
    </p>
  );
}

export default function OperatingStatus({
  variant = "hero",
  tone = "dark",
  className = "",
}: {
  variant?: OperatingStatusVariant;
  tone?: OperatingStatusTone;
  className?: string;
}) {
  const status = useBusinessStatus();
  const state: StatusState = status ? status.state : "loading";
  const message = status?.message ?? "Memeriksa jam operasional…";

  if (variant === "hero") {
    return (
      <div
        className={`flex flex-col items-center gap-2.5 md:items-start ${className}`}
        role="status"
        aria-live="polite"
      >
        <StatusBadge state={state} tone={tone} />
        <StatusDescription
          state={state}
          tone={tone}
          message={message}
          className="max-w-[34ch] px-2 text-center text-xs leading-relaxed sm:text-sm md:text-left"
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-md md:p-7">
      <div
        className="status-aura -top-14 left-1/2 h-32 w-44 -translate-x-1/2"
        data-state={state}
        aria-hidden="true"
      />

      <div
        className="relative flex flex-col items-center gap-3 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
          <Clock className="h-5 w-5 text-red-600" />
        </div>

        <h3 className="text-sm font-bold text-gray-900 md:text-base">Jam Operasional</h3>

        <StatusBadge state={state} tone={tone} fullWidth fullHours={false} />

        <StatusDescription
          state={state}
          tone={tone}
          message={message}
          className="max-w-[34ch] text-xs leading-relaxed sm:text-sm"
        />

        <p className="text-xs font-semibold tracking-wide text-gray-900 sm:text-sm">
          {HOURS_LINE_LABEL}
        </p>
      </div>
    </div>
  );
}
