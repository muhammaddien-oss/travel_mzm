import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { Paket } from "@/lib/packagesData";

// Helper: invalidate semua halaman paket setelah ada perubahan data
function revalidateAllPaketPages() {
    revalidatePath("/paket-umroh");
    revalidatePath("/paket-haji");
    revalidatePath("/paket-wisata");
    revalidatePath("/jadwal-keberangkatan");
    revalidatePath("/");
}

// DB row → Paket type
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

// Paket → DB row
function paketToRow(p: Partial<Paket> & { id?: string }) {
    return {
        id: p.id,
        kategori: p.kategori,
        tipe_umroh: p.tipeUmroh ?? null,
        nama: p.nama,
        harga: p.harga,
        durasi: p.durasi,
        jadwal: p.jadwal ?? null,
        badge: p.badge,
        badge_color: p.badgeColor,
        fasilitas: p.fasilitas ?? [],
        deskripsi: p.deskripsi,
        image: p.image ?? null,
        hotel_mekkah_bintang: p.hotelMekkahBintang ?? 4,
        maskapai: p.maskapai ?? null,
        kota_asal: p.kotaAsal ?? null,
        status_publish: p.statusPublish ?? "Tersedia",
        tanggal_berangkat: p.tanggalBerangkat ?? [],
    };
}

// GET /api/pakets
export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");

    if (id) {
        // Detail Mode: Fetch 1 baris, ambil select(*) termasuk image
        const { data, error } = await supabase
            .from("pakets")
            .select("*")
            .eq("id", id)
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(rowToPaket(data));
    }

    // List Mode: Jangan hindari image untuk admin panel agar foto tidak terhapus saat update
    const { data, error } = await supabase
        .from("pakets")
        .select(`id, kategori, tipe_umroh, nama, harga, durasi, jadwal, badge, badge_color, fasilitas, deskripsi, image, hotel_mekkah_bintang, maskapai, kota_asal, status_publish, tanggal_berangkat`)
        .order("created_at", { ascending: true })
        .limit(100);

    if (error) {
        console.error("Supabase Error [Pakets]:", error);
        return NextResponse.json([]); // Return array kosong supaya client tidak crash `.map is not a function`
    }

    // Header Cache-Control — 10 detik jadi fallback setelah revalidatePath
    return NextResponse.json((data || []).map(rowToPaket), {
        headers: {
            "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30"
        }
    });
}

// POST /api/pakets
export async function POST(req: NextRequest) {
    const body = await req.json();
    const row = paketToRow({ ...body, id: body.id || `pkg-${Date.now()}` });

    const { data, error } = await supabase.from("pakets").insert([row]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    revalidateAllPaketPages();
    return NextResponse.json(rowToPaket(data as Record<string, unknown>));
}

// PUT /api/pakets
export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { id, ...rest } = body;
    const row = paketToRow(rest);
    delete (row as Record<string, unknown>).id;

    const { data, error } = await supabase.from("pakets").update(row).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    revalidateAllPaketPages();
    return NextResponse.json(rowToPaket(data as Record<string, unknown>));
}

// DELETE /api/pakets?id=xxx
export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const { error } = await supabase.from("pakets").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    revalidateAllPaketPages();
    return NextResponse.json({ ok: true });
}
