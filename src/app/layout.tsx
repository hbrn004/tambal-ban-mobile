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
  title: "Tambal Ban Mobile | Tambal Ban Panggilan 24 Jam",
  description:
    "Jasa Tambal Ban Mobile dan Tambal Ban Panggilan. Melayani tambal ban tubeless, ban dalam, ganti ban dalam, serta bantuan menuju bengkel terdekat di Indramayu.",
  openGraph: {
    title: "Tambal Ban Mobile | Tambal Ban Panggilan 24 Jam",
    description:
      "Jasa Tambal Ban Mobile dan Tambal Ban Panggilan 24 Jam di Indramayu. Melayani Tambal Ban Lelea, Tambal Ban Pengauban, dan seluruh Kabupaten Indramayu.",
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
    "Tambal Ban 24 Jam Indramayu",
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
        <link rel="icon" href="/logo.png" />
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
