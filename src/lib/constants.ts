export const WA_NUMBER = "6283154701592";
export const WA_LINK = `https://wa.me/${WA_NUMBER}`;

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
}): string {
  const parts = ["Halo, saya ingin menggunakan jasa Tambal Ban Mobile."];
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
