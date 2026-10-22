/**
 * Tests for the operating-hours source of truth.
 * Run: npm test
 *
 * The clock is faked by injecting an explicit `Date` — no waiting for real
 * business hours, and every case is deterministic regardless of when CI runs.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  OPEN_HOUR,
  CLOSE_HOUR,
  OPEN_MINUTE_OF_DAY,
  CLOSE_MINUTE_OF_DAY,
  HOURS_LABEL_SHORT,
  getJakartaTime,
  isOpenAtMinute,
  getBusinessStatus,
  getNextOpeningTime,
  getNextTransitionTime,
  getMsUntilNextTransition,
  getMsUntilNextOpen,
} from "../src/lib/business-hours.ts";

/**
 * Build a real Date whose Asia/Jakarta wall clock is `h:m` on 10 Mar 2026.
 * Jakarta is UTC+7, so the UTC instant is `h - 7` (negative hours roll back
 * to the previous UTC day automatically).
 */
function jakartaAt(hours: number, minutes = 0, day = 10): Date {
  return new Date(Date.UTC(2026, 2, day, hours - 7, minutes, 0, 0));
}

/** Same, but on the following Jakarta calendar day (11 Mar 2026). */
function jakartaAtNextDay(hours: number, minutes = 0): Date {
  return jakartaAt(hours, minutes, 11);
}

/* ---------------------------------------------------------------- *
 * §1 — Required status matrix (the acceptance table)
 * ---------------------------------------------------------------- */
const REQUIRED_CASES: Array<[string, number, number, boolean]> = [
  ["04.59", 4, 59, true],
  ["05.00", 5, 0, false],
  ["12.00", 12, 0, false],
  ["17.59", 17, 59, false],
  ["18.00", 18, 0, true],
  ["20.00", 20, 0, true],
  ["23.59", 23, 59, true],
  ["00.00", 0, 0, true],
  ["02.00", 2, 0, true],
];

for (const [label, hours, minutes, expected] of REQUIRED_CASES) {
  test(`status at ${label} WIB is ${expected ? "BUKA" : "TUTUP"}`, () => {
    const status = getBusinessStatus(jakartaAt(hours, minutes));
    assert.equal(status.isOpen, expected);
    assert.equal(status.state, expected ? "open" : "closed");
  });
}

/* ---------------------------------------------------------------- *
 * §2 — Constant wiring must match the rule
 * ---------------------------------------------------------------- */
test("schedule constants are 18:00 open / 05:00 close", () => {
  assert.equal(OPEN_HOUR, 18);
  assert.equal(CLOSE_HOUR, 5);
  assert.equal(OPEN_MINUTE_OF_DAY, 1080);
  assert.equal(CLOSE_MINUTE_OF_DAY, 300);
  assert.equal(HOURS_LABEL_SHORT, "Setiap hari, pukul 18.00–05.00 WIB");
});

test("1 minute before opening is still closed, 1 minute after is open", () => {
  assert.equal(isOpenAtMinute(OPEN_MINUTE_OF_DAY - 1), false); // 17:59
  assert.equal(isOpenAtMinute(OPEN_MINUTE_OF_DAY), true); // 18:00
});

test("1 minute before closing is still open, closing minute is closed", () => {
  assert.equal(isOpenAtMinute(CLOSE_MINUTE_OF_DAY - 1), true); // 04:59
  assert.equal(isOpenAtMinute(CLOSE_MINUTE_OF_DAY), false); // 05:00
});

/* ---------------------------------------------------------------- *
 * §3 — Jakarta wall clock conversion
 * ---------------------------------------------------------------- */
test("getJakartaTime shifts UTC+7 and reports the right wall clock", () => {
  const jt = getJakartaTime(new Date(Date.UTC(2026, 2, 9, 21, 59, 30)));
  assert.equal(jt.hours, 4);
  assert.equal(jt.minutes, 59);
  assert.equal(jt.seconds, 30);
  assert.equal(jt.minuteOfDay, 4 * 60 + 59);
  assert.equal(jt.dayKey, "2026-03-10");
});

test("getJakartaTime does not depend on the host timezone", () => {
  const instant = new Date(Date.UTC(2026, 2, 10, 11, 0, 0));
  const first = getJakartaTime(instant);
  process.env.TZ = "America/New_York"; // eslint-disable-line no-process-env
  const second = getJakartaTime(instant);
  delete process.env.TZ;
  assert.deepEqual(second, first);
});

/* ---------------------------------------------------------------- *
 * §4 — Midnight crossing
 * ---------------------------------------------------------------- */
test("after-midnight hours from the same night are still open", () => {
  for (const hours of [0, 1, 2, 3, 4]) {
    assert.equal(getBusinessStatus(jakartaAt(hours, 30)).isOpen, true, `${hours}:30`);
  }
});

test("next transition from 22:00 is 05:00 on the following calendar day", () => {
  const now = jakartaAt(22, 0);
  const transition = getNextTransitionTime(now);
  const jt = getJakartaTime(transition);
  assert.equal(jt.hours, 5);
  assert.equal(jt.minutes, 0);
  assert.equal(jt.dayKey, "2026-03-11"); // crosses into tomorrow
  assert.equal(getMsUntilNextTransition(now), 7 * 60 * 60 * 1000);
});

test("next transition from 02:00 is 05:00 the same calendar day", () => {
  const now = jakartaAt(2, 0);
  const transition = getNextTransitionTime(now);
  assert.equal(getJakartaTime(transition).hours, 5);
  assert.equal(getJakartaTime(transition).dayKey, "2026-03-10");
  assert.equal(getMsUntilNextTransition(now), 3 * 60 * 60 * 1000);
});

