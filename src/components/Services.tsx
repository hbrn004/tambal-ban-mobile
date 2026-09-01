"use client";
import { Wrench, Settings, Truck } from "lucide-react";
import { WA_LINK, waMessage, WA_PREP_NOTE } from "@/lib/constants";

const services = [
  {
    icon: Wrench,
    title: "Tambal Ban Tubeless",
    desc: "Penambalan ban tubeless menggunakan alat profesional. Cepat dan rapi tanpa perlu membongkar ban.",
    price: "Rp15.000 – Rp20.000",
  },
  {
    icon: Settings,
    title: "Tambal Ban Dalam",
    desc: "Penambalan ban dalam dengan pengerjaan rapi. Cocok untuk motor dan mobil dengan ban dalam.",
    price: "Rp15.000 – Rp20.000",
  },
  {
    icon: Truck,
    title: "Ganti Ban Dalam",
    desc: "Melayani penggantian ban dalam apabila ban sudah tidak layak ditambal.",
    price: "Rp45.000 – Rp50.000",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16" data-aos="fade-up">
          <span className="text-red-600 font-semibold text-xs tracking-[0.2em] uppercase">Layanan</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
            Layanan Kami
          </h2>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg">
            Berbagai layanan tambal ban yang siap membantu Anda kapan saja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {services.map((svc, i) => (
            <div
              key={svc.title}
              className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:border-red-100 hover:-translate-y-0.5 transition-all duration-300 relative p-5 md:p-6 lg:p-8 overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={i * 80}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600 rounded-r" />
              <div className="flex items-start gap-4 md:gap-5 pl-2">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <svc.icon className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1.5 leading-snug">{svc.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-3 md:mb-4">{svc.desc}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-xs md:text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full inline-block w-fit">
                      Estimasi {svc.price}
                    </span>
                    <a
                      href={`${WA_LINK}?text=${encodeURIComponent(WA_PREP_NOTE)}${waMessage({ layanan: svc.title })}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-red-600 hover:text-red-700 hover:underline inline-flex items-center gap-1"
                    >
                      Pesan Sekarang &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
