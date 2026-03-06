"use client";

import { useState } from "react";
import Image from "next/image";
import type { Paket } from "@/lib/packagesData";
import { FALLBACK_IMAGES } from "@/lib/packagesData";

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/90" onClick={onClose}>
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl aspect-[4/5]" onClick={e => e.stopPropagation()}>
                <Image src={src} alt={alt} fill className="object-cover" />
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 z-[101] text-white p-2 bg-white/10 rounded-full">Tutup</button>
        </div>
    );
}

function StarRating({ count }: { count: number }) {
    return (
        <div className="flex gap-0.5 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`w-3.5 h-3.5 ${i < count ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

function PaketCard({ paket, onImageClick, isHistory }: { paket: Paket; onImageClick: (src: string, alt: string) => void; isHistory?: boolean }) {
    const wa = `https://wa.me/6282311000853?text=${encodeURIComponent(`Halo MZM Travel, saya tertarik dengan Wisata Islam: "${paket.nama}" - ${paket.harga}. Mohon info.`)}`;
    const imgSrc = paket.image || FALLBACK_IMAGES.wisata;

    return (
        <div className={`bg-white rounded-[2rem] overflow-hidden flex flex-col border border-gray-100 shadow-sm transition-all duration-300 ${isHistory ? 'opacity-60 grayscale' : 'hover:shadow-2xl hover:-translate-y-1'}`}>
            <div className={`relative w-full aspect-[4/5] overflow-hidden cursor-zoom-in group/img`} onClick={() => onImageClick(imgSrc, paket.nama)}>
                <Image src={imgSrc} alt={paket.nama} fill className="object-cover transition-transform duration-500 group-hover/img:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <span className="absolute top-4 left-4 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full text-white shadow-md" style={{ backgroundColor: isHistory ? "#6b7280" : "#1a6fb0" }}>
                    {isHistory ? "SUDAH BERANGKAT" : (paket.badge || "DESTINASI POPULER")}
                </span>
            </div>

            <div className="flex flex-col flex-1 p-5 gap-4">
                <h3 className="text-base font-extrabold text-gray-900 uppercase tracking-wide leading-snug">{paket.nama}</h3>

                <div className="flex flex-col gap-2.5">
                    {/* Jadwal */}
                    <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2 text-gray-500">
                            <svg className="w-4 h-4 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">Jadwal Berangkat</span>
                        </div>
                        <span className="font-bold text-gray-800 text-right">{paket.jadwal || "Tahun 2025/2026"}</span>
                    </div>
                    {/* Durasi */}
                    <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2 text-gray-500">
                            <svg className="w-4 h-4 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">Durasi Perjalanan</span>
                        </div>
                        <span className="font-bold text-gray-800 text-right">{paket.durasi}</span>
                    </div>
                    {/* Keberangkatan */}
                    <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2 text-gray-500">
                            <svg className="w-4 h-4 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">Keberangkatan</span>
                        </div>
                        <span className="font-bold text-gray-800 text-right max-w-[120px] truncate">{paket.kotaAsal || "Jakarta"}</span>
                    </div>
                    {/* Maskapai */}
                    {paket.maskapai && (
                        <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2 text-gray-500">
                                <svg className="w-4 h-4 flex-shrink-0 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                </svg>
                                <span className="font-medium">Maskapai</span>
                            </div>
                            <span className="font-bold text-gray-800 text-right max-w-[130px] line-clamp-2">{paket.maskapai}</span>
                        </div>
                    )}
                    {/* Hotel Bintang */}
                    <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2 text-gray-500">
                            <svg className="w-4 h-4 flex-shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-medium">Hotel</span>
                        </div>
                        <StarRating count={paket.hotelMekkahBintang || 4} />
                    </div>
                    {/* Harga (Dipindah kesini dari tombol footer) */}
                    <div className="mt-2 pt-3 border-t border-dashed border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500">Harga Paket</span>
                            <span className="text-lg font-black text-amber-500">{paket.harga}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto px-5 pb-5">
                {isHistory ? (
                    <div className="w-full flex justify-center py-3 rounded-full font-bold text-sm text-gray-400 bg-gray-100">Sudah Berangkat</div>
                ) : (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm text-white bg-[#25D366] shadow-md hover:bg-[#20bd5a] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Hubungi via WhatsApp
                    </a>
                )}
            </div>
        </div>
    );
}

export default function WisataClientList({ initialPakets }: { initialPakets: Paket[] }) {
    const [search, setSearch] = useState("");
    const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
    const [showHistory, setShowHistory] = useState(false);

    const filtered = initialPakets.filter(p => (p.nama || "").toLowerCase().includes(search.toLowerCase()) || (p.deskripsi || "").toLowerCase().includes(search.toLowerCase()));

    const isAllBerangkat = (p: Paket) => {
        if (p.statusPublish === "Sudah Berangkat") return true;
        const dates = p.tanggalBerangkat || [];
        return dates.length > 0 && dates.every(d => d.status === "berangkat");
    };
    const activePackages = filtered.filter(p => !isAllBerangkat(p));
    const historyPackages = filtered.filter(p => isAllBerangkat(p));

    return (
        <>
            {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}

            <div className="relative z-10 -mt-7 max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-3 border border-gray-100">
                    <input type="text" placeholder="Cari destinasi..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 px-3 py-2 outline-none" />
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
                {activePackages.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">Destinasi tidak ditemukan</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {activePackages.map(p => <PaketCard key={p.id} paket={p} onImageClick={(_, alt) => setLightbox({ src: p.image || FALLBACK_IMAGES.wisata, alt })} />)}
                    </div>
                )}
            </div>

            {historyPackages.length > 0 && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
                    <button onClick={() => setShowHistory(!showHistory)} className="w-full py-3 font-bold text-gray-400">Riwayat ({historyPackages.length})</button>
                    {showHistory && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-2">
                            {historyPackages.map(p => <PaketCard key={p.id} paket={p} isHistory onImageClick={(_, alt) => setLightbox({ src: p.image || FALLBACK_IMAGES.wisata, alt })} />)}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
