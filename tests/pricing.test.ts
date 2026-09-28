/**
 * Tests for the pricing source of truth.
 * Run: npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  PRICE_PER_KM,
  MIN_TRAVEL_FEE,
  MAX_SERVICE_DISTANCE,
  NIGHT_SURCHARGE_PERCENT,
  SERVICES,
  getService,
  parseDistance,
  calculateTravelFee,
  calculateEstimate,
  formatRupiah,
} from "../src/lib/pricing.ts";

/* ---------------------------------------------------------------- *
 * §11 — Required travel fee cases
 * ---------------------------------------------------------------- */
const TRAVEL_CASES: Array<[number, number]> = [
  [1, 10000],
  [3, 10000],
  [3.1, 10000],
  [4, 10000],
  [5, 12500],
  [6, 15000],
  [7, 17500],
  [8, 20000],
  [9, 22500],
  [10, 25000],
  [15, 37500],
  [20, 50000],
];

for (const [distance, expected] of TRAVEL_CASES) {
  test(`travelFee(${distance} KM) === ${expected}`, () => {
    const result = calculateTravelFee(distance);
    assert.ok(result, `expected a result for ${distance}`);
    assert.equal(result.travelFee, expected);
  });
}

/* ---------------------------------------------------------------- *
 * Decimal rounding — always ceiling
 * ---------------------------------------------------------------- */
const CEIL_CASES: Array<[number, number, number]> = [
  [3.1, 4, 10000],
  [4.1, 5, 12500],
  [5.5, 6, 15000],
  [8.2, 9, 22500],
  [0.1, 1, 10000],
  [10.01, 11, 27500],
];

for (const [distance, rounded, fee] of CEIL_CASES) {
  test(`${distance} KM rounds up to ${rounded} KM → ${fee}`, () => {
    const result = calculateTravelFee(distance);
    assert.ok(result);
    assert.equal(result.roundedDistance, rounded);
    assert.equal(result.travelFee, fee);
  });
}

test("travel fee never below the minimum", () => {
  for (const d of [0.5, 1, 2, 3, 4]) {
    const r = calculateTravelFee(d);
    assert.ok(r && r.travelFee >= MIN_TRAVEL_FEE, `fee for ${d} must be >= min`);
  }
});

test("fee scales linearly past the minimum", () => {
  const r = calculateTravelFee(20);
  assert.ok(r);
  assert.equal(r.travelFee, 20 * PRICE_PER_KM);
});

/* ---------------------------------------------------------------- *
 * §12 — Invalid input must not produce wrong totals
 * ---------------------------------------------------------------- */
const INVALID_INPUTS: unknown[] = [
  null,
  undefined,
  "",
  "   ",
  "abc",
  "-",
  "-5",
  "-3,5",
  NaN,
  Infinity,
  -Infinity,
  {},
  [],
  true,
  "1.2.3",
  "12abc",
  "٣",
];

for (const input of INVALID_INPUTS) {
  test(`invalid input ${JSON.stringify(input) ?? String(input)} → null`, () => {
    const parsed = parseDistance(input);
    assert.equal(parsed, null);
    const fee = calculateTravelFee(input);
    assert.equal(fee, null);
  });
}

test('"3,5" is parsed as 3.5 KM (Indonesian decimal comma)', () => {
  assert.equal(parseDistance("3,5"), 3.5);
  const fee = calculateTravelFee("3,5");
  assert.ok(fee);
  assert.equal(fee.roundedDistance, 4);
  assert.equal(fee.travelFee, 10000);
});

test('" 6 " whitespace is stripped', () => {
  assert.equal(parseDistance(" 6 "), 6);
  assert.equal(calculateTravelFee(" 6 ")?.travelFee, 15000);
});

test("distance 0 yields zero travel fee (no service area selected yet)", () => {
  const fee = calculateTravelFee(0);
  assert.ok(fee);
  assert.equal(fee.travelFee, 0);
  assert.equal(fee.roundedDistance, 0);
});

test("no NaN/Infinity leaks out of the calculator", () => {
  for (const d of [0, 1, 3.7, 12, 49.9]) {
    const r = calculateTravelFee(d);
    assert.ok(r);
    assert.ok(Number.isFinite(r.travelFee));
    assert.ok(Number.isFinite(r.roundedDistance));
  }
});

/* ---------------------------------------------------------------- *
 * §3 — Maximum service distance
 * ---------------------------------------------------------------- */
test("distance at the limit is allowed", () => {
  const r = calculateTravelFee(MAX_SERVICE_DISTANCE);
  assert.ok(r);
  assert.equal(r.travelFee, 125000);
});

test("distance over the limit is rejected", () => {
  const r = calculateEstimate({ distance: 50.1, serviceId: "tubeless" });
  assert.equal(r.ok, false);
  assert.match(r.ok === false ? r.error : "", /maksimal 50 KM/);
});

test("far distance is rejected", () => {
  const r = calculateEstimate({ distance: 200, serviceId: "tubeless" });
  assert.equal(r.ok, false);
});

/* ---------------------------------------------------------------- *
 * §4 — Service catalogue is the only price source
 * ---------------------------------------------------------------- */
test("catalogue holds exactly the three configured services", () => {
  assert.deepEqual(
    SERVICES.map((s) => s.id),
    ["tubeless", "tube", "ganti"],
  );
});

