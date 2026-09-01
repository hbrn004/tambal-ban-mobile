"use client";
import { Phone, MapPin, Clock } from "lucide-react";
import { WA_LINK } from "@/lib/constants";
import Image from "next/image";

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-9 h-9 md:w-10 md:h-10 shrink-0">
                <Image src="/logo.png" alt="Tambal Ban Mobile" fill className="object-contain" sizes="40px" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold">Tambal Ban Mobile</h3>
                <p className="text-xs md:text-sm text-gray-400">Tambal Ban Panggilan 24 Jam</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Layanan tambal ban panggilan yang siap datang ke lokasi Anda di wilayah Indramayu dan sekitarnya. Cepat, profesional, dan harga transparan.
            </p>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-bold text-sm md:text-base mb-3 md:mb-4">Kontak</h4>
            <div className="space-y-2.5">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>+62 831-4340-1874</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>Indramayu dan sekitarnya</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Clock className="w-4 h-4 text-red-500 shrink-0" />
                <span>24 Jam Nonstop</span>
              </div>
            </div>
          </div>

          {/* Bengkel Offline */}
          <div>
            <h4 className="font-bold text-sm md:text-base mb-3 md:mb-4">📍 Bengkel Offline</h4>
            <div className="text-gray-400 text-sm leading-relaxed space-y-1">
              <p>Bengkel Prapatan</p>
              <p>Jl. Larangan - Lelea, Pangauban</p>
              <p>Kecamatan Lelea, Indramayu</p>
              <p className="pt-2">
                <a
                  href="https://maps.app.goo.gl/YMbunVqoNxckHquu8?g_st=ac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors text-xs font-semibold"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Lihat Lokasi
                </a>
              </p>
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-bold text-sm md:text-base mb-3 md:mb-4">Layanan</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Tambal Ban Tubeless</li>
              <li>Tambal Ban Dalam</li>
              <li>Ganti Ban Dalam</li>
              <li>Step ke Bengkel</li>
            </ul>
          </div>
        </div>

        {/* Google Maps */}
        <div className="mt-8 md:mt-10 rounded-xl overflow-hidden border border-gray-800">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d108.2427673!3d-6.4420433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6ec70055d08de9%3A0x7dbbeab610371f87!2sBengkel%20Prapatan!5e0!3m2!1sid!2sid!4v1"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Peta Lokasi Bengkel Prapatan Lelea Indramayu"
          />
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs md:text-sm">
            &copy; {new Date().getFullYear()} Tambal Ban Mobile. All rights reserved.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors"
          >
            WhatsApp: +62 831-4340-1874
          </a>
        </div>
      </div>
    </footer>
  );
}
