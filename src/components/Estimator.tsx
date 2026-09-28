"use client";

import { useState } from "react";
import { Calculator, Send, Moon, Sun, AlertCircle } from "lucide-react";
import { WA_LINK, waMessage } from "@/lib/constants";
import {
  SERVICES,
  MESSAGES,
  calculateEstimate,
  formatRupiah,
  type EstimateBreakdown,
} from "@/lib/pricing";

export default function Estimator() {
  const [distanceInput, setDistanceInput] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [isMalam, setIsMalam] = useState(false);

  // Recompute the whole estimate from the pricing config on every render.
  // Nothing price-related is ever read back from state or user input.
  const serviceSelected = serviceId !== "";
  const result =
    serviceSelected && distanceInput.trim() !== ""
      ? calculateEstimate({ distance: distanceInput, serviceId, isNight: isMalam })
      : null;

  const breakdown: EstimateBreakdown | null = result?.ok ? result.breakdown : null;
  const errorMessage: string | null = !serviceSelected
    ? null
    : distanceInput.trim() === ""
      ? MESSAGES.invalidDistance
      : result && !result.ok
        ? result.error
        : null;

  const msg = waMessage({
    jarak: breakdown?.roundedDistance || undefined,
    layanan: breakdown?.serviceLabel || undefined,
    biayaPerjalanan: breakdown?.travelFee || undefined,
    biayaJasaMin: breakdown?.serviceMin || undefined,
    biayaJasaMax: breakdown?.serviceMax || undefined,
    tambahanMalam: breakdown?.nightMin || undefined,
    totalMin: breakdown?.totalMin || undefined,
    totalMax: breakdown?.totalMax || undefined,
    denganPersiapan: true,
  });

  return (
    <section id="estimator" className="py-16 md:py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12" data-aos="fade-up">
          <span className="text-red-600 font-semibold text-xs tracking-[0.2em] uppercase">Estimasi Biaya</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
            Kalkulator Biaya
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Hitung estimasi biaya perjalanan dan layanan dengan mudah.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 md:p-8" data-aos="fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Input */}
            <div className="space-y-5 md:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jarak (KM)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Masukkan jarak dalam KM"
                  value={distanceInput}
                  onChange={(e) => setDistanceInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Layanan</label>
                <div className="grid grid-cols-1 gap-2">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setServiceId(serviceId === s.id ? "" : s.id)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                        serviceId === s.id
                          ? "border-red-500 bg-red-50 text-red-700 font-semibold"
                          : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <span>{s.label}</span>
                      <span className="float-right text-gray-500 text-xs">
                        {formatRupiah(s.priceMin)} – {formatRupiah(s.priceMax)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                {isMalam ? (
                  <Moon className="w-5 h-5 text-yellow-500 shrink-0" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500 shrink-0" />
                )}
                <span className="text-sm font-medium text-gray-700">Layanan Malam</span>
                <button
                  onClick={() => setIsMalam(!isMalam)}
                  className={`ml-auto relative w-11 h-6 rounded-full transition-colors ${
                    isMalam ? "bg-yellow-500" : "bg-gray-300"
                  }`}
                  aria-label="Toggle layanan malam"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      isMalam ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Result */}
            <div className="bg-gray-50 rounded-xl p-5 md:p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-5">
                <Calculator className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-gray-900 text-sm md:text-base">Rincian Biaya</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                  <div>
                    <span className="text-sm text-gray-600">Harga Jasa</span>
                    <p className="text-[10px] text-gray-400">sesuai jenis layanan terpilih</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {breakdown
                      ? `${formatRupiah(breakdown.serviceMin)} – ${formatRupiah(breakdown.serviceMax)}`
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                  <div>
                    <span className="text-sm text-gray-600">Biaya Perjalanan</span>
                    <p className="text-[10px] text-gray-400">
                      {breakdown && breakdown.roundedDistance > 0
                        ? `${breakdown.roundedDistance} KM × Rp2.500 (min Rp10.000)`
                        : "dihitung berdasarkan estimasi jarak"}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {breakdown ? formatRupiah(breakdown.travelFee) : "-"}
                  </span>
                </div>
                {breakdown?.isNight && (
                  <div className="flex items-center justify-between py-2 border-b border-yellow-200 last:border-0">
                    <span className="text-sm text-yellow-700">Biaya Malam (30%)</span>
                    <span className="text-sm font-bold text-yellow-700">
                      + {formatRupiah(breakdown.nightMin)}
                      {breakdown.nightMax > breakdown.nightMin ? ` – ${formatRupiah(breakdown.nightMax)}` : ""}
                    </span>
                  </div>
                )}
                <div className="pt-3 mt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base font-bold text-gray-900">Estimasi Total</span>
                    <span className="text-lg md:text-xl font-bold text-red-600">
                      {breakdown
                        ? `${formatRupiah(breakdown.totalMin)} – ${formatRupiah(breakdown.totalMax)}`
                        : "-"}
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-red-700 leading-relaxed">{errorMessage}</span>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  *Biaya jasa sesuai tingkat pekerjaan. Harga dapat berbeda di lapangan.
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Harga jasa dapat disesuaikan dengan tingkat kesulitan pekerjaan. Estimasi akhir akan diinformasikan sebelum pengerjaan dimulai.
                </p>
              </div>

              {breakdown ? (
                <a
                  href={`${WA_LINK}?text=${msg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Pesan via WhatsApp
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-gray-300 text-white px-5 py-3.5 rounded-xl text-sm font-bold cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Pesan via WhatsApp
                </button>
              )}

              {/* Catatan info box */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-xs font-semibold text-blue-800 mb-2">Catatan:</p>
                <p className="text-xs text-blue-700 leading-relaxed mb-2">
                  Estimasi ini hanya sebagai gambaran biaya. Harga perjalanan dapat disesuaikan berdasarkan:
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li className="flex items-start gap-1.5">• Jarak tempuh</li>
                  <li className="flex items-start gap-1.5">• Kondisi jalan</li>
                  <li className="flex items-start gap-1.5">• Waktu pelayanan</li>
                  <li className="flex items-start gap-1.5">• Tingkat kesulitan</li>
                  <li className="flex items-start gap-1.5">• Hasil negosiasi bersama pelanggan</li>
                </ul>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  ✅ Harga Bisa Didiskusikan
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
