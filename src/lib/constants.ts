export const WA_NUMBER = "6283154701592";
export const WA_LINK = `https://wa.me/${WA_NUMBER}`;

export const WA_PREP_NOTE = "Mohon siapkan:\n✅ Live Location\n✅ Foto ban atau komponen yang bermasalah\n✅ Nomor telepon aktif yang dapat dihubungi\n\nAgar teknisi dapat segera berangkat ke lokasi.\n";

export function waMessage(params: {
  nama?: string;
  lokasi?: string;
  jarak?: number;
  layanan?: string;
  biayaPerjalanan?: number;
  biayaJasaMin?: number;
  biayaJasaMax?: number;
  tambahanMalam?: number;
  totalMin?: number;
  totalMax?: number;
  /** Include preparation note before the main message */
  denganPersiapan?: boolean;
}): string {
  const parts: string[] = [];
  if (params.denganPersiapan) parts.push(WA_PREP_NOTE);
  parts.push("Halo, saya ingin menggunakan jasa Tambal Ban Mobile.");
  if (params.nama) parts.push(`\nNama: ${params.nama}`);
  if (params.lokasi) parts.push(`Lokasi: ${params.lokasi}`);
  if (params.jarak) parts.push(`Jarak: ${params.jarak} KM`);
  if (params.layanan) parts.push(`Layanan: ${params.layanan}`);
  if (params.biayaPerjalanan)
    parts.push(`Estimasi Biaya Perjalanan: Rp${params.biayaPerjalanan.toLocaleString()}`);
  if (params.biayaJasaMin && params.biayaJasaMax)
    parts.push(`Estimasi Biaya Jasa: Rp${params.biayaJasaMin.toLocaleString()} – Rp${params.biayaJasaMax.toLocaleString()}`);
  if (params.tambahanMalam)
    parts.push(`Tambahan Malam (30%): Rp${params.tambahanMalam.toLocaleString()}`);
  if (params.totalMin && params.totalMax)
    parts.push(`Estimasi Total: Rp${params.totalMin.toLocaleString()} – Rp${params.totalMax.toLocaleString()}`);
  parts.push("\nHarga akhir dapat disesuaikan berdasarkan kondisi di lapangan dan hasil kesepakatan.");
  return encodeURIComponent(parts.join("\n"));
}
