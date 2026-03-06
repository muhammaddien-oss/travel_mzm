import type { Paket } from "@/lib/packagesData";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

function rowToPaket(row: Record<string, unknown>): Paket {
    return {
        id: row.id as string,
        kategori: row.kategori as Paket["kategori"],
        tipeUmroh: row.tipe_umroh as Paket["tipeUmroh"],
        nama: row.nama as string,
        harga: row.harga as string,
        durasi: row.durasi as string,
        jadwal: row.jadwal as string,
        badge: row.badge as string,
        badgeColor: row.badge_color as string,
        fasilitas: (row.fasilitas as string[]) || [],
        deskripsi: row.deskripsi as string,
        image: (row.image as string) ?? null,
        hotelMekkahBintang: row.hotel_mekkah_bintang as number,
        maskapai: row.maskapai as string,
        kotaAsal: row.kota_asal as string,
        statusPublish: row.status_publish as Paket["statusPublish"],
        tanggalBerangkat: (row.tanggal_berangkat as Paket["tanggalBerangkat"]) || [],
    };
}

// Fetch pakets menggunakan native fetch agar bisa memanfaatkan Next.js caching
// Data di-cache dan di-revalidate otomatis setiap 60 detik
export async function fetchPaketsServerSide(): Promise<Paket[]> {
    try {
        // Hanya ambil kolom yang dibutuhkan (bukan SELECT *) untuk kurangi payload (< 2MB)
        const columns = [
            "id", "kategori", "tipe_umroh", "nama", "harga", "durasi",
            "jadwal", "badge", "badge_color", "fasilitas", "deskripsi",
            "image", "hotel_mekkah_bintang", "maskapai", "kota_asal",
            "status_publish", "tanggal_berangkat"
        ].join(",");

        const url = `${SUPABASE_URL}/rest/v1/pakets?select=${columns}&order=created_at.asc&limit=100`;
        const res = await fetch(url, {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                "Content-Type": "application/json",
            },
            cache: "no-store", // Disable fetch-level cache karena data > 2MB (limit Next.js). Route-level cache (revalidate=60 di page) akan tetap meng-cache HTML-nya.
        });

        if (!res.ok) {
            console.error("Failed to fetch pakets:", await res.text());
            return [];
        }

        const data: Record<string, unknown>[] = await res.json();
        return data.map(rowToPaket);
    } catch (err) {
        console.error("fetchPaketsServerSide error:", err);
        return [];
    }
}
