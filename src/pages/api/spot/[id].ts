import type { APIRoute } from "astro";
import pool from "src/lib/db";

// =========================
// GET /api/galleries/:id
// =========================
export const GET: APIRoute = async ({ params }) => {
    try {
        const id = Number(params.id);

        if (!id || Number.isNaN(id)) {
            return new Response(JSON.stringify({ message: "ID tidak valid" }), { status: 400 });
        }

        const [rows]: any = await pool.query("SELECT * FROM galleries WHERE id = ?", [id]);

        if (rows.length === 0) {
            return new Response(JSON.stringify({ message: "Data tidak ditemukan" }), { status: 404 });
        }

        return new Response(JSON.stringify(rows[0]), {
            status: 200,
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};

// =========================
// PUT /api/galleries/:id
// =========================
export const PUT: APIRoute = async ({ params, request, locals }) => {
    try {
        const { isAuthenticated } = locals.auth();
        // Protect the route by checking if the user is signed in
        if (!isAuthenticated) {
            return new Response("Unauthorized", { status: 401 });
        }
        const id = Number(params.id);
        if (!id || Number.isNaN(id)) {
            return new Response(JSON.stringify({ message: "ID tidak valid" }), { status: 400 });
        }

        const body = await request.json();
        const name = body.name?.trim();
        const image_url = body.image_url || "";

        if (!name) {
            return new Response(JSON.stringify({ message: "Nama gallery wajib diisi!" }), { status: 400 });
        }

        const [result]: any = await pool.query(
            `UPDATE galleries
             SET name = ?, image_url = ?
             WHERE id = ?`,
            [name, image_url, id]
        );

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ message: "Data tidak ditemukan" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Gallery berhasil diupdate!" }), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};

// =========================
// DELETE /api/galleries/:id
// =========================
export const DELETE: APIRoute = async ({ params, locals }) => {
    try {
        const { isAuthenticated } = locals.auth();
        // Protect the route by checking if the user is signed in
        if (!isAuthenticated) {
            return new Response("Unauthorized", { status: 401 });
        }
        const id = Number(params.id);

        if (!id || Number.isNaN(id)) {
            return new Response(JSON.stringify({ message: "ID tidak valid" }), { status: 400 });
        }

        const [result]: any = await pool.query("DELETE FROM galleries WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ message: "Data tidak ditemukan" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Berhasil dihapus" }), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};
