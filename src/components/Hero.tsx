"use client";
import { Phone, Wrench } from "lucide-react";
import { WA_LINK } from "@/lib/constants";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden pt-16 md:pt-20"
    >
      {/* Background - subtle, not overwhelming */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/logo.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
        <div className="max-w-3xl mx-auto md:mx-0 text-center md:text-left" data-aos="fade-up">
          {/* Logo kecil di hero */}
          <div className="flex justify-center md:justify-start mb-6">
            <div className="relative w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] lg:w-[200px] lg:h-[200px]">
              <Image
                src="/logo.png"
                alt="Tambal Ban Mobile"
                fill
                className="object-contain drop-shadow-2xl"
                priority
                sizes="200px"
              />
            </div>
          </div>

          {/* Tagline */}
          <div className="inline-flex items-center gap-2 bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-4 py-1.5 mb-4 md:mb-5">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-300 text-xs sm:text-sm font-medium">
              Cepat • Datang ke Lokasi • Praktis
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] mb-4 md:mb-5">
            Tambal Ban{" "}
            <span className="text-red-500">Mobile</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto md:mx-0">
            Layanan tambal ban panggilan yang siap datang langsung ke lokasi Anda. Melayani ban tubeless, ban dalam, penggantian ban dalam, hingga bantuan menuju bengkel terdekat.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-bold transition-all shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Phone className="w-5 h-5" />
              Pesan via WhatsApp
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Wrench className="w-5 h-5" />
              Lihat Layanan
            </a>
          </div>

          {/* Stats - hide on very small screens, show on md+ */}
          <div className="hidden md:grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10 max-w-md">
            {[
              { number: "24", label: "Jam Layanan" },
              { number: "100+", label: "Pelanggan Puas" },
              { number: "30+", label: "Area Layanan" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl lg:text-3xl font-bold text-white">{stat.number}</p>
                <p className="text-xs lg:text-sm text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
