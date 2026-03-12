import type { Paket } from "@/lib/packagesData";
import { supabase } from "@/lib/supabase";

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
        const columns = [
            "id", "kategori", "tipe_umroh", "nama", "harga", "durasi",
            "jadwal", "badge", "badge_color", "fasilitas", "deskripsi",
            "image", "hotel_mekkah_bintang", "maskapai", "kota_asal",
            "status_publish", "tanggal_berangkat"
        ].join(",");

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

        const response = await fetch(`${supabaseUrl}/rest/v1/pakets?select=${columns}&order=created_at.asc&limit=100`, {
            headers: {
                "apikey": anonKey,
                "Authorization": `Bearer ${anonKey}`
            },
            next: { revalidate: 30 } // Cache request for 30 seconds
        });

        if (!response.ok) {
            console.error("Failed to fetch pakets via native fetch:", response.statusText);
            return [];
        }

        const data = await response.json();
        return (data as Record<string, unknown>[]).map(rowToPaket);
    } catch (err: any) {
        console.error("fetchPaketsServerSide error:", err);
        return [];
    }
}
