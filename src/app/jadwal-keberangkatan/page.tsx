"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PackageNavbar from "@/components/PackageNavbar";
import { getAllPaketsAsync, type Paket } from "@/lib/packagesData";

/* ── Departure schedule entries ── */
type JadwalEntry = {
    tanggal: Date;
    status: "tersedia" | "terbatas" | "full" | "berangkat";
    paketId: string;
    paketNama: string;
    kategori: Paket["kategori"];
    badge: string;
    badgeColor: string;
    maskapai?: string;
    hotel?: string;
    durasi: string;
    harga: string;
};

const BULAN_INDO = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGS", "SEP", "OKT", "NOV", "DES"];
const BULAN_INDO_FULL = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

/* Build entries from real tanggalBerangkat data */
function buildJadwalEntries(pakets: Paket[]): JadwalEntry[] {
    const entries: JadwalEntry[] = [];

    pakets.forEach((p) => {
        const dates = p.tanggalBerangkat || [];
        if (dates.length === 0) return;

        const base = {
            paketId: p.id,
            paketNama: p.nama,
            kategori: p.kategori,
            badge: p.badge,
            badgeColor: p.badgeColor,
            maskapai: p.maskapai,
            hotel: p.hotelMekkahBintang ? `Bintang ${p.hotelMekkahBintang}` : "-",
            durasi: p.durasi,
            harga: p.harga,
        };

        dates.forEach((item) => {
            const d = new Date(item.tanggal + "T00:00:00");
            if (!isNaN(d.getTime())) {
                entries.push({ ...base, tanggal: d, status: item.status });
            }
        });
    });

    entries.sort((a, b) => a.tanggal.getTime() - b.tanggal.getTime());
    return entries;
}

/* ── category meta ── */
const katMeta: Record<string, { label: string; color: string }> = {
    umroh: { label: "UMROH", color: "#008080" },
    haji: { label: "HAJI", color: "#c97d20" },
    wisata: { label: "WISATA", color: "#1a6fb0" },
};

/* status labels + colors */
const statusMeta: Record<string, { label: string; bg: string; text: string; icon: string }> = {
    tersedia: { label: "Kursi Tersedia", bg: "bg-green-50", text: "text-green-600", icon: "✓" },
    terbatas: { label: "Kursi Terbatas", bg: "bg-amber-50", text: "text-amber-600", icon: "⚡" },
    full: { label: "Full Booked", bg: "bg-red-50", text: "text-red-500", icon: "✕" },
    berangkat: { label: "Sudah Berangkat", bg: "bg-gray-100", text: "text-gray-400", icon: "✈" },
};

const ITEMS_PER_PAGE = 5;

