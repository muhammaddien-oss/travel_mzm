import Image from "next/image";
import Link from "next/link";
import PackageNavbar from "@/components/PackageNavbar";
import { fetchPaketsServerSide } from "@/lib/fetchPaketsServer";
import PaketClientList from "./PaketClientList";

export const dynamic = "force-dynamic"; // selalu fetch fresh dari DB, tidak ada cache delay

export default async function PaketUmrohPage() {
    const allPakets = await fetchPaketsServerSide();
    const umrohPakets = allPakets.filter(p => p.kategori === "umroh");

    return (
        <>
            <PackageNavbar />
            <main className="min-h-screen pt-16" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e6f2f2 50%, #f0fdfa 100%)" }}>
                {/* ── Hero Header ─────────────────────────── */}
                <div className="relative text-white pt-14 pb-20 px-4 overflow-hidden" style={{ background: "linear-gradient(135deg, #014E4E 0%, #008080 100%)" }}>
                    <div className="absolute inset-0 opacity-10">
                        <Image src="/img/umroh-card.png" alt="" fill className="object-cover" />
                    </div>
                    <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 blur-xl" />
                    <div className="relative max-w-4xl mx-auto text-center px-2">
                        <span className="inline-block bg-white/20 text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
                            Paket Kami
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3">Paket Umroh</h1>
                        <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                            Temukan paket umroh yang sesuai kebutuhan Anda. Semua paket didampingi muthawif berpengalaman.
                        </p>
                    </div>
                </div>

                <PaketClientList initialPakets={umrohPakets} />

                {/* ── Back link ───────────────────────────── */}
                <div className="text-center pb-12 mt-8">
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
