"use client";
import { Phone } from "lucide-react";
import { WA_LINK } from "@/lib/constants";

export default function FloatingWhatsApp() {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float fixed bottom-5 right-5 z-40 w-12 h-12 md:w-14 md:h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-green-500/30 transition-all hover:-translate-y-1 active:translate-y-0"
      aria-label="Hubungi via WhatsApp"
    >
      <Phone className="w-5 h-5 md:w-6 md:h-6" />
    </a>
  );
}
