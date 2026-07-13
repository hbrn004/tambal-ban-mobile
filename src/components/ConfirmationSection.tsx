"use client";
import { Phone, MapPin, Camera, MapPinned, CheckCircle2 } from "lucide-react";

const items = [
  {
    icon: Phone,
    title: "Konfirmasi Telepon",
    desc: "Sebelum berangkat, teknisi akan menghubungi Anda melalui telepon singkat untuk memastikan pesanan dan lokasi sudah benar.",
  },
  {
    icon: MapPin,
    title: "Bagikan Live Location",
    desc: "Mohon kirim Live Location atau lokasi Google Maps melalui WhatsApp agar teknisi dapat menemukan lokasi dengan akurat.",
  },
  {
    icon: Camera,
    title: "Foto Kendala",
    desc: "Mohon kirim foto ban atau komponen yang mengalami masalah (ban bocor, ban sobek, pentil rusak, ban dalam bocor, atau kendala lainnya) agar teknisi dapat menyiapkan peralatan yang sesuai.",
  },
  {
    icon: MapPinned,
    title: "Tetap di Lokasi",
    desc: "Mohon tetap berada di lokasi sampai teknisi tiba. Jika ada perubahan lokasi, segera informasikan melalui WhatsApp atau telepon.",
  },
];

export default function ConfirmationSection() {
  return (
    <section className="py-16 md:py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16" data-aos="fade-up">
          <span className="text-red-600 font-semibold text-xs tracking-[0.2em] uppercase">
            Konfirmasi Pesanan
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
            Konfirmasi Sebelum Kami Berangkat
          </h2>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed">
            Agar teknisi dapat segera menuju lokasi dengan tepat dan menghindari kesalahan alamat,
            mohon bantu kami melakukan konfirmasi berikut.
          </p>
        </div>

        <div className="space-y-4 md:space-y-6">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:border-green-100 hover:-translate-y-0.5 transition-all duration-300 p-5 md:p-6 flex items-start gap-4 md:gap-5"
              data-aos="fade-up"
              data-aos-delay={i * 80}
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5 md:w-5 md:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed ml-0 md:ml-10">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
