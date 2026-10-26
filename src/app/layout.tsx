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
  title: "Tambal Ban Mobile | Tambal Ban Panggilan Malam Indramayu",
  description:
    "Jasa Tambal Ban Mobile dan Tambal Ban Panggilan. Melayani tambal ban tubeless, ban dalam, ganti ban dalam, serta bantuan menuju bengkel terdekat di Indramayu. Buka setiap hari pukul 18.00–05.00 WIB.",
  openGraph: {
    title: "Tambal Ban Mobile | Tambal Ban Panggilan Malam Indramayu",
    description:
      "Jasa Tambal Ban Mobile dan Tambal Ban Panggilan di Indramayu, buka setiap hari pukul 18.00–05.00 WIB. Melayani Tambal Ban Lelea, Tambal Ban Pengauban, dan seluruh Kabupaten Indramayu.",
    type: "website",
    locale: "id_ID",
  },
  keywords: [
    "Tambal Ban Mobile",
    "Tambal Ban Panggilan",
    "Tambal Ban Lelea",
    "Tambal Ban Pengauban",
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
