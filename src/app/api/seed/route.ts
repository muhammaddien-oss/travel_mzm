import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        ok: true,
        message: "Dummy data has been removed. Seeding is disabled."
    });
}

