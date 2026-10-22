/**
 * Single source of truth for Tambal Ban Mobile operating hours.
 *
 * Schedule: every day, 18.00 -> 05.00 Asia/Jakarta (crosses midnight).
 *   18:00 exactly  => OPEN
 *   05:00 exactly  => CLOSED
 *
 * Asia/Jakarta is a fixed UTC+07:00 offset with no DST, so wall-clock time is
 * derived arithmetically instead of through `Intl`. That keeps the result
 * byte-identical between the Node server and the browser — the usual root
 * cause of clock-related React hydration mismatches in Next.js.
 *
 * NEVER hardcode hours in components — import from here.
 */

/** Asia/Jakarta is UTC+07:00, fixed all year (no DST). */
export const JAKARTA_UTC_OFFSET_MINUTES = 7 * 60;
export const JAKARTA_UTC_OFFSET_MS = JAKARTA_UTC_OFFSET_MINUTES * 60_000;

/** Hour the nightly session starts (inclusive). */
export const OPEN_HOUR = 18;
/** Hour the nightly session ends (exclusive — 05:00 is already closed). */
export const CLOSE_HOUR = 5;

/** 1080 — 18:00 in minutes since midnight. */
export const OPEN_MINUTE_OF_DAY = OPEN_HOUR * 60;
/** 300 — 05:00 in minutes since midnight. */
export const CLOSE_MINUTE_OF_DAY = CLOSE_HOUR * 60;

const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * MINUTE_MS;

/** Closed between 05:00 and 12:00 counts as "the night just ended". */
export const JUST_CLOSED_UNTIL_MINUTE = 12 * 60;

export const HOURS_LABEL = "BUKA SETIAP HARI | 18.00–05.00 WIB";
export const HOURS_LABEL_SHORT = "Setiap hari, pukul 18.00–05.00 WIB";
/** Single-line schedule used under the card description. */
export const HOURS_LINE_LABEL = "Setiap Hari • 18.00–05.00 WIB";
export const OPEN_TIME_LABEL = "18.00 WIB";
export const CLOSE_TIME_LABEL = "05.00 WIB";

export type BusinessState = "open" | "closed";

export interface JakartaTime {
  year: number;
  /** 1-12 */
  month: number;
  /** 1-31 */
  day: number;
  /** 0-23 */
  hours: number;
  /** 0-59 */
  minutes: number;
  /** 0-59 */
  seconds: number;
  /** 0 = Sunday … 6 = Saturday */
  weekday: number;
  /** 0-1439 — minutes since Jakarta midnight. */
  minuteOfDay: number;
  /** 0-86399999 — milliseconds since Jakarta midnight. */
  msOfDay: number;
  /** "YYYY-MM-DD" in Jakarta — stable key for the local calendar day. */
  dayKey: string;
}

export interface BusinessStatus {
  /** True inside 18:00–23:59 and 00:00–04:59. */
  isOpen: boolean;
  state: BusinessState;
  /** 0-1439 — minutes since Jakarta midnight. */
  minuteOfDay: number;
  /** True when closed because the night session just ended (05:00–11:59). */
  justClosed: boolean;
  /** User-facing explanation of what happens next. */
  message: string;
  /** Real timestamp of the next open/closed flip. */
  nextTransitionAt: Date;
  /** Real timestamp of the next 18:00 opening. */
  nextOpeningAt: Date;
}

function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

/**
 * Convert any `Date` into Asia/Jakarta wall-clock fields.
 *
 * Pass an explicit `date` in tests; the default reads the real clock.
 */
export function getJakartaTime(date: Date = new Date()): JakartaTime {
  const shifted = new Date(date.getTime() + JAKARTA_UTC_OFFSET_MS);
  const msOfDay = ((shifted.getTime() % DAY_MS) + DAY_MS) % DAY_MS;
  const hours = shifted.getUTCHours();
  const minutes = shifted.getUTCMinutes();
  const seconds = shifted.getUTCSeconds();
  const year = shifted.getUTCFullYear();
  const month = shifted.getUTCMonth() + 1;
  const day = shifted.getUTCDate();

  return {
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    weekday: shifted.getUTCDay(),
    minuteOfDay: hours * 60 + minutes,
    msOfDay,
    dayKey: `${year}-${pad(month)}-${pad(day)}`,
  };
}