test("next transition from 12:00 is 18:00 the same day", () => {
  const now = jakartaAt(12, 0);
  const transition = getNextTransitionTime(now);
  assert.equal(getJakartaTime(transition).hours, 18);
  assert.equal(getMsUntilNextTransition(now), 6 * 60 * 60 * 1000);
});

test("next transition from 17:59:30 is 30 seconds away", () => {
  const now = new Date(jakartaAt(17, 59).getTime() + 30_000);
  assert.equal(getMsUntilNextTransition(now), 30_000);
});

test("next transition from 04:59:30 is 30 seconds away", () => {
  const now = new Date(jakartaAt(4, 59).getTime() + 30_000);
  assert.equal(getMsUntilNextTransition(now), 30_000);
});

/* ---------------------------------------------------------------- *
 * §5 — Next opening time
 * ---------------------------------------------------------------- */
test("mid-night open session points next opening at the same Jakarta day", () => {
  const now = jakartaAt(2, 0);
  const opening = getNextOpeningTime(now);
  assert.equal(getJakartaTime(opening).hours, 18);
  assert.equal(getJakartaTime(opening).dayKey, "2026-03-10");
  assert.equal(getMsUntilNextOpen(now), 16 * 60 * 60 * 1000);
});

test("daytime closed period points next opening at today 18:00", () => {
  const now = jakartaAt(9, 30);
  const opening = getNextOpeningTime(now);
  assert.equal(getJakartaTime(opening).hours, 18);
  assert.equal(getJakartaTime(opening).dayKey, "2026-03-10");
  assert.equal(getMsUntilNextOpen(now), 8.5 * 60 * 60 * 1000);
});

test("evening open session points next opening at the next calendar day", () => {
  const now = jakartaAt(20, 0);
  const opening = getNextOpeningTime(now);
  assert.equal(getJakartaTime(opening).dayKey, "2026-03-11");
  assert.equal(getJakartaTime(opening).hours, 18);
});

/* ---------------------------------------------------------------- *
 * §6 — Dynamic copy for the open and closed states
 * ---------------------------------------------------------------- */
test("open state uses the 'ready to help' copy", () => {
  for (const [h, m] of [
    [18, 0],
    [20, 0],
    [23, 59],
    [0, 0],
    [2, 0],
    [4, 59],
  ]) {
    const status = getBusinessStatus(jakartaAt(h, m));
    assert.equal(status.isOpen, true, `${h}:${m}`);
    assert.equal(status.message, "Kami siap membantu hingga pukul 05.00 WIB.");
  }
});

test("closed state uses the 'temporarily closed' copy", () => {
  for (const [h, m] of [
    [5, 0],
    [12, 0],
    [17, 59],
  ]) {
    const status = getBusinessStatus(jakartaAt(h, m));
    assert.equal(status.isOpen, false, `${h}:${m}`);
    assert.equal(
      status.message,
      "Layanan tutup sementara. Kami buka kembali pukul 18.00 WIB.",
    );
  }
});

test("copy depends only on state — never on the time of day within a state", () => {
  const openMessages = new Set<string>();
  const closedMessages = new Set<string>();

  for (let minutes = 0; minutes < 24 * 60; minutes += 5) {
    const status = getBusinessStatus(jakartaAt(Math.floor(minutes / 60), minutes % 60));
    (status.isOpen ? openMessages : closedMessages).add(status.message);
  }

  assert.equal(openMessages.size, 1, "open copy must be identical all night");
  assert.equal(closedMessages.size, 1, "closed copy must be identical all day");
  assert.notEqual([...openMessages][0], [...closedMessages][0]);
});

/* ---------------------------------------------------------------- *
 * §7 — Timer safety: delays must be positive and bounded by a day
 * ---------------------------------------------------------------- */
test("ms until next transition is always positive and <= 13h", () => {
  for (let minutes = 0; minutes < 24 * 60; minutes += 7) {
    const now = jakartaAt(Math.floor(minutes / 60), minutes % 60);
    const delay = getMsUntilNextTransition(now);
    assert.ok(delay > 0, `delay at ${minutes} minutes was ${delay}`);
    assert.ok(delay <= 13 * 60 * 60 * 1000, `delay at ${minutes} minutes was ${delay}`);
  }
});

test("status flips exactly across the 05:00 boundary", () => {
  const before = getBusinessStatus(new Date(jakartaAt(5, 0).getTime() - 1));
  const at = getBusinessStatus(jakartaAt(5, 0));
  assert.equal(before.isOpen, true);
  assert.equal(at.isOpen, false);
});

test("status flips exactly across the 18:00 boundary", () => {
  const before = getBusinessStatus(new Date(jakartaAt(18, 0).getTime() - 1));
  const at = getBusinessStatus(jakartaAt(18, 0));
  assert.equal(before.isOpen, false);
  assert.equal(at.isOpen, true);
});

test("every hour of the day is classified without gaps", () => {
  for (let hours = 0; hours < 24; hours += 1) {
    const status = getBusinessStatus(jakartaAt(hours, 0));
    const expected = hours >= 18 || hours < 5;
    assert.equal(status.isOpen, expected, `${hours}:00`);
  }
});

test("next-day helper sanity — independent of the case above", () => {
  assert.equal(getBusinessStatus(jakartaAtNextDay(19, 0)).isOpen, true);
  assert.equal(getBusinessStatus(jakartaAtNextDay(13, 0)).isOpen, false);
});
