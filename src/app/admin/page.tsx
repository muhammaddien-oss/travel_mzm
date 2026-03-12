"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PackageNavbar from "@/components/PackageNavbar";
import { type Paket } from "@/lib/packagesData";
import { type Review } from "@/lib/reviewsData";
import {
    IoLockClosedOutline, IoPersonOutline, IoKeyOutline, IoLogInOutline,
    IoCubeOutline, IoCalendarOutline, IoChatbubblesOutline, IoAddCircleOutline,
    IoCloseCircleOutline, IoCreateOutline, IoTrashOutline, IoCheckmarkCircle,
    IoAlertCircle, IoAirplaneOutline, IoStarOutline, IoStar, IoChevronForward,
    IoImageOutline, IoCloudUploadOutline, IoEyeOutline, IoListOutline,
    IoGridOutline, IoPricetagOutline, IoTimeOutline, IoLocationOutline,
    IoDocumentTextOutline, IoWalletOutline,
    IoChevronDown, IoCloseOutline, IoRocketOutline,
    IoMapOutline, IoColorPaletteOutline, IoSaveOutline,
} from "react-icons/io5";

// ─── Constants ──────────────────────────────────────────────────────────────

const EMPTY_FORM: Omit<Paket, "id"> = {
    kategori: "umroh", tipeUmroh: "reguler", nama: "", harga: "",
    durasi: "", jadwal: "",
    badge: "", badgeColor: "#008080", fasilitas: [], deskripsi: "", image: "",
    hotelMekkahBintang: 4, maskapai: "", kotaAsal: "",
    tanggalBerangkat: [], statusPublish: "Tersedia",
};

const KAT_LABELS: Record<string, string> = { umroh: "Umroh", haji: "Haji", wisata: "Wisata Islam" };
const KAT_COLORS: Record<string, string> = { umroh: "#008080", haji: "#c97d20", wisata: "#1a6fb0" };

// ─── Reusable UI Components ─────────────────────────────────────────────────

