import type { APIRoute } from "astro";
import pool from "src/lib/db";

// =========================
// GET, PUT, DELETE /api/facility/:id
// =========================
export const GET: APIRoute = async ({ params }) => {
    try {
        const id = Number(params.id);
        const [rows]: any = await pool.query("SELECT * FROM facilities WHERE id = ?", [id]);
        const data = rows[0] || null;
        return new Response(JSON.stringify(data), {
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
export const DELETE: APIRoute = async ({ params, locals }) => {
    const id = Number(params.id);

    if (!id || isNaN(id)) {
        return new Response(JSON.stringify({ message: "ID tidak valid" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    try {
        const { isAuthenticated } = locals.auth();
        // Protect the route by checking if the user is signed in
        if (!isAuthenticated) {
            return new Response("Unauthorized", { status: 401 });
        }
        const [result]: any = await pool.query("DELETE FROM facilities WHERE id = ?", [id]);

        // cek apakah benar-benar ada data yang terhapus
        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ message: "Data tidak ditemukan" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ message: "Berhasil dihapus" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
    try {
        const { isAuthenticated } = locals.auth();
        // Protect the route by checking if the user is signed in
        if (!isAuthenticated) {
            return new Response("Unauthorized", { status: 401 });
        }
        const id = Number(params.id);
        if (!id || Number.isNaN(id)) {
            return new Response(JSON.stringify({ message: "ID tidak valid" }), {
                status: 400,
            });
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
            return new Response(JSON.stringify({ message: "Posisi tidak valid!" }), {
                status: 400,
            });
        }

        const [result]: any = await pool.query(
            `UPDATE facilities 
             SET name = ?, desc_name = ?, position = ?, image_url = ?
             WHERE id = ?`,
            [name, desc_name, position, image_url, id]
        );

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ message: "Data tidak ditemukan" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Fasilitas berhasil diupdate!" }), { status: 200 });
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err.message || "Server error" }), { status: 500 });
    }
};
