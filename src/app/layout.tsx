import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import BackToTop from "@/components/BackToTop";
import AOSInit from "@/components/AOSInit";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tambal Ban Mobile | Tambal Ban Motor Panggilan Malam Indramayu",
  description:
    "Jasa tambal ban motor panggilan di Indramayu. Melayani tambal ban tubeless motor, tambal ban dalam motor, dan ganti ban dalam sepeda motor, serta bantuan menuju bengkel terdekat. Buka setiap hari pukul 18.00–05.00 WIB.",
  openGraph: {
    title: "Tambal Ban Mobile | Tambal Ban Motor Panggilan Malam Indramayu",
    description:
      "Jasa tambal ban motor panggilan khusus sepeda motor di wilayah Indramayu dan sekitarnya, buka setiap hari pukul 18.00–05.00 WIB. Melayani tambal ban Lelea dan Pangauban.",
    type: "website",
    locale: "id_ID",
  },
  keywords: [
    "Tambal Ban Mobile",
    "Tambal Ban Panggilan",
    "Tambal Ban Motor",
    "Tambal Ban Motor Panggilan",
    "Tambal Ban Tubeless Motor",
    "Tambal Ban Dalam Motor",
    "Ganti Ban Dalam Motor",
    "Tambal Ban Motor Malam",
    "Tambal Ban Lelea",
    "Tambal Ban Pangauban",
    "Tambal Ban Indramayu",
    "Tambal Ban Panggilan Lelea",
    "Tambal Ban Mobile Indramayu",
    "Bengkel Tambal Ban Lelea",
    "Tambal Ban Malam Indramayu",
    "Tambal Ban Panggilan Malam",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/images/logo-tbm-icon.png" />
        <link rel="apple-touch-icon" href="/images/logo-tbm-icon.png" />
      </head>
      <body className={inter.className}>
        <AOSInit />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <BackToTop />
      </body>
    </html>
  );
}
