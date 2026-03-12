import Image from "next/image";
import Link from "next/link";
import PackageNavbar from "@/components/PackageNavbar";
import { fetchPaketsServerSide } from "@/lib/fetchPaketsServer";
import WisataClientList from "./WisataClientList";

export const dynamic = "force-dynamic"; // selalu fetch fresh dari DB, tidak ada cache delay

export default async function PaketWisataPage() {
    const allPakets = await fetchPaketsServerSide();
    const wisataPakets = allPakets.filter(p => p.kategori === "wisata");

    return (
        <>
            <PackageNavbar />
            <main className="min-h-screen pt-16" style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #f0f9ff 100%)" }}>
                <div className="relative text-white pt-16 pb-20 px-4 overflow-hidden" style={{ background: "linear-gradient(135deg, #0f3460 0%, #1a6fb0 100%)" }}>
                    <div className="absolute inset-0 opacity-10">
                        <Image src="/img/wisata-islam-card.png" alt="" fill className="object-cover" />
                    </div>
                    <div className="relative max-w-4xl mx-auto text-center">
                        <span className="inline-block bg-white/20 text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
                            Destinasi Islami
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Wisata Islam</h1>
                        <p className="text-white/80 text-base max-w-xl mx-auto leading-relaxed">
                            Jelajahi destinasi bersejarah dan indah di dunia Islam bersama tour leader berpengalaman MZM Travel.
                        </p>
                    </div>
                </div>

                <WisataClientList initialPakets={wisataPakets} />

                <div className="text-center pb-12 mt-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-blue-700 font-semibold text-sm hover:underline">
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
