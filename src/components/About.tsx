"use client";
import { MapPin, Clock, ShieldCheck, Wrench, CreditCard, Truck, Handshake } from "lucide-react";

const advantages = [
  { icon: MapPin, title: "Datang ke Lokasi", desc: "Kami datang langsung ke lokasi Anda, tidak perlu mendorong kendaraan jauh." },
  { icon: Clock, title: "Cepat & 24 Jam", desc: "Proses penambalan cepat dengan peralatan lengkap, siap melayani kapan saja." },
  { icon: ShieldCheck, title: "Harga Transparan", desc: "Tidak ada biaya tersembunyi. Harga jelas di awal sebelum pengerjaan." },
  { icon: Wrench, title: "Peralatan Lengkap", desc: "Dilengkapi alat tambal ban modern untuk segala jenis kerusakan ban." },
  { icon: CreditCard, title: "Pembayaran Mudah", desc: "Terima berbagai metode pembayaran untuk kenyamanan Anda." },
  { icon: Truck, title: "Area Indramayu", desc: "Melayani area Indramayu dan sekitarnya 24 jam nonstop." },
  { icon: Handshake, title: "Harga Fleksibel", desc: "Kami mengutamakan musyawarah dan kesepakatan bersama pelanggan. Tarif perjalanan dapat disesuaikan agar tetap adil dan tidak memberatkan." },
];

export default function About() {
  return (
    <section id="about" className="py-16 md:py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16" data-aos="fade-up">
          <span className="text-red-600 font-semibold text-xs tracking-[0.2em] uppercase">Tentang Kami</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
            Kenapa Memilih Kami?
          </h2>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            Kami hadir membantu pengendara yang mengalami ban bocor di jalan tanpa harus mendorong kendaraan jauh.
            Kami datang langsung ke lokasi pelanggan dengan peralatan lengkap sehingga proses menjadi lebih cepat, aman, dan praktis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {advantages.map((adv, i) => (
            <div
              key={adv.title}
              className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:border-red-100 hover:-translate-y-0.5 transition-all duration-300 p-5 md:p-6 lg:p-8"
              data-aos="fade-up"
              data-aos-delay={i * 80}
            >
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-red-50 group-hover:bg-red-600 flex items-center justify-center mb-4 transition-colors duration-300">
                <adv.icon className="w-5 h-5 md:w-6 md:h-6 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1.5">{adv.title}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">{adv.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