export default function JadwalKeberangkatanPage() {
    const [entries, setEntries] = useState<JadwalEntry[]>([]);
    const [filterBulan, setFilterBulan] = useState("all");
    const [filterKategori, setFilterKategori] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showHistory, setShowHistory] = useState(false);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllPaketsAsync().then((pakets) => {
            setEntries(buildJadwalEntries(pakets));
            setLoading(false);
        });
    }, []);

    /* Split upcoming vs history */
    const upcoming = entries.filter(e => e.status !== "berangkat");
    const history = entries.filter(e => e.status === "berangkat");

    /* Apply filters on upcoming */
    const filtered = upcoming.filter((e) => {
        if (filterBulan !== "all" && e.tanggal.getMonth() !== parseInt(filterBulan)) return false;
        if (filterKategori !== "all" && e.kategori !== filterKategori) return false;
        if (filterStatus !== "all" && e.status !== filterStatus) return false;
        return true;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const whatsappNumber = "6282311000853";

    /* Render a single schedule row */
    function renderRow(entry: JadwalEntry, idx: number) {
        const meta = katMeta[entry.kategori] || katMeta.umroh;
        const sMeta = statusMeta[entry.status] || statusMeta.tersedia;
        const isDisabled = entry.status === "full" || entry.status === "berangkat";
        const day = entry.tanggal.getDate().toString().padStart(2, "0");
        const monthAbbr = BULAN_INDO[entry.tanggal.getMonth()];
        const year = entry.tanggal.getFullYear();

        return (
            <div
                key={`${entry.paketId}-${idx}`}
                className={`flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl border transition-all duration-200 overflow-hidden ${isDisabled
                    ? "bg-gray-50 border-gray-200 opacity-60"
                    : "bg-white border-gray-100 hover:shadow-md hover:border-gray-200"
                    }`}
            >
                {/* Date Block */}
                <div
                    className="flex-shrink-0 w-full sm:w-24 py-4 sm:py-5 flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-0 text-center"
                    style={{ backgroundColor: isDisabled ? "#f3f4f6" : meta.color + "12" }}
                >
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: isDisabled ? "#9ca3af" : meta.color }}>
                        {monthAbbr}
                    </p>
                    <p className="text-3xl sm:text-4xl font-black leading-none" style={{ color: isDisabled ? "#9ca3af" : meta.color }}>
                        {day}
                    </p>
                    <p className="text-[10px] font-semibold text-gray-400">{year}</p>
                </div>

                {/* Info */}
                <div className="flex-1 px-4 sm:px-5 py-3 sm:py-4 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                            className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: isDisabled ? "#9ca3af" : meta.color }}
                        >
                            {meta.label} • {entry.badge}
                        </span>
                        {/* Status chip */}
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${sMeta.bg} ${sMeta.text}`}>
                            {sMeta.icon} {sMeta.label}
                        </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 truncate">{entry.paketNama} — {entry.durasi}</h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-xs text-gray-400">
                        {entry.maskapai && (
                            <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                                </svg>
                                {entry.maskapai}
                            </span>
                        )}
                        {entry.hotel && entry.hotel !== "-" && (
                            <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                                </svg>
                                {entry.hotel}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right — CTA */}
                <div className="flex-shrink-0 px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-end">
                    {entry.status === "full" ? (
                        <span className="px-4 py-2 rounded-xl bg-red-100 text-red-500 text-xs font-bold">
                            Full Booked
                        </span>
                    ) : entry.status === "berangkat" ? (
                        <span className="px-4 py-2 rounded-xl bg-gray-200 text-gray-500 text-xs font-bold">
                            Sudah Berangkat
                        </span>
                    ) : (
                        <a
                            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Halo MZM Tour, saya tertarik dengan paket ${entry.paketNama}, jadwal ${day} ${BULAN_INDO_FULL[entry.tanggal.getMonth()]} ${year}. Mohon info lebih lanjut.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all hover:scale-105 hover:shadow-md whitespace-nowrap"
                            style={{ backgroundColor: "#008080" }}
                        >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16z" clipRule="evenodd" />
                            </svg>
                            Tanya WhatsApp
                        </a>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            <PackageNavbar />
            <main className="min-h-screen pt-16" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e6f2f2 50%, #f0fdfa 100%)" }}>

                {/* ── Header ── */}
                <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-10 pb-4">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                        Jadwal Keberangkatan
                    </h1>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
                        Temukan jadwal keberangkatan terbaik untuk perjalanan ibadah Anda. Kami menyediakan berbagai pilihan paket Umroh, Haji, dan Wisata Halal.
                    </p>
                </div>

                {/* ── Filter Bar ── */}
                <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-6">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bulan Keberangkatan</label>
                            <select value={filterBulan} onChange={(e) => { setFilterBulan(e.target.value); setPage(1); }}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all">
                                <option value="all">Semua Bulan</option>
                                {BULAN_INDO_FULL.map((b, i) => (<option key={i} value={i}>{b}</option>))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Jenis Layanan</label>
                            <select value={filterKategori} onChange={(e) => { setFilterKategori(e.target.value); setPage(1); }}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all">
                                <option value="all">Semua Layanan</option>
                                <option value="umroh">Umroh</option>
                                <option value="haji">Haji</option>
                                <option value="wisata">Wisata</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</label>
                            <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all">
                                <option value="all">Semua Status</option>
                                <option value="tersedia">Kursi Tersedia</option>
                                <option value="terbatas">Kursi Terbatas</option>
                                <option value="full">Full Booked</option>
                            </select>
                        </div>
                        <button onClick={() => setPage(1)}
                            className="px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:brightness-110 flex items-center gap-2 justify-center"
                            style={{ backgroundColor: "#008080" }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Cari Jadwal
                        </button>
                    </div>
                </div>

                {/* ── Upcoming Schedule List ── */}
                <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-6">
                    {loading ? (
                        <div className="text-center py-16 text-gray-400">
                            <svg className="animate-spin w-10 h-10 mx-auto border-4 border-teal-500 border-t-transparent rounded-full mb-3"></svg>
                            <p className="font-semibold text-gray-500">Memuat jadwal...</p>
                        </div>
                    ) : paginated.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="font-semibold">Belum ada jadwal untuk filter ini</p>
                            <p className="text-sm mt-1">Coba ubah filter pencarian</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {paginated.map((entry, idx) => renderRow(entry, idx))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)} className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                                    style={{ backgroundColor: page === p ? "#008080" : "transparent", color: page === p ? "#fff" : "#6b7280", border: page === p ? "none" : "1px solid #e5e7eb" }}>
                                    {p}
                                </button>
                            ))}
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    )}
                </div>

                {/* ── History Section ── */}
                {history.length > 0 && (
                    <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-10">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition mb-4"
                        >
                            <svg className={`w-4 h-4 transition-transform ${showHistory ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            Riwayat Keberangkatan ({history.length} jadwal)
                        </button>

                        {showHistory && (
                            <div className="space-y-2">
                                {history.map((entry, idx) => renderRow(entry, idx + 1000))}
                            </div>
                        )}
                    </div>
                )}

                {/* Back */}
                <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-10 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-teal-700 font-semibold text-sm hover:underline">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Beranda
                    </Link>
                </div>
            </main>
        </>
    );
}
