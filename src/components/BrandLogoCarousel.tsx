"use client";

import { useRef, useState } from "react";

const BRANDS = [
  { name: "ASPIRA", src: "/logos/aspira.png", dark: false },
  { name: "SWALLOW", src: "/logos/swallow.png", dark: false },
  { name: "AHM HONDA", src: "/logos/ahm-honda.png", dark: false },
  { name: "IRC TIRE", src: "/logos/irc-tire.png", dark: true },
  { name: "FDR", src: "/logos/fdr.png", dark: true },
  { name: "MAXXIS", src: "/logos/maxxis.png", dark: false },
];

/**
 * Every logo sits inside the SAME viewport box (w-full x h-11 md:h-14)
 * with object-contain, so all brands get an equal visual footprint —
 * regardless of their original aspect ratio. No distortion, no tiny outliers.
 */
function LogoCard({ brand }: { brand: (typeof BRANDS)[number] }) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={brand.src}
      alt={brand.name}
      loading="lazy"
      className="w-full h-full object-contain"
    />
  );

  if (brand.dark) {
    // White logos need a dark swatch for contrast on the white card
    return (
      <div className="bg-gray-900 rounded-lg w-full h-11 md:h-14 flex items-center justify-center overflow-hidden">
        {img}
      </div>
    );
  }
  return (
    <div className="w-full h-11 md:h-14 flex items-center justify-center overflow-hidden">
      {img}
    </div>
  );
}

function LogoSet({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="flex items-center shrink-0" aria-hidden={ariaHidden || undefined}>
      {BRANDS.map((brand) => (
        <div
          key={brand.name}
          className="mx-2.5 md:mx-3 w-40 md:w-80 h-16 md:h-20 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center px-2.5 md:px-3"
        >
          <LogoCard brand={brand} />
        </div>
      ))}
    </div>
  );
}

export default function BrandLogoCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  return (
    <section
      aria-label="Merek ban yang kami layani"
      className="py-10 md:py-14 bg-white border-y border-gray-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-7 md:mb-9 text-center">
        <span className="text-red-600 font-semibold text-xs tracking-[0.2em] uppercase">
          LAYANI BERBAGAI
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-2 leading-tight">
          KEBUTUHAN
        </h2>
        <p className="text-gray-900 font-semibold text-base md:text-lg mb-2">
          Ban Berkualitas, Perjalanan Lebih Aman
        </p>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
          Kami menyediakan pilihan ban dari merek-merek terpercaya dengan kualitas yang dapat
          diandalkan untuk kebutuhan motor dan mobil Anda.
        </p>
      </div>

      <div
        ref={trackRef}
        className={`marquee-track ${paused ? "marquee-paused" : ""}`}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
      >
        {/* Two identical sets for a seamless -50% loop */}
        <LogoSet />
        <LogoSet ariaHidden />
      </div>
    </section>
  );
}
