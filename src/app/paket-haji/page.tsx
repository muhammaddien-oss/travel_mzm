import Image from "next/image";
import Link from "next/link";
import PackageNavbar from "@/components/PackageNavbar";
import { fetchPaketsServerSide } from "@/lib/fetchPaketsServer";
import HajiClientList from "./HajiClientList";

export const revalidate = 10; // revalidatePath akan invalidate segera setelah admin save

export default async function PaketHajiPage() {
    const allPakets = await fetchPaketsServerSide();
    const hajiPakets = allPakets.filter(p => p.kategori === "haji");

    return (
        <>
            <PackageNavbar />
            <main className="min-h-screen pt-16" style={{ background: "linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fffbeb 100%)" }}>
                <div className="relative text-white pt-16 pb-20 px-4 overflow-hidden" style={{ background: "linear-gradient(135deg, #78350f 0%, #c97d20 100%)" }}>
                    <div className="absolute inset-0 opacity-10">
                        <Image src="/img/haji-card.png" alt="" fill className="object-cover" />
                    </div>
                    <div className="relative max-w-4xl mx-auto text-center">
                        <span className="inline-block bg-white/20 text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
                            Program Spesial
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">Layanan Haji</h1>
                        <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                            Rencanakan ibadah Haji Anda dengan tenang dan nyaman bersama bimbingan muthawif bersertifikat.
                        </p>
                    </div>
                </div>

                <HajiClientList initialPakets={hajiPakets} />

                <div className="text-center pb-12 mt-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-amber-700 font-semibold text-sm hover:underline">
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
