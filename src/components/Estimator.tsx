"use client";
import { useState } from "react";
import { Calculator, Send, Moon, Sun } from "lucide-react";
import { WA_LINK, waMessage } from "@/lib/constants";

const services = [
  { id: "tubeless", label: "Tambal Ban Tubeless", priceMin: 15000, priceMax: 20000 },
  { id: "tube", label: "Tambal Ban Dalam", priceMin: 15000, priceMax: 20000 },
  { id: "ganti", label: "Ganti Ban Dalam", priceMin: 45000, priceMax: 50000 },
];

function formatRupiah(n: number): string {
  return "Rp" + n.toLocaleString("id-ID");
}

export default function Estimator() {
  const [jarak, setJarak] = useState<number>(0);
  const [biayaJasaMin, setBiayaJasaMin] = useState<number>(0);
  const [biayaJasaMax, setBiayaJasaMax] = useState<number>(0);
  const [layananTerpilih, setLayananTerpilih] = useState("");
  const [isMalam, setIsMalam] = useState(false);

  const biayaPerjalanan = Math.ceil(jarak / 3) * 10000;
  const totalMin = biayaPerjalanan + biayaJasaMin;
  const totalMax = biayaPerjalanan + biayaJasaMax;
  const tambahanMalamMin = isMalam ? Math.round(totalMin * 0.3) : 0;
  const tambahanMalamMax = isMalam ? Math.round(totalMax * 0.3) : 0;
  const grandTotalMin = totalMin + tambahanMalamMin;
  const grandTotalMax = totalMax + tambahanMalamMax;

  const pilihLayanan = (id: string, priceMin: number, priceMax: number, label: string) => {
    if (layananTerpilih === label) {
      setLayananTerpilih("");
      setBiayaJasaMin(0);
      setBiayaJasaMax(0);
    } else {
      setLayananTerpilih(label);
      setBiayaJasaMin(priceMin);
      setBiayaJasaMax(priceMax);
    }
  };

  const msg = waMessage({
    jarak: jarak || undefined,
    layanan: layananTerpilih || undefined,
    biayaPerjalanan: biayaPerjalanan || undefined,
    biayaJasaMin: biayaJasaMin || undefined,
    biayaJasaMax: biayaJasaMax || undefined,
    tambahanMalam: tambahanMalamMin || undefined,
    totalMin: grandTotalMin || undefined,
    totalMax: grandTotalMax || undefined,
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
          <p className="text-gray-600 text-sm md:text-base">Hitung estimasi biaya perjalanan dan layanan dengan mudah.</p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 md:p-8" data-aos="fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Input */}
            <div className="space-y-5 md:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jarak (KM)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Masukkan jarak dalam KM"
                  value={jarak || ""}
                  onChange={(e) => setJarak(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Layanan</label>
                <div className="grid grid-cols-1 gap-2">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => pilihLayanan(s.id, s.priceMin, s.priceMax, s.label)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                        layananTerpilih === s.label
                          ? "border-red-500 bg-red-50 text-red-700 font-semibold"
                          : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <span>{s.label}</span>
                      <span className="float-right text-gray-500 text-xs">{formatRupiah(s.priceMin)} – {formatRupiah(s.priceMax)}</span>
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
                    <span className="text-sm text-gray-600">Biaya Perjalanan</span>
                    <p className="text-[10px] text-gray-400">dihitung berdasarkan estimasi jarak</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{formatRupiah(biayaPerjalanan)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                  <div>
                    <span className="text-sm text-gray-600">Biaya Jasa</span>
                    <p className="text-[10px] text-gray-400">menggunakan rentang harga sesuai jenis layanan</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {biayaJasaMin > 0 ? `${formatRupiah(biayaJasaMin)} – ${formatRupiah(biayaJasaMax)}` : "-"}
                  </span>
                </div>
                {tambahanMalamMin > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-yellow-200 last:border-0">
                    <span className="text-sm text-yellow-700">Tambahan Malam (30%)</span>
                    <span className="text-sm font-bold text-yellow-700">
                      + {formatRupiah(tambahanMalamMin)} {tambahanMalamMax > tambahanMalamMin ? `– ${formatRupiah(tambahanMalamMax)}` : ""}
                    </span>
                  </div>
                )}
                <div className="pt-3 mt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base font-bold text-gray-900">Estimasi Total</span>
                    <span className="text-lg md:text-xl font-bold text-red-600">
                      {grandTotalMin > 0 ? `${formatRupiah(grandTotalMin)} – ${formatRupiah(grandTotalMax)}` : formatRupiah(0)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  *Biaya jasa sesuai tingkat pekerjaan. Harga dapat berbeda di lapangan.
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Harga jasa dapat disesuaikan dengan tingkat kesulitan pekerjaan. Estimasi akhir akan diinformasikan sebelum pengerjaan dimulai.
                </p>
              </div>

              <a
                href={`${WA_LINK}?text=${msg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg"
              >
                <Send className="w-4 h-4" />
                Pesan via WhatsApp
              </a>

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
