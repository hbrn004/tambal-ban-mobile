"use client";
import { AlertTriangle, XCircle, Phone } from "lucide-react";

const reasons = [
  "Nomor telepon tidak dapat dihubungi.",
  "Pelanggan tidak merespons konfirmasi teknisi.",
  "Lokasi tidak sesuai atau tidak dapat ditemukan.",
  "Pelanggan tidak berada di lokasi tanpa pemberitahuan.",
  "Terindikasi sebagai pesanan palsu (prank order).",
];

export default function CancellationPolicy() {
  return (
    <section className="py-16 md:py-20 lg:py-28 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl shadow-md border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 md:p-8 lg:p-10" data-aos="fade-up">
          <div className="flex items-start gap-4 md:gap-5">
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 leading-tight">
                Kebijakan Pembatalan
              </h2>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-5">
                Untuk menjaga kualitas pelayanan dan menghargai waktu pelanggan lainnya,
                mohon pastikan data yang diberikan sudah benar.
              </p>

              <div className="mb-5">
                <p className="text-sm md:text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-amber-500" />
                  Pesanan dapat dibatalkan apabila:
                </p>
                <ul className="space-y-2.5">
                  {reasons.map((r) => (
                    <li
                      key={r}
                      className="flex items-start gap-3 text-sm md:text-base text-gray-700"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2.5 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4 p-4 md:p-5 bg-white/70 rounded-lg border border-amber-100">
                <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  Apabila terjadi perubahan lokasi atau kondisi, cukup informasikan kepada teknisi
                  melalui <strong>WhatsApp</strong> atau <strong>telepon</strong>. Kami akan berusaha
                  membantu semaksimal mungkin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
