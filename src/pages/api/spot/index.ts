import type { APIRoute } from "astro";
import pool from "src/lib/db";

export const GET: APIRoute = async () => {
    try {
        const [rows] = await pool.query("SELECT * FROM galleries");

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
        const image_url = body.image_url || "";

        if (!name) {
            return new Response(JSON.stringify({ message: "Nama spot wajib diisi!" }), { status: 400 });
        }

        const [result]: any = await pool.query(
            `INSERT INTO galleries (name, image_url)
             VALUES (?, ?)`,
            [name, image_url]
        );

        return new Response(
            JSON.stringify({
                message: "spot berhasil ditambahkan!",
                id: result.insertId,
            }),
            { status: 201 }
        );
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err.message || "Server error" }), { status: 500 });
    }
};
