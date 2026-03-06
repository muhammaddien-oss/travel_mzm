import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// GET /api/reviews
export async function GET() {
    const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Supabase Error [Reviews]:", error);
        return NextResponse.json([]); // Return array kosong supaya Homepage tidak crash
    }
    return NextResponse.json(data || []);
}

// POST /api/reviews
export async function POST(req: NextRequest) {
    const body = await req.json();
    const review = {
        id: `rev-${Date.now()}`,
        name: body.name,
        location: body.location || "",
        rating: body.rating || 5,
        text: body.text,
        image: body.image || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`, // Random avatar
        date: new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(new Date()),
    };

    const { data, error } = await supabase.from("reviews").insert([review]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// PUT /api/reviews
export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { id, created_at, ...rest } = body;
    void created_at;

    const { data, error } = await supabase.from("reviews").update(rest).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// DELETE /api/reviews?id=xxx
export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}
