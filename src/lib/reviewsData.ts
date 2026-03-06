export type Review = {
    id: string;
    name: string;
    location: string;
    rating: number;
    text: string;
    image: string;
    date: string;
};

// ─── Async Supabase Functions ────────────────────────────────────────────────

export async function getAllReviewsAsync(): Promise<Review[]> {
    const res = await fetch("/api/reviews", { cache: "no-store", headers: { 'Cache-Control': 'no-cache' } });
    if (!res.ok) return [];
    return res.json();
}

export async function updateReviewAsync(id: string, data: Partial<Review>): Promise<void> {
    await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
    });
}

export async function deleteReviewAsync(id: string): Promise<void> {
    await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
}