/**
 * Core rule: `isOpen = time >= 18:00 OR time < 05:00`.
 *
 * Comparing on `minuteOfDay` (not on hours alone) is what makes the
 * midnight-crossing window behave correctly:
 *   04.59 -> 299  -> open
 *   05.00 -> 300  -> closed
 *   17.59 -> 1079 -> closed
 *   18.00 -> 1080 -> open
 *   00.00 -> 0    -> open
 */
export function isOpenAtMinute(minuteOfDay: number): boolean {
  return minuteOfDay >= OPEN_MINUTE_OF_DAY || minuteOfDay < CLOSE_MINUTE_OF_DAY;
}

/** Milliseconds remaining until the next 18:00 opening. */
export function getMsUntilNextOpen(date: Date = new Date()): number {
  return getNextOpeningTime(date).getTime() - date.getTime();
}

/** Real timestamp of the next 18:00 opening (today or tomorrow). */
export function getNextOpeningTime(date: Date = new Date()): Date {
  const jakarta = getJakartaTime(date);
  const dayStart = date.getTime() - jakarta.msOfDay;
  const openOffset = jakarta.msOfDay < OPEN_MINUTE_OF_DAY * MINUTE_MS ? 0 : DAY_MS;
  return new Date(dayStart + openOffset + OPEN_MINUTE_OF_DAY * MINUTE_MS);
}

/** Real timestamp of the next state flip (either 05:00 or 18:00). */
export function getNextTransitionTime(date: Date = new Date()): Date {
  const jakarta = getJakartaTime(date);
  const dayStart = date.getTime() - jakarta.msOfDay;
  const closeMs = CLOSE_MINUTE_OF_DAY * MINUTE_MS;
  const openMs = OPEN_MINUTE_OF_DAY * MINUTE_MS;

  let targetOffsetMs: number;
  if (jakarta.msOfDay < closeMs) {
    // 00:00–04:59 — still open, closes at 05:00 today.
    targetOffsetMs = closeMs;
  } else if (jakarta.msOfDay < openMs) {
    // 05:00–17:59 — closed, opens at 18:00 today.
    targetOffsetMs = openMs;
  } else {
    // 18:00–23:59 — open, closes at 05:00 tomorrow.
    targetOffsetMs = DAY_MS + closeMs;
  }

  return new Date(dayStart + targetOffsetMs);
}

/** Milliseconds until the open/closed state flips. Never negative. */
export function getMsUntilNextTransition(date: Date = new Date()): number {
  return Math.max(0, getNextTransitionTime(date).getTime() - date.getTime());
}

/** Full operating status for a given instant (defaults to the real clock). */
export function getBusinessStatus(date: Date = new Date()): BusinessStatus {
  const jakarta = getJakartaTime(date);
  const isOpen = isOpenAtMinute(jakarta.minuteOfDay);

  const justClosed =
    !isOpen &&
    jakarta.minuteOfDay >= CLOSE_MINUTE_OF_DAY &&
    jakarta.minuteOfDay < JUST_CLOSED_UNTIL_MINUTE;

  // Copy is driven purely by the live state so both placements (hero badge
  // and operating-hours card) can never disagree.
  const message = isOpen
    ? `Kami siap membantu hingga pukul ${CLOSE_TIME_LABEL}.`
    : `Layanan tutup sementara. Kami buka kembali pukul ${OPEN_TIME_LABEL}.`;

  return {
    isOpen,
    state: isOpen ? "open" : "closed",
    minuteOfDay: jakarta.minuteOfDay,
    justClosed,
    message,
    nextTransitionAt: getNextTransitionTime(date),
    nextOpeningAt: getNextOpeningTime(date),
  };
}
