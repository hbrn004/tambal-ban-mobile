"use client";
import { CheckCircle2 } from "lucide-react";

export default function ConfirmationBadge() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-6 md:p-8 lg:p-10 text-center"
          data-aos="fade-up"
        >
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <CheckCircle2 className="w-4 h-4" />
            Proses Konfirmasi ±1 Menit
          </div>
          <p className="text-white/90 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            Proses konfirmasi hanya membutuhkan waktu sekitar 1 menit agar teknisi dapat segera
            menuju lokasi dengan lebih cepat dan tepat.
          </p>
        </div>
      </div>
    </section>
  );
}
