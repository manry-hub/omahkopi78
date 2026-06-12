import type { APIRoute } from "astro";
import pool from "src/lib/db";

// =========================
// GET /api/reservation-tables/:id
// =========================
export const GET: APIRoute = async ({ params }) => {
    try {
        const id = Number(params.id);
        const [rows]: any = await pool.query("SELECT * FROM reservation_tables WHERE id = ?", [id]);
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
// =========================
// DELETE /api/reservation-tables/:id
// =========================

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
        const [result]: any = await pool.query("DELETE FROM reservation_tables WHERE id = ?", [id]);

        // cek apakah benar-benar ada data yang terhapus
        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ message: "Data tidak ditemukan" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ message: "Berhasil dihapus" }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
};

// =========================
// PUT /api/reservation-tables/:id
// =========================
// =========================
// PUT /api/reservation-tables/:id
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
        const desc_name = body.desc_name || "";
        const min_pay = Number(body.min_pay);
        const min_people = Number(body.min_people);
        const capacity = Number(body.capacity);
        const image_url = body.image_url || "";

        if (!name || Number.isNaN(capacity)) {
            return new Response(JSON.stringify({ message: "Nama dan kapasitas wajib diisi!" }), { status: 400 });
        }

        if (capacity <= 0) {
            return new Response(JSON.stringify({ message: "Kapasitas harus lebih dari 0" }), { status: 400 });
        }

        if (!Number.isNaN(min_people) && min_people > capacity) {
            return new Response(
                JSON.stringify({
                    message: "Minimal orang tidak boleh lebih dari kapasitas",
                }),
                { status: 400 }
            );
        }

        const [result]: any = await pool.query(
            `UPDATE reservation_tables
             SET name = ?,
                 desc_name = ?,
                 min_pay = ?,
                 min_people = ?,
                 capacity = ?,
                 image_url = ?
             WHERE id = ?`,
            [name, desc_name, Number.isNaN(min_pay) ? null : min_pay, Number.isNaN(min_people) ? null : min_people, capacity, image_url, id]
        );

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ message: "Data tidak ditemukan" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Meja reservasi berhasil diupdate!" }), { status: 200 });
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err.message || "Server error" }), { status: 500 });
    }
};
