"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "Apakah melayani 24 jam?", a: "Ya, kami melayani 24 jam nonstop termasuk hari libur." },
  { q: "Apakah bisa ke rumah?", a: "Ya, kami bisa datang ke rumah, jalan raya, maupun lokasi lainnya." },
  { q: "Apakah melayani ban tubeless?", a: "Ya, kami melayani tambal ban tubeless dengan alat profesional." },
  { q: "Apakah melayani ban dalam?", a: "Ya, kami melayani tambal ban dalam (tube) untuk motor dan mobil." },
  { q: "Apakah bisa mengganti ban dalam?", a: "Ya, kami melayani penggantian ban dalam jika ban sudah tidak layak." },
  { q: "Bagaimana jika tidak bisa diperbaiki?", a: "Kami siap membantu membawa kendaraan ke bengkel terdekat." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 md:py-20 lg:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12" data-aos="fade-up">
          <span className="text-red-600 font-semibold text-xs tracking-[0.2em] uppercase">FAQ</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
            Pertanyaan Umum
          </h2>
        </div>

        <div className="space-y-2 md:space-y-3" data-aos="fade-up">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100 transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-5 md:px-6 py-3.5 md:py-4 text-left gap-3"
              >
                <span className="font-medium text-gray-900 text-sm md:text-base">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-200 ease-in-out ${
                  openIndex === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-5 md:px-6 pb-4 md:pb-5 text-gray-600 text-sm md:text-base leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
