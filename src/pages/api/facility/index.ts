import type { APIRoute } from "astro";
import pool from "src/lib/db";

// =========================
// GET /api/facility
// =========================
export const GET: APIRoute = async () => {
    try {
        const [rows] = await pool.query("SELECT * FROM facilities");

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
// POST /api/facility
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
        const position = body.position || "";
        const image_url = body.image_url || "";

        if (!name) {
            return new Response(JSON.stringify({ message: "Nama fasilitas wajib diisi!" }), { status: 400 });
        }

        if (!["left", "right"].includes(position)) {
            return new Response(JSON.stringify({ message: "Posisi tidak valid!" }), { status: 400 });
        }

        const [result]: any = await pool.query(
            `INSERT INTO facilities (name, desc_name, position, image_url)
             VALUES (?, ?, ?, ?)`,
            [name, desc_name, position, image_url]
        );

        return new Response(
            JSON.stringify({
                message: "Fasilitas berhasil ditambahkan!",
                id: result.insertId,
            }),
            { status: 201 }
        );
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err.message || "Server error" }), { status: 500 });
    }
};
