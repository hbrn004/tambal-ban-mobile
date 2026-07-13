"use client";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { WA_LINK } from "@/lib/constants";
import Image from "next/image";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "Tentang" },
  { href: "#services", label: "Layanan" },
  { href: "#pricing", label: "Tarif" },
  { href: "#estimator", label: "Estimasi" },
  { href: "#howto", label: "Cara Order" },
  { href: "#location", label: "Lokasi" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Kontak" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-12 md:h-16 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo navbar - small */}
          <a href="#home" className="flex items-center gap-2 md:gap-3">
            <div className="relative w-7 h-7 md:w-9 md:h-9">
              <Image
                src="/logo.png"
                alt="Tambal Ban Mobile"
                fill
                className="object-contain"
                sizes="36px"
              />
            </div>
            <div className="hidden xs:block">
              <h1 className="text-sm md:text-base font-bold text-gray-900 leading-tight">Tambal Ban Mobile</h1>
              <p className="text-[10px] md:text-xs text-gray-400 -mt-0.5">Tambal Ban Panggilan 24 Jam</p>
            </div>
          </a>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
              >
                {link.label}
              </a>
            ))}
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-md shadow-red-600/20 hover:shadow-red-600/40"
            >
              <Phone className="w-3.5 h-3.5" />
              Pesan Sekarang
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-200 overflow-hidden ${
          isOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-3 pt-2 space-y-0.5 bg-white border-t border-gray-100 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
            >
              {link.label}
            </a>
          ))}
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all mt-2"
          >
            <Phone className="w-4 h-4" />
            Pesan Sekarang
          </a>
        </div>
      </div>
    </nav>
  );
}
