"use client";
import { Info } from "lucide-react";

export default function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16" data-aos="fade-up">
          <span className="text-red-600 font-semibold text-xs tracking-[0.2em] uppercase">Tarif</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
            Perhitungan Biaya
          </h2>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg">
            Biaya perjalanan dihitung berdasarkan jarak tempuh. Biaya jasa tambal dihitung terpisah sesuai tingkat pekerjaan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8" data-aos="fade-up">
          {/* Journey cost */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Biaya Perjalanan</h3>
            <p className="text-3xl md:text-4xl font-extrabold text-red-600 mb-1">
              Rp10.000 <span className="text-base font-normal text-gray-500">/ 3 KM</span>
            </p>
            <p className="text-gray-500 text-sm mb-5">Setiap kelipatan 3 kilometer dikenakan biaya Rp10.000</p>
            <div className="space-y-2">
              {[
                ["0 - 3 KM", "Rp10.000"],
                ["3 - 6 KM", "Rp20.000"],
                ["6 - 9 KM", "Rp30.000"],
                ["9 - 12 KM", "Rp40.000"],
                ["12+ KM", "Rp10.000 / 3 KM"],
              ].map(([range, price]) => (
                <div key={range} className="flex items-center justify-between py-2.5 px-4 bg-gray-50 rounded-xl">
                  <span className="text-sm md:text-base text-gray-700 font-medium">{range}</span>
                  <span className="text-sm md:text-base text-gray-900 font-semibold">{price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 md:space-y-6">
            {/* Service fee */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Biaya Jasa</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Biaya jasa tambal ban, ganti ban dalam, maupun layanan lainnya
                dihitung terpisah sesuai tingkat pekerjaan. Konsultasikan dengan
                kami untuk estimasi biaya jasa yang akurat.
              </p>
            </div>

            {/* Night tariff */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-yellow-400 shrink-0" />
                  <h3 className="text-lg md:text-xl font-bold text-white">Tarif Malam</h3>
                </div>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  Layanan malam dikenakan tambahan biaya sebesar{" "}
                  <span className="text-yellow-400 font-bold">30%</span> dari total biaya
                  (biaya perjalanan + biaya jasa).
                </p>
              </div>
            </div>

            {/* Flexible tariff note */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5 md:p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🤝</span>
                <h3 className="font-bold text-gray-900 text-sm md:text-base">Tarif Fleksibel</h3>
              </div>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                Tarif perjalanan bersifat fleksibel dan dapat dinegosiasikan sesuai kondisi, jarak, akses lokasi, serta kesepakatan dengan pelanggan. Kami mengutamakan solusi terbaik tanpa memberatkan konsumen.
              </p>
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="mt-6 md:mt-8 text-center" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-300 text-orange-800 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm">
            🤝 Tarif Fleksibel — Harga Bisa Nego
          </span>
        </div>
      </div>
    </section>
  );
}
