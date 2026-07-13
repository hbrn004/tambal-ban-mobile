"use client";
import { MapPin, Navigation, Clock, Wrench } from "lucide-react";
import { WA_LINK, waMessage } from "@/lib/constants";

const GMAPS_URL = "https://maps.app.goo.gl/YMbunVqoNxckHquu8?g_st=ac";
const GMAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d108.2427673!3d-6.4420433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6ec70055d08de9%3A0x7dbbeab610371f87!2sBengkel%20Prapatan!5e0!3m2!1sid!2sid!4v1";

export default function Location() {
  const waMsg = waMessage({
    lokasi: "Bengkel Prapatan - Desa Pangauban, Kec. Lelea, Indramayu",
  });

  return (
    <section id="location" className="py-16 md:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16" data-aos="fade-up">
          <span className="text-red-600 font-semibold text-xs tracking-[0.2em] uppercase">Lokasi</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
            Bengkel Offline Kami
          </h2>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            Selain melayani Tambal Ban Mobile dan Tambal Ban Panggilan, kami juga memiliki bengkel offline yang dapat Anda kunjungi secara langsung.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10" data-aos="fade-up">
          {/* Left: Address card */}
          <div className="space-y-5 md:space-y-6">
            {/* Alamat */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 md:p-7">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base">📍 Bengkel Prapatan</h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-1">
                    Jl. Larangan - Lelea
                    <br />
                    Desa Pangauban
                    <br />
                    Kecamatan Lelea
                    <br />
                    Kabupaten Indramayu
                    <br />
                    Jawa Barat
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={GMAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  <Navigation className="w-4 h-4" />
                  Buka Google Maps
                </a>
                <a
                  href={`${WA_LINK}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  <Wrench className="w-4 h-4" />
                  Pesan via WhatsApp
                </a>
              </div>
            </div>

            {/* Jam Operasional */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 md:p-7">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">Jam Operasional</h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Senin - Minggu</span>
                      <span className="font-semibold text-gray-900">24 Jam</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">*Jam operasional dapat berubah sewaktu-waktu</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map */}
          <div className="rounded-xl shadow-md border border-gray-100 overflow-hidden h-[300px] md:h-[400px]">
            <iframe
              src={GMAPS_EMBED}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Lokasi Bengkel Prapatan Lelea Indramayu"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
