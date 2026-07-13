"use client";
import { Phone } from "lucide-react";
import { WA_LINK } from "@/lib/constants";

export default function CTA() {
  return (
    <section className="py-16 md:py-20 lg:py-28 bg-gradient-to-br from-red-600 to-red-700 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-aos="fade-up">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 leading-tight">
          Ban Bocor?
        </h2>
        <p className="text-base md:text-xl text-red-100 mb-8 md:mb-10">Tidak perlu panik. Hubungi kami sekarang juga.</p>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 bg-white text-red-600 hover:bg-red-50 px-6 md:px-8 py-3.5 md:py-4 rounded-xl text-base md:text-lg font-bold transition-all shadow-2xl hover:shadow-white/25 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Phone className="w-5 h-5" />
          Pesan Sekarang
        </a>
      </div>
    </section>
  );
}
