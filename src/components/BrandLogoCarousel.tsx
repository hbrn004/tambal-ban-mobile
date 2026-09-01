"use client";

import { useRef, useState } from "react";

const BRANDS = [
  { name: "ASPIRA", src: "/logos/aspira.png" },
  { name: "SWALLOW", src: "/logos/swallow.png" },
  { name: "AHM HONDA", src: "/logos/ahm-honda.png" },
  { name: "IRC TIRE", src: "/logos/irc-tire.png" },
  { name: "FDR", src: "/logos/fdr.png" },
  { name: "MAXXIS", src: "/logos/maxxis.png" },
];

function LogoSet({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="flex items-center shrink-0" aria-hidden={ariaHidden || undefined}>
      {BRANDS.map((brand) => (
        <div
          key={brand.name}
          className="mx-2.5 md:mx-3 w-36 md:w-48 h-16 md:h-20 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center px-3 md:px-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brand.src}
            alt={brand.name}
            loading="lazy"
            className="max-h-9 md:max-h-12 max-w-full object-contain"
          />
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
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-3 leading-tight">
          Merek Ban
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Kami siap melayani berbagai merek ban motor maupun mobil.
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
