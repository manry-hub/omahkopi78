import type { APIRoute } from "astro";
import pool from "src/lib/db";

// =========================
// GET (public)
// =========================

export const GET: APIRoute = async () => {
    try {
        const [rows] = await pool.query("SELECT * FROM reservation_tables");

        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};

// =========================
// POST (admin only)
// =========================
export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const { isAuthenticated } = locals.auth();
        // Protect the route by checking if the user is signed in
        if (!isAuthenticated) {
            return new Response("Unauthorized", { status: 401 });
        }
        const body = await request.json();

        const name = body.name?.trim();
        const desc_name = body.desc_name || "";
        const min_pay = Number(body.min_pay);
        const min_people = Number(body.min_people);
        const capacity = Number(body.capacity);
        const image_url = body.image_url || "";

        if (!name || !capacity) {
            return new Response(JSON.stringify({ message: "Nama dan kapasitas wajib diisi!" }), { status: 400 });
        }

        const [result]: any = await pool.query(
            `INSERT INTO reservation_tables 
            (name, desc_name, min_pay, min_people, capacity, image_url)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [name, desc_name, Number.isNaN(min_pay) ? null : min_pay, Number.isNaN(min_people) ? null : min_people, capacity, image_url]
        );

        return new Response(
            JSON.stringify({
                message: "Meja reservasi berhasil ditambahkan!",
                id: result.insertId,
            }),
            { status: 201 }
        );
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err.message || "Server error" }), { status: 500 });
    }
};
