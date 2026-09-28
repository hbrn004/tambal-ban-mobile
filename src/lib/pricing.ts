/**
 * Single source of truth for all Tambal Ban Mobile pricing.
 *
 * NEVER hardcode rates in components — import from here.
 * All money values are integers in Rupiah (no decimals).
 */

/** Travel fee charged per rounded-up kilometre. */
export const PRICE_PER_KM = 2500;

/** Minimum travel fee regardless of distance. */
export const MIN_TRAVEL_FEE = 10000;

/** Distances beyond this are not bookable through the normal flow. */
export const MAX_SERVICE_DISTANCE = 50;

/** Night service surcharge, applied once on (service + travel). */
export const NIGHT_SURCHARGE_PERCENT = 30;

export type ServiceId = "tubeless" | "tube" | "ganti";

export interface ServiceConfig {
  id: ServiceId;
  label: string;
  priceMin: number;
  priceMax: number;
}

/** Authoritative service catalogue. UI must never take prices from user input. */
export const SERVICES: readonly ServiceConfig[] = [
  { id: "tubeless", label: "Tambal Ban Tubeless", priceMin: 15000, priceMax: 20000 },
  { id: "tube", label: "Tambal Ban Dalam", priceMin: 15000, priceMax: 20000 },
  { id: "ganti", label: "Ganti Ban Dalam", priceMin: 45000, priceMax: 50000 },
] as const;

/** Look up a service by id. Returns undefined when the id is not in the catalogue. */
export function getService(id: string): ServiceConfig | undefined {
  return SERVICES.find((s) => s.id === id);
}

export const MESSAGES = {
  invalidDistance: "Masukkan jarak yang valid.",
  maxDistance: `Jarak layanan maksimal ${MAX_SERVICE_DISTANCE} KM. Silakan hubungi kami untuk konfirmasi.`,
  invalidService: "Layanan tidak valid.",
  distanceUnavailable: "Jarak lokasi belum dapat dihitung. Silakan periksa lokasi Anda.",
} as const;

/**
 * Parse raw user input into a distance in KM.
 * Accepts Indonesian decimal comma ("3,5" → 3.5), trims whitespace,
 * rejects NaN/Infinity/negative/empty/garbage. Returns null when invalid.
 */
export function parseDistance(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;

  // Numbers only pass when finite and non-negative.
  if (typeof raw === "number") {
    if (!Number.isFinite(raw) || raw < 0) return null;
    return raw;
  }

  if (typeof raw !== "string") return null;

  // Strip spaces (including non-breaking), normalise decimal comma to dot.
  const cleaned = raw.replace(/\s/g, "").replace(/,/g, ".");
  if (cleaned === "" || cleaned === "." || cleaned === "-") return null;

  // Only digits, at most one dot, optional single leading minus (rejected below).
  if (!/^-?\d*\.?\d*$/.test(cleaned)) return null;

  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return value;
}

export interface TravelFeeResult {
  /** Rounded-up distance in whole KM. */
  roundedDistance: number;
  travelFee: number;
}

/**
 * Travel fee = MAX(MIN_TRAVEL_FEE, CEILING(distance) × PRICE_PER_KM).
 * Returns null when the distance cannot be parsed, so callers never render NaN.
 */
export function calculateTravelFee(rawDistance: unknown): TravelFeeResult | null {
  const distance = parseDistance(rawDistance);
  if (distance === null) return null;
  if (distance === 0) return { roundedDistance: 0, travelFee: 0 };

  const roundedDistance = Math.ceil(distance);
  const raw = roundedDistance * PRICE_PER_KM;
  return {
    roundedDistance,
    travelFee: Math.max(MIN_TRAVEL_FEE, raw),
  };
}

export interface EstimateBreakdown {
  serviceId: ServiceId;
  serviceLabel: string;
  roundedDistance: number;
  travelFee: number;
  isNight: boolean;
  /** Service subtotal: min and max of the service price range. */
  serviceMin: number;
  serviceMax: number;
  /** Night surcharge amount (0 when not applicable). */
  nightMin: number;
  nightMax: number;
  /** Grand total, computed server-side-style from config only. */
  totalMin: number;
  totalMax: number;
}

export interface EstimateInput {
  /** Raw distance as typed by the user (string or number). */
  distance: unknown;
  /** Service id — prices are always resolved from the catalogue. */
  serviceId: string;
  isNight?: boolean;
}

export type EstimateResult =
  | { ok: true; breakdown: EstimateBreakdown }
  | { ok: false; error: string };

/**
 * Recompute the entire estimate from configuration.
 * Any price-like value coming from the client is ignored by design:
 * only `distance`, `serviceId` and the boolean `isNight` are trusted.
 */
export function calculateEstimate(input: EstimateInput): EstimateResult {
  const service = getService(input.serviceId);
  if (!service) return { ok: false, error: MESSAGES.invalidService };

  const travel = calculateTravelFee(input.distance);
  if (travel === null) return { ok: false, error: MESSAGES.invalidDistance };
  if (travel.roundedDistance > MAX_SERVICE_DISTANCE) {
    return { ok: false, error: MESSAGES.maxDistance };
  }

  const isNight = input.isNight === true;
  const subMin = service.priceMin + travel.travelFee;
  const subMax = service.priceMax + travel.travelFee;

  // Night surcharge applied exactly once, on the combined subtotal.
  const nightMin = isNight ? Math.round(subMin * (NIGHT_SURCHARGE_PERCENT / 100)) : 0;
  const nightMax = isNight ? Math.round(subMax * (NIGHT_SURCHARGE_PERCENT / 100)) : 0;

  return {
    ok: true,
    breakdown: {
      serviceId: service.id,
      serviceLabel: service.label,
      roundedDistance: travel.roundedDistance,
      travelFee: travel.travelFee,
      isNight,
      serviceMin: service.priceMin,
      serviceMax: service.priceMax,
      nightMin,
      nightMax,
      totalMin: subMin + nightMin,
      totalMax: subMax + nightMax,
    },
  };
}

/** Format a number as Indonesian Rupiah, e.g. 12500 → "Rp12.500". */
export function formatRupiah(amount: number): string {
  if (!Number.isFinite(amount)) return "Rp0";
  return "Rp" + Math.round(amount).toLocaleString("id-ID");
}