function Label({ icon: Icon, children }: { icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
    return (
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5">
            {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
            {children}
        </label>
    );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition ${props.className || ""}`} />;
}

function Select({ children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
    return <select {...rest} className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition ${rest.className || ""}`}>{children}</select>;
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white resize-none transition" />;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>{children}</div>;
}

function CardHead({ icon: Icon, title, sub, action }: { icon: React.ComponentType<{ className?: string }>; title: string; sub?: string; action?: React.ReactNode }) {
    return (
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 bg-gray-50/60">
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center"><Icon className="w-4 h-4 text-teal-600" /></div>
                <div><h2 className="text-sm font-bold text-gray-800">{title}</h2>{sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}</div>
            </div>
            {action}
        </div>
    );
}

function Badge({ label, color }: { label: string; color: string }) {
    return <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>{label}</span>;
}

function Toast({ toast }: { toast: { msg: string; type: "ok" | "err" } | null }) {
    if (!toast) return null;
    return (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border transition-all animate-in slide-in-from-right ${toast.type === "err" ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
            {toast.type === "err" ? <IoAlertCircle className="w-4 h-4" /> : <IoCheckmarkCircle className="w-4 h-4" />}
            {toast.msg}
        </div>
    );
}

function Empty({ icon: Icon, msg, hint }: { icon: React.ComponentType<{ className?: string }>; msg: string; hint?: string }) {
    return (
        <div className="text-center py-14 px-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3"><Icon className="w-6 h-6 text-gray-300" /></div>
            <p className="text-sm font-medium text-gray-500">{msg}</p>
            {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
    );
}


// ─── Main ───────────────────────────────────────────────────────────────────

export default function AdminPage() {
    const [pakets, setPakets] = useState<Paket[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [tab, setTab] = useState<"paket" | "testimoni" | "jadwal">("paket");
    const [toast, setToastState] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [savingStatusId, setSavingStatusId] = useState<string | null>(null);
    const [form, setForm] = useState<Omit<Paket, "id">>(EMPTY_FORM);
    const [editId, setEditId] = useState<string | null>(null);
    const [showRiwayat, setShowRiwayat] = useState(false);
    const [filterKat, setFilterKat] = useState<"all" | Paket["kategori"]>("all");
    const [filterUmrohType, setFilterUmrohType] = useState<"all" | "reguler" | "plus">("all");
    const [imagePreview, setImagePreview] = useState("");
    // Jadwal
    const [jadwalShowHistory, setJadwalShowHistory] = useState(false);
    const [jadwalFilterKat, setJadwalFilterKat] = useState<"all" | Paket["kategori"]>("all");
    const [jadwalNewDate, setJadwalNewDate] = useState("");
    const [jadwalNewPaket, setJadwalNewPaket] = useState("");
    // Review
    const [editReviewId, setEditReviewId] = useState<string | null>(null);
    const [reviewForm, setReviewForm] = useState<Partial<Review>>({});

    useEffect(() => {
        fetch("/api/pakets").then(r => r.json()).then(setPakets);
        fetch("/api/reviews").then(r => r.json()).then(setReviews);
    }, []);

    const showToast = (msg: string, type: "ok" | "err" = "ok") => { setToastState({ msg, type }); setTimeout(() => setToastState(null), 3000); };
    const f = (k: keyof Omit<Paket, "id">, v: unknown) => setForm(prev => ({ ...prev, [k]: v }));

    // Auth
    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user, password: pass })
            });
            if (res.ok) { setAuth(true); showToast("Login berhasil!"); }
            else { showToast("Username / password salah.", "err"); }
        } catch {
            showToast("Terjadi kesalahan sistem.", "err");
        }
    }

    // Package CRUD
    function resetForm() { setForm(EMPTY_FORM); setImagePreview(""); setEditId(null); }

    async function handleSave() {
        if (!form.nama || !form.harga || !form.durasi) { showToast("Nama, harga & durasi wajib!", "err"); return; }
        if (isSaving) return;
        setIsSaving(true);
        try {
            let updated: Paket[];

            // CASCADE status "Sudah Berangkat" to nested schedules
            let payload = { ...form };
            if (payload.statusPublish === "Sudah Berangkat" && payload.tanggalBerangkat) {
                payload.tanggalBerangkat = payload.tanggalBerangkat.map(t => ({ ...t, status: "berangkat" }));
            }

            if (editId) {
                const res = await fetch("/api/pakets", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, ...payload }) });
                const saved = await res.json();
                updated = pakets.map(p => p.id === editId ? saved : p);
                showToast("Paket berhasil diperbarui.");
            } else {
                const res = await fetch("/api/pakets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
                const saved = await res.json();
                updated = [...pakets, saved];
                showToast("Berhasil! Paket baru ditambahkan.");
            }
            setPakets(updated); resetForm(); setShowForm(false);
        } catch (error) {
            showToast("Gagal menyimpan paket.", "err");
        } finally {
            setIsSaving(false);
        }
    }

    function handleEdit(p: Paket) {
        const { id, ...rest } = p;
        setForm({ ...EMPTY_FORM, ...rest });
        setImagePreview(p.image || ""); setEditId(id); setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(id: string) {
        if (!confirm("Hapus paket ini?")) return;
        await fetch(`/api/pakets?id=${id}`, { method: "DELETE" });
        const u = pakets.filter(p => p.id !== id);
        setPakets(u); showToast("Paket dihapus.");
    }

    async function handleStatusChange(p: Paket, v: string) {
        if (v !== "Tersedia" && v !== "Sudah Berangkat") return;
        if (savingStatusId === p.id) return;

        setSavingStatusId(p.id);
        try {
            let newTgl = p.tanggalBerangkat || [];
            if (v === "Sudah Berangkat") {
                // Semua jadwal → berangkat
                newTgl = newTgl.map(t => ({ ...t, status: "berangkat" as const }));
            } else {
                // Kembalikan ke Tersedia: jadwal yang "berangkat" → "tersedia" lagi
                newTgl = newTgl.map(t => ({ ...t, status: (t.status === "berangkat" ? "tersedia" : t.status) as "tersedia" | "terbatas" | "full" | "berangkat" }));
            }

            const dataToSave = { ...p, statusPublish: v, tanggalBerangkat: newTgl };
            await fetch("/api/pakets", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dataToSave) });

            const u = pakets.map(i => i.id === p.id ? { ...i, statusPublish: v as "Tersedia" | "Sudah Berangkat", tanggalBerangkat: newTgl } : i);
            setPakets(u);
            showToast(`Status "${p.nama}" diubah ke ${v}.`);
        } catch {
            showToast("Gagal mengubah status.", "err");
        } finally {
            setSavingStatusId(null);
        }
    }

    function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]; if (!file) return;
        const r = new FileReader(); r.onloadend = () => { const b = r.result as string; setImagePreview(b); f("image", b); }; r.readAsDataURL(file);
    }

    // Review CRUD
    function handleEditReview(r: Review) { setEditReviewId(r.id); setReviewForm(r); window.scrollTo({ top: 0, behavior: "smooth" }); }
    async function handleSaveReview() {
        if (editReviewId) {
            const { id: _id, ...formData } = reviewForm as Review;
            void _id;
            await fetch("/api/reviews", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editReviewId, ...formData }) });
            showToast("Testimoni diperbarui.");
        }
        const res = await fetch("/api/reviews");
        setReviews(await res.json());
        setEditReviewId(null); setReviewForm({});
    }
    async function handleDeleteReview(id: string) {
        if (!confirm("Hapus testimoni?")) return;
        await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
        const res = await fetch("/api/reviews");
        setReviews(await res.json());
        showToast("Testimoni dihapus.");
    }

    const filtered = (() => {
        let result = filterKat === "all" ? pakets : pakets.filter(p => p.kategori === filterKat);
        if (filterKat === "umroh" && filterUmrohType !== "all") {
            result = result.filter(p => p.tipeUmroh === filterUmrohType);
        }
        return result;
    })();
    const activePkgs = filtered.filter(p => p.statusPublish !== "Sudah Berangkat");
    const histPkgs = filtered.filter(p => p.statusPublish === "Sudah Berangkat");

    // ─── LOGIN ──────────────────────────────────────────────────────────
    if (!auth) return (
        <>
            <PackageNavbar />
            <Toast toast={toast} />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-gray-100 px-4 pt-20 pb-10">
                <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 pt-8 pb-6 text-center bg-gradient-to-b from-teal-700 to-teal-800 text-white">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3"><IoLockClosedOutline className="w-7 h-7" /></div>
                        <h1 className="text-xl font-extrabold">Admin Panel</h1>
                        <p className="text-teal-200 text-xs mt-1 uppercase tracking-widest font-semibold">Akses Terbatas</p>
                    </div>
                    <form onSubmit={handleLogin} className="px-8 py-7 space-y-4">
                        <div><Label icon={IoPersonOutline}>Username</Label><Input type="text" value={user} onChange={e => setUser(e.target.value)} placeholder="Masukkan username" required /></div>
                        <div><Label icon={IoKeyOutline}>Password</Label><Input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" required /></div>
                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2">
                            <IoLogInOutline className="w-5 h-5" /> Masuk
                        </button>
                    </form>
                </div>
            </div>
        </>
    );

    function FormPanel() {
        return (
            <Card>
                <CardHead icon={editId ? IoCreateOutline : IoAddCircleOutline} title={editId ? "Edit Paket" : "Tambah Paket Baru"} sub="Isi data paket yang diperlukan" />
                <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><Label icon={IoGridOutline}>Kategori *</Label><Select value={form.kategori} onChange={e => f("kategori", e.target.value)}><option value="umroh">Umroh</option><option value="haji">Haji</option><option value="wisata">Wisata Islam</option></Select></div>
                        {form.kategori === "umroh" && <div><Label icon={IoListOutline}>Tipe Umroh</Label><Select value={form.tipeUmroh || "reguler"} onChange={e => f("tipeUmroh", e.target.value)}><option value="reguler">Reguler</option><option value="plus">Plus</option></Select></div>}
                        <div><Label icon={IoCubeOutline}>Nama Paket *</Label><Input type="text" placeholder="cth: Umroh Reguler 9 Hari" value={form.nama} onChange={e => f("nama", e.target.value)} /></div>
                        <div><Label icon={IoWalletOutline}>Harga *</Label><Input type="text" placeholder="cth: Rp 25.000.000" value={form.harga} onChange={e => f("harga", e.target.value)} /></div>
                        <div><Label icon={IoTimeOutline}>Durasi *</Label><Input type="text" placeholder="cth: 9 Hari" value={form.durasi} onChange={e => f("durasi", e.target.value)} /></div>
                        <div><Label icon={IoCalendarOutline}>Jadwal</Label><Input type="text" placeholder="cth: Setiap Bulan" value={form.jadwal || ""} onChange={e => f("jadwal", e.target.value)} /></div>
                        <div><Label icon={IoAirplaneOutline}>Maskapai</Label><Input type="text" placeholder="cth: Garuda Indonesia" value={form.maskapai || ""} onChange={e => f("maskapai", e.target.value)} /></div>
                        <div><Label icon={IoLocationOutline}>Berangkat Dari</Label><Input type="text" placeholder="cth: Jakarta (CGK)" value={form.kotaAsal || ""} onChange={e => f("kotaAsal", e.target.value)} /></div>
                        <div><Label icon={IoStarOutline}>Bintang Hotel</Label><Select value={form.hotelMekkahBintang || 4} onChange={e => f("hotelMekkahBintang", Number(e.target.value))}><option value={5}>⭐⭐⭐⭐⭐ Bintang 5</option><option value={4}>⭐⭐⭐⭐ Bintang 4</option><option value={3}>⭐⭐⭐ Bintang 3</option><option value={2}>⭐⭐ Bintang 2</option><option value={0}>— (Tidak Ada / Wisata)</option></Select></div>
                        <div>
                            <Label icon={IoRocketOutline}>Status Paket</Label>
                            <div className="relative">
                                <Select value={form.statusPublish || "Tersedia"} onChange={e => f("statusPublish", e.target.value)} className="!bg-white !border-teal-100 !text-teal-800 !shadow-sm focus:!ring-teal-500/20">
                                    <option value="Tersedia">Tersedia</option>
                                    <option value="Sudah Berangkat">Sudah Berangkat</option>
                                </Select>
                            </div>
                        </div>
                        <div><Label icon={IoPricetagOutline}>Label Badge</Label><Input type="text" placeholder="cth: TERLARIS" value={form.badge} onChange={e => f("badge", e.target.value)} /></div>
                        {/* Gambar */}
                        <div className="sm:col-span-2">
                            <Label icon={IoImageOutline}>Foto Paket</Label>
                            <div className="flex items-start gap-3 mt-1">
                                <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                                    {imagePreview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : <IoImageOutline className="w-6 h-6 text-gray-300" />}
                                </div>
                                <label className="flex-1 cursor-pointer">
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-teal-400 hover:bg-teal-50/30 transition text-center">
                                        <IoCloudUploadOutline className="w-6 h-6 mx-auto text-teal-500 mb-1" />
                                        <p className="text-sm font-semibold text-gray-700">Upload gambar</p>
                                        <p className="text-xs text-gray-400">PNG, JPG, WEBP</p>
                                        {imagePreview && <p className="text-xs text-teal-600 mt-1 font-medium flex items-center justify-center gap-1"><IoCheckmarkCircle className="w-3.5 h-3.5" /> Terpilih</p>}
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                                </label>
                            </div>
                            {imagePreview && <button type="button" onClick={() => { setImagePreview(""); f("image", ""); }} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 mt-1.5 transition font-medium"><IoTrashOutline className="w-3.5 h-3.5" /> Hapus</button>}
                        </div>
                    </div>
                </div>
                {/* Footer */}
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
                    <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition" disabled={isSaving}><IoCloseOutline className="w-4 h-4" /> Batal</button>
                    <button type="button" onClick={handleSave} disabled={isSaving} className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white transition ${isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}`}><IoSaveOutline className="w-4 h-4" />{isSaving ? "Menyimpan..." : editId ? "Simpan" : "Tambah"}</button>
                </div>
            </Card>
        );
    }

    // ─── Package Row ────────────────────────────────────────────────────
    function PaketRow({ p, hist = false }: { p: Paket; hist?: boolean }) {
        return (
            <div className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition ${hist ? "opacity-50" : ""}`}>
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt={p.nama} className="w-full h-full object-cover" />
                    ) : <IoImageOutline className="w-5 h-5 text-gray-300" />}
                </div>
                <Badge label={hist ? "RIWAYAT" : p.kategori} color={hist ? "#9ca3af" : (KAT_COLORS[p.kategori] || "#008080")} />
                {!hist && p.kategori === "umroh" && p.tipeUmroh && (<span className={`text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full ${p.tipeUmroh === "plus" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-teal-50 text-teal-700 border border-teal-200"}`}>{p.tipeUmroh === "plus" ? "Plus" : "Reguler"}</span>)}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate whitespace-normal">{p.nama}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate flex items-center gap-1"><IoWalletOutline className="w-3 h-3 flex-shrink-0" /> {p.harga} · {p.durasi}{p.jadwal ? ` · ${p.jadwal}` : ""}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="relative hidden sm:block">
                        {savingStatusId === p.id ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200">
                                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                                Menyimpan...
                            </span>
                        ) : (
                        <select
                            value={p.statusPublish || "Tersedia"}
                            disabled={!!savingStatusId}
                            onChange={(e) => {
                                const newStatus = e.target.value;
                                if (confirm(`Yakin ingin mengubah status menjadi "${newStatus}"?`)) {
                                    handleStatusChange(p, newStatus);
                                }
                            }}
                            className={`appearance-none text-xs font-bold rounded-full pl-4 pr-8 py-1.5 border cursor-pointer outline-none transition-all shadow-[0_2px_8px_-3px_rgba(0,0,0,0.1)] ${hist ? "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200" : "bg-white border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 focus:ring-2 focus:ring-teal-500/20"}`}
                        >
                            <option value="Tersedia">Tersedia</option>
                            <option value="Sudah Berangkat">Sudah Berangkat</option>
                        </select>
                        )}
                        {savingStatusId !== p.id && <IoChevronDown className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${hist ? "text-gray-400" : "text-teal-500"}`} />}
                    </div>
                    <div className="flex sm:flex-row flex-col gap-1.5">
                        <button onClick={() => handleEdit(p)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"><IoCreateOutline className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"><IoTrashOutline className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Jadwal Tab ─────────────────────────────────────────────────────
    function JadwalTab() {
        const statusCls: Record<string, string> = { tersedia: "bg-white border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 focus:ring-2 focus:ring-teal-500/20", terbatas: "bg-white border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 focus:ring-2 focus:ring-amber-500/20", full: "bg-white border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 focus:ring-2 focus:ring-red-500/20", berangkat: "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200" };
        const statusIconColors: Record<string, string> = { tersedia: "text-teal-400", terbatas: "text-amber-400", full: "text-red-400", berangkat: "text-gray-400" };
        type FE = { pid: string; nama: string; kat: Paket["kategori"]; tgl: string; status: string; idx: number };
        const allM = pakets.flatMap(p => (p.tanggalBerangkat || []).map((t, i) => ({ pid: p.id, idx: i, nama: p.nama, kat: p.kategori, tgl: t.tanggal, status: t.status })))
            .filter(e => (jadwalFilterKat === "all" || e.kat === jadwalFilterKat))
            .sort((a, b) => a.tgl.localeCompare(b.tgl));

        const todayDate = new Date().toISOString().split("T")[0];
        const activeJadwal = allM.filter(e => e.status !== "berangkat" && e.tgl >= todayDate);
        const histJadwal = allM.filter(e => e.status === "berangkat" || e.tgl < todayDate);

        async function updStatus(pid: string, idx: number, s: string) {
            const u = pakets.map(p => { 
                if (p.id !== pid) return p; 
                
                // 1. Update status per-tanggal
                const d = [...(p.tanggalBerangkat || [])]; 
                d[idx] = { ...d[idx], status: s as "tersedia" | "terbatas" | "full" | "berangkat" }; 
                
                // 2. Cek semua tanggal untuk auto-update statusPublish paket
                //    Jadwal dianggap "selesai" jika status "berangkat" ATAU tanggalnya sudah lewat hari ini
                const today = new Date().toISOString().split("T")[0];
                const isAllBerangkat = d.length > 0 && d.every(tgl => tgl.status === "berangkat" || tgl.tanggal < today);
                const newStatusPublish = (isAllBerangkat ? "Sudah Berangkat" : "Tersedia") as "Tersedia" | "Sudah Berangkat";
                
                return { ...p, statusPublish: newStatusPublish, tanggalBerangkat: d }; 
            });
            const target = u.find(p => p.id === pid);
            if (target) {
                await fetch("/api/pakets", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(target) });
                if (target.statusPublish === "Sudah Berangkat") {
                    showToast(`Sistem: Semua jadwal berangkat, paket "${target.nama}" otomatis ditutup.`);
                }
            }
            setPakets(u);
        }
        async function rmDate(pid: string, idx: number) {
            if (!confirm("Hapus jadwal keberangkatan ini?")) return;
            const u = pakets.map(p => p.id !== pid ? p : { ...p, tanggalBerangkat: (p.tanggalBerangkat || []).filter((_, i) => i !== idx) });
            const target = u.find(p => p.id === pid);
            if (target) await fetch("/api/pakets", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(target) });
            setPakets(u); showToast("Tanggal dihapus.");
        }
        async function addDate() {
            if (!jadwalNewDate || !jadwalNewPaket) { showToast("Pilih paket & tanggal.", "err"); return; }
            const u = pakets.map(p => { if (p.id !== jadwalNewPaket) return p; if ((p.tanggalBerangkat || []).some(t => t.tanggal === jadwalNewDate)) { showToast("Tanggal sudah ada.", "err"); return p; } return { ...p, tanggalBerangkat: [...(p.tanggalBerangkat || []), { tanggal: jadwalNewDate, status: "tersedia" as const }].sort((a, b) => a.tanggal.localeCompare(b.tanggal)) }; });
            const target = u.find(p => p.id === jadwalNewPaket);
            if (target) await fetch("/api/pakets", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(target) });
            setPakets(u); setJadwalNewDate(""); showToast("Jadwal ditambahkan.");
        }

        const months = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGS", "SEP", "OKT", "NOV", "DES"];

        return (
            <div className="space-y-6">
                <Card>
                    <CardHead icon={IoAddCircleOutline} title="Tambah Jadwal Baru" sub="Pilih paket & tentukan tanggal" />
                    <div className="p-5 flex flex-col sm:flex-row gap-3">
                        <Select
                            value={jadwalNewPaket}
                            onChange={e => setJadwalNewPaket(e.target.value)}
                            className="flex-1"
                        >
                            <option value="">Pilih Paket...</option>
                            {pakets.filter(p => p.statusPublish !== "Sudah Berangkat").map(p => <option key={p.id} value={p.id}>{p.nama} ({p.kategori})</option>)}
                        </Select>
                        <Input type="date" value={jadwalNewDate} onChange={e => setJadwalNewDate(e.target.value)} className="sm:w-44" />
                        <button onClick={addDate} className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-white text-sm font-bold bg-teal-600 hover:bg-teal-700 transition whitespace-nowrap"><IoAddCircleOutline className="w-4 h-4" /> Tambah</button>
                    </div>
                </Card>

                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1.5"><IoCalendarOutline className="w-4 h-4 text-teal-600" /> Jadwal Mendatang <span className="text-gray-400 font-normal ml-1">({activeJadwal.length})</span></h2>
                    <div className="flex gap-1.5 flex-wrap">{(["all", "umroh", "haji", "wisata"] as const).map(k => <button key={k} onClick={() => setJadwalFilterKat(k)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${jadwalFilterKat === k ? "bg-teal-700 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>{k === "all" ? "Semua" : KAT_LABELS[k]}</button>)}</div>
                </div>

                <Card>
                    <div className="divide-y divide-gray-100">
                        {activeJadwal.length === 0 ? <Empty icon={IoCalendarOutline} msg="Belum ada jadwal mendatang aktif" hint="Tambah jadwal baru di atas" /> : activeJadwal.map(e => {
                            const [year, mStr, day] = e.tgl.split("-");
                            const mIdx = parseInt(mStr) - 1;
                            return (
                                <div key={`${e.pid}-${e.idx}`} className="flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50/50 transition">
                                    <div className="flex-shrink-0 w-12 text-center">
                                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: KAT_COLORS[e.kat] }}>{months[mIdx]}</p>
                                        <p className="text-xl font-black leading-tight" style={{ color: KAT_COLORS[e.kat] }}>{day}</p>
                                        <p className="text-[9px] text-gray-400">{year}</p>
                                    </div>
                                    <div className="flex-1 min-w-0"><p className="font-semibold text-sm text-gray-900 truncate">{e.nama}</p><Badge label={e.kat} color={KAT_COLORS[e.kat] || "#008080"} /></div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <div className="relative">
                                            <select value={e.status} onChange={ev => updStatus(e.pid, e.idx, ev.target.value)} className={`appearance-none text-[10px] font-bold uppercase tracking-[0.05em] rounded-full pl-3 pr-7 py-1.5 border cursor-pointer outline-none transition-all shadow-[0_2px_8px_-3px_rgba(0,0,0,0.1)] ${statusCls[e.status] || statusCls.tersedia}`}>
                                                <option value="tersedia">Tersedia</option><option value="terbatas">Terbatas</option><option value="full">Full Booked</option><option value="berangkat">Berangkat</option>
                                            </select>
                                            <IoChevronDown className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 ${statusIconColors[e.status] || "text-teal-500"}`} />
                                        </div>
                                        <button onClick={() => rmDate(e.pid, e.idx)} className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 transition flex items-center justify-center"><IoTrashOutline className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            );
                        })}

                        {histJadwal.length > 0 && (
                            <>
                                <button type="button" onClick={() => setJadwalShowHistory(!jadwalShowHistory)} className="w-full px-4 py-2.5 bg-gray-50 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer border-t border-gray-100">
                                    <IoTimeOutline className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Riwayat & Sudah Berangkat ({histJadwal.length})</span>
                                    <div className="h-px flex-1 bg-gray-200" />
                                    <IoChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${jadwalShowHistory ? 'rotate-180' : ''}`} />
                                </button>
                                {jadwalShowHistory && histJadwal.map(e => {
                                    const [year, mStr, day] = e.tgl.split("-");
                                    const mIdx = parseInt(mStr) - 1;
                                    return (
                                        <div key={`hist-${e.pid}-${e.idx}`} className="flex items-center gap-4 px-4 py-3.5 bg-gray-50/30 opacity-60 hover:opacity-100 transition">
                                            <div className="flex-shrink-0 w-12 text-center grayscale">
                                                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: KAT_COLORS[e.kat] }}>{months[mIdx]}</p>
                                                <p className="text-xl font-black leading-tight" style={{ color: KAT_COLORS[e.kat] }}>{day}</p>
                                                <p className="text-[9px] text-gray-400">{year}</p>
                                            </div>
                                            <div className="flex-1 min-w-0"><p className="font-semibold text-sm text-gray-900 truncate">{e.nama}</p><Badge label={e.kat} color="#9ca3af" /></div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <div className="relative">
                                                    <select value={e.status} onChange={ev => updStatus(e.pid, e.idx, ev.target.value)} className={`appearance-none text-[10px] font-bold uppercase tracking-[0.05em] rounded-full pl-3 pr-7 py-1.5 border cursor-pointer outline-none transition-all shadow-[0_2px_8px_-3px_rgba(0,0,0,0.1)] bg-white border-gray-200 text-gray-500 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200`}>
                                                        <option value="tersedia">Ke Tersedia</option><option value="terbatas">Ke Terbatas</option><option value="full">Ke Full Booked</option><option value="berangkat">Berangkat</option>
                                                    </select>
                                                    <IoChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                                </div>
                                                <button onClick={() => rmDate(e.pid, e.idx)} className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 transition flex items-center justify-center"><IoTrashOutline className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </Card>




                <div className="flex justify-center"><Link href="/jadwal-keberangkatan" target="_blank" className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-teal-800 text-white hover:bg-teal-900 transition"><IoEyeOutline className="w-3.5 h-3.5" /> Lihat Halaman Jadwal ↗</Link></div>
            </div>
        );
    }

    // ─── DASHBOARD ──────────────────────────────────────────────────────
    const tabList: { key: typeof tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
        { key: "paket", label: "Paket Perjalanan", icon: IoAirplaneOutline },
        { key: "jadwal", label: "Jadwal Perjalanan", icon: IoMapOutline },
        { key: "testimoni", label: "Testimoni", icon: IoChatbubblesOutline },
    ];

    return (
        <>
            <PackageNavbar />
            <main className="min-h-screen pt-16 bg-gray-50">
                <Toast toast={toast} />

                {/* Header */}
                <div className="text-white" style={{ background: "linear-gradient(135deg, #014E4E 0%, #008080 100%)" }}>
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center"><IoAirplaneOutline className="w-5 h-5" /></div>
                                <div><h1 className="text-xl font-extrabold tracking-tight">Admin Panel</h1><p className="text-white/60 text-xs mt-0.5">Kelola paket perjalanan, jadwal & testimoni</p></div>
                            </div>
                            {tab === "paket" && (
                                <button onClick={() => { setShowForm(!showForm); resetForm(); }}
                                    className="self-start sm:self-auto flex items-center gap-2 bg-white text-teal-700 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-teal-50 transition shadow">
                                    {showForm ? <><IoCloseCircleOutline className="w-4 h-4" /> Tutup Form</> : <><IoAddCircleOutline className="w-4 h-4" /> Tambah Paket</>}
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-5 bg-white/10 p-1.5 rounded-xl w-fit xl:w-full">
                            {tabList.map(t => (
                                <button key={t.key} onClick={() => setTab(t.key)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${tab === t.key ? "bg-white text-teal-700 shadow" : "text-white/80 hover:text-white hover:bg-white/15"}`}>
                                    <t.icon className="w-4 h-4" /> {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 space-y-6">

                    {tab === "paket" && (
                        <>
                            {showForm && FormPanel()}

                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1.5"><IoAirplaneOutline className="w-4 h-4 text-teal-600" /> Daftar Paket <span className="text-gray-400 font-normal ml-1">({activePkgs.length})</span></h2>
                                <div className="flex gap-1.5 flex-wrap">{(["all", "umroh", "haji", "wisata"] as const).map(k => <button key={k} onClick={() => { setFilterKat(k); if (k !== "umroh") setFilterUmrohType("all"); }} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${filterKat === k ? "bg-teal-700 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>{k === "all" ? "Semua" : KAT_LABELS[k]}</button>)}</div>
                            </div>
                            {filterKat === "umroh" && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs text-gray-400 font-semibold">Tipe:</span>
                                    {(["all", "reguler", "plus"] as const).map(t => (
                                        <button key={t} onClick={() => setFilterUmrohType(t)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${filterUmrohType === t ? "bg-indigo-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
                                        >{t === "all" ? "Semua" : t === "reguler" ? "Umroh Reguler" : "Umroh Plus"}</button>
                                    ))}
                                </div>
                            )}

                            <Card>
                                {filtered.length === 0 ? <Empty icon={IoCubeOutline} msg="Belum ada paket" hint={`Klik "Tambah Paket" untuk memulai`} /> : (
                                    <div className="divide-y divide-gray-100">
                                        {activePkgs.map(p => <div key={p.id}>{PaketRow({ p })}</div>)}
                                        {histPkgs.length > 0 && <>
                                            <button type="button" onClick={() => setShowRiwayat(!showRiwayat)} className="w-full px-4 py-2.5 bg-gray-50 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer">
                                                <IoTimeOutline className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Riwayat ({histPkgs.length})</span>
                                                <div className="h-px flex-1 bg-gray-200" />
                                                <IoChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showRiwayat ? 'rotate-180' : ''}`} />
                                            </button>
                                            {showRiwayat && histPkgs.map(p => <div key={p.id}>{PaketRow({ p, hist: true })}</div>)}
                                        </>}
                                    </div>
                                )}
                            </Card>

                            <Card>
                                <div className="px-5 py-4">
                                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5 mb-3"><IoEyeOutline className="w-3.5 h-3.5" /> Preview Halaman</p>
                                    <div className="flex flex-wrap gap-2">{([["paket-umroh", "Umroh", "#008080"], ["paket-haji", "Haji", "#c97d20"], ["paket-wisata", "Wisata", "#1a6fb0"], ["jadwal-keberangkatan", "Jadwal", "#014E4E"]] as const).map(([h, l, c]) => <a key={h} href={`/${h}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg text-white hover:brightness-110 transition" style={{ backgroundColor: c }}><IoMapOutline className="w-3 h-3" /> {l} ↗</a>)}</div>
                                </div>
                            </Card>
                        </>
                    )}

                    {tab === "testimoni" && (
                        <Card>
                            <CardHead icon={IoChatbubblesOutline} title="Daftar Testimoni" sub={`${reviews.length} testimoni terdaftar`} />
                            {editReviewId && (
                                <div className="p-5 border-b border-gray-100 bg-teal-50/40">
                                    <h3 className="font-bold text-teal-800 text-sm mb-4 flex items-center gap-1.5"><IoCreateOutline className="w-4 h-4" /> Edit Testimoni</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div><Label icon={IoPersonOutline}>Nama</Label><Input type="text" value={reviewForm.name || ""} onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} /></div>
                                        <div><Label icon={IoStarOutline}>Rating</Label><Select value={reviewForm.rating || 5} onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}>{[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Bintang {"⭐".repeat(n)}</option>)}</Select></div>
                                        <div className="sm:col-span-2"><Label icon={IoDocumentTextOutline}>Pesan</Label><Textarea value={reviewForm.text || ""} onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })} rows={3} /></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={handleSaveReview} className="flex items-center gap-1.5 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition"><IoSaveOutline className="w-4 h-4" /> Simpan</button>
                                        <button onClick={() => { setEditReviewId(null); setReviewForm({}); }} className="flex items-center gap-1.5 px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition"><IoCloseOutline className="w-4 h-4" /> Batal</button>
                                    </div>
                                </div>
                            )}
                            {reviews.length === 0 ? <Empty icon={IoChatbubblesOutline} msg="Belum ada testimoni" /> : (
                                <div className="divide-y divide-gray-100">{reviews.map(r => (
                                    <div key={r.id} className="flex flex-col sm:flex-row gap-4 p-5 hover:bg-gray-50 transition">
                                        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">{r.name?.charAt(0)?.toUpperCase() || "?"}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1"><h4 className="font-bold text-gray-900 text-sm">{r.name}</h4><span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-bold border border-yellow-200 flex items-center gap-0.5"><IoStar className="w-3 h-3" /> {r.rating}</span><span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap"><IoCalendarOutline className="w-3 h-3 flex-shrink-0" /> {r.date}</span>{r.location && <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap"><IoLocationOutline className="w-3 h-3 flex-shrink-0" /> {r.location}</span>}</div>
                                            <p className="text-sm text-gray-600 line-clamp-2 md:line-clamp-none">&ldquo;{r.text}&rdquo;</p>
                                        </div>
                                        <div className="flex gap-1.5 sm:flex-col sm:w-20 flex-shrink-0">
                                            <button onClick={() => handleEditReview(r)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition"><IoCreateOutline className="w-3.5 h-3.5" /> Edit</button>
                                            <button onClick={() => handleDeleteReview(r.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition"><IoTrashOutline className="w-3.5 h-3.5" /> Hapus</button>
                                        </div>
                                    </div>
                                ))}</div>
                            )}
                        </Card>
                    )}

                    {tab === "jadwal" && JadwalTab()}
                </div>
            </main>
        </>
    );
}
