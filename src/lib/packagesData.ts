// Tipe data paket
export type Paket = {
    id: string;
    kategori: "umroh" | "haji" | "wisata";
    tipeUmroh?: "reguler" | "plus"; // Khusus Umroh
    nama: string;
    harga: string;           // harga dasar/mulai dari
    durasi: string;
    jadwal?: string;
    badge: string;
    badgeColor: string;
    fasilitas: string[];
    deskripsi: string;
    image?: string;
    // Hotel info
    hotelMekkahBintang?: number;
    // Info tambahan
    maskapai?: string;         // cth: "Garuda Indonesia"
    kotaAsal?: string;         // cth: "Jakarta (CGK)"
    tanggalBerangkat?: { tanggal: string; status: "tersedia" | "terbatas" | "full" | "berangkat" }[];
    statusPublish?: "Tersedia" | "Sudah Berangkat";
};

// Fallback image per kategori
export const FALLBACK_IMAGES: Record<Paket["kategori"], string> = {
    umroh: "/img/umroh-card.png",
    haji: "/img/haji-card.png",
    wisata: "/img/wisata-islam-card.png",
};

// ─── Async Supabase Functions ────────────────────────────────────────────────

export async function getAllPaketsAsync(): Promise<Paket[]> {
    const res = await fetch("/api/pakets", { cache: "no-store", headers: { 'Cache-Control': 'no-cache' } });
    if (!res.ok) return [];
    return res.json();
}

export async function getPaketsByKategoriAsync(kategori: Paket["kategori"]): Promise<Paket[]> {
    const all = await getAllPaketsAsync();
    return all.filter(p => p.kategori === kategori);
}

export async function createPaketAsync(paket: Omit<Paket, "id">): Promise<Paket> {
    const res = await fetch("/api/pakets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paket),
    });
    return res.json();
}

export async function updatePaketAsync(id: string, paket: Partial<Paket>): Promise<Paket> {
    const res = await fetch("/api/pakets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...paket }),
    });
    return res.json();
}

export async function deletePaketAsync(id: string): Promise<void> {
    await fetch(`/api/pakets?id=${id}`, { method: "DELETE" });
}

