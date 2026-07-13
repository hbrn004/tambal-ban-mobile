"use client";
import { MessageSquare, MapPin, AlertCircle, Truck, Wrench, Wallet } from "lucide-react";

const steps = [
  { icon: MessageSquare, title: "Hubungi WhatsApp", desc: "Hubungi kami via WhatsApp untuk melaporkan kendala Anda." },
  { icon: MapPin, title: "Kirim Lokasi", desc: "Bagikan lokasi Anda melalui fitur lokasi WhatsApp." },
  { icon: AlertCircle, title: "Jelaskan Kendala", desc: "Ceritakan kondisi ban dan kendala yang Anda alami." },
  { icon: Truck, title: "Kami Berangkat", desc: "Tim kami segera berangkat menuju lokasi Anda." },
  { icon: Wrench, title: "Pengerjaan", desc: "Pengerjaan tambal ban cepat dan profesional di tempat." },
  { icon: Wallet, title: "Pembayaran", desc: "Pembayaran dilakukan setelah pengerjaan selesai." },
];

export default function HowToOrder() {
  return (
    <section id="howto" className="py-16 md:py-20 lg:py-28 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16" data-aos="fade-up">
          <span className="text-red-600 font-semibold text-xs tracking-[0.2em] uppercase">Cara Order</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
            Bagaimana Cara Order?
          </h2>
          <p className="text-gray-600 text-sm md:text-base">Cukup ikuti langkah mudah berikut ini.</p>
        </div>

        <div className="space-y-4 md:space-y-6">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 p-5 md:p-6 flex items-start gap-4 md:gap-5"
              data-aos="fade-up"
              data-aos-delay={i * 60}
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <step.icon className="w-4 h-4 text-red-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base">{step.title}</h3>
                </div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed ml-0 md:ml-10">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