const SERVICE_PRICES: Array<[string, number, number]> = [
  ["tubeless", 15000, 20000],
  ["tube", 15000, 20000],
  ["ganti", 45000, 50000],
];

for (const [id, min, max] of SERVICE_PRICES) {
  test(`service ${id} → ${min}–${max}`, () => {
    const s = getService(id);
    assert.ok(s);
    assert.equal(s.priceMin, min);
    assert.equal(s.priceMax, max);
  });
}

test("unknown service id is rejected", () => {
  const r = calculateEstimate({ distance: 3, serviceId: "nope" });
  assert.equal(r.ok, false);
  assert.match(r.ok === false ? r.error : "", /Layanan tidak valid/);
});

test("empty service id is rejected", () => {
  const r = calculateEstimate({ distance: 3, serviceId: "" });
  assert.equal(r.ok, false);
});

/* ---------------------------------------------------------------- *
 * §13 — Total combinations
 * ---------------------------------------------------------------- */
test("tubeless min 15000 + 3 KM → 25000", () => {
  const r = calculateEstimate({ distance: 3, serviceId: "tubeless" });
  assert.ok(r.ok);
  assert.equal(r.breakdown.totalMin, 25000);
});

test("tubeless max 20000 + 5 KM → 32500", () => {
  const r = calculateEstimate({ distance: 5, serviceId: "tubeless" });
  assert.ok(r.ok);
  assert.equal(r.breakdown.travelFee, 12500);
  assert.equal(r.breakdown.totalMax, 32500);
});

test("tube min 15000 + 6 KM → 30000", () => {
  const r = calculateEstimate({ distance: 6, serviceId: "tube" });
  assert.ok(r.ok);
  assert.equal(r.breakdown.totalMin, 30000);
});

test("ganti min 45000 + 10 KM → 70000", () => {
  const r = calculateEstimate({ distance: 10, serviceId: "ganti" });
  assert.ok(r.ok);
  assert.equal(r.breakdown.totalMin, 70000);
});

/* ---------------------------------------------------------------- *
 * §6 — Night surcharge applied exactly once
 * ---------------------------------------------------------------- */
test("night surcharge is 30% and applied once on (service + travel)", () => {
  const day = calculateEstimate({ distance: 10, serviceId: "ganti" });
  const night = calculateEstimate({ distance: 10, serviceId: "ganti", isNight: true });
  assert.ok(day.ok && night.ok);

  assert.equal(day.breakdown.nightMin, 0);
  const expectedSubtotal = 45000 + 25000; // 70000
  assert.equal(night.breakdown.nightMin, Math.round(expectedSubtotal * 0.3)); // 21000
  assert.equal(night.breakdown.totalMin, 91000);

  // Applied once, not compounded twice.
  assert.notEqual(night.breakdown.totalMin, Math.round(70000 * 1.3 * 1.3));
  assert.equal(NIGHT_SURCHARGE_PERCENT, 30);
});

test("night surcharge does not multiply the travel fee in isolation", () => {
  const r = calculateEstimate({ distance: 20, serviceId: "tubeless", isNight: true });
  assert.ok(r.ok);
  // travel 50000 must not become 65000 on its own
  assert.equal(r.breakdown.travelFee, 50000);
  assert.equal(r.breakdown.nightMin, Math.round((15000 + 50000) * 0.3));
});

test("isNight only accepts boolean true", () => {
  const r = calculateEstimate({
    distance: 5,
    serviceId: "tube",
    // @ts-expect-error runtime guard: a string must not enable the surcharge
    isNight: "yes",
  });
  assert.ok(r.ok);
  assert.equal(r.breakdown.nightMin, 0);
});

/* ---------------------------------------------------------------- *
 * §9 — Client-supplied prices are ignored
 * ---------------------------------------------------------------- */
test("injected servicePrice / travelFee / total are ignored", () => {
  const r = calculateEstimate({
    distance: 3,
    serviceId: "tubeless",
    // @ts-expect-error deliberately smuggle fake prices
    servicePrice: 1,
    travelFee: 999999,
    totalPrice: 1,
    surcharge: 0,
  });
  assert.ok(r.ok);
  assert.equal(r.breakdown.travelFee, 10000);
  assert.equal(r.breakdown.serviceMin, 15000);
  assert.equal(r.breakdown.totalMin, 25000);
});

/* ---------------------------------------------------------------- *
 * §7 — Rupiah formatting
 * ---------------------------------------------------------------- */
const CURRENCY_CASES: Array<[number, string]> = [
  [10000, "Rp10.000"],
  [12500, "Rp12.500"],
  [15000, "Rp15.000"],
  [22500, "Rp22.500"],
  [50000, "Rp50.000"],
  [0, "Rp0"],
];

for (const [amount, expected] of CURRENCY_CASES) {
  test(`formatRupiah(${amount}) === "${expected}"`, () => {
    assert.equal(formatRupiah(amount), expected);
  });
}

test("formatRupiah never emits NaN or Infinity", () => {
  assert.equal(formatRupiah(NaN), "Rp0");
  assert.equal(formatRupiah(Infinity), "Rp0");
  assert.equal(formatRupiah(-Infinity), "Rp0");
});
