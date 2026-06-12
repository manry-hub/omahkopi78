import type { APIRoute } from "astro";
import pool from "src/lib/db";

// =========================
// GET /api/menus/:id
// =========================
export const GET: APIRoute = async ({ params }) => {
    try {
        const id = Number(params.id);
        const [rows]: any = await pool.query("SELECT * FROM menus WHERE id = ?", [id]);
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
// DELETE /api/menus/:id
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
        const [result]: any = await pool.query("DELETE FROM menus WHERE id = ?", [id]);

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
// PUT /api/menus/:id
// =========================
export const PUT: APIRoute = async ({ params, request, locals }) => {
    try {
        const { isAuthenticated } = locals.auth();
        // Protect the route by checking if the user is signed in
        if (!isAuthenticated) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        const id = Number(params.id);
        if (!id || Number.isNaN(id)) {
            return new Response(JSON.stringify({ message: "ID tidak valid" }), { status: 400 });
        }

        const body = await request.json();

        const name = body.name?.trim();
        const category_id = Number(body.category_id);
        const price = Number(body.price);
        const material = body.material || "";
        const is_favorite = body.is_favorite ? 1 : 0;
        const image_url = body.image_url || "";

        if (!name || Number.isNaN(category_id) || Number.isNaN(price)) {
            return new Response(
                JSON.stringify({
                    message: "Nama, kategori, dan harga wajib diisi!",
                }),
                { status: 400 }
            );
        }

        if (price <= 0) {
            return new Response(JSON.stringify({ message: "Harga harus lebih dari 0" }), { status: 400 });
        }

        // ✅ Cek category ada
        const [category]: any = await pool.query("SELECT id FROM menu_categories WHERE id = ?", [category_id]);

        if (category.length === 0) {
            return new Response(JSON.stringify({ message: "Kategori tidak ditemukan" }), { status: 400 });
        }

        const [result]: any = await pool.query(
            `UPDATE menus 
             SET name = ?, 
                 category_id = ?, 
                 price = ?, 
                 material = ?, 
                 is_favorite = ?, 
                 image_url = ?
             WHERE id = ?`,
            [name, category_id, price, material, is_favorite, image_url, id]
        );

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ message: "Menu tidak ditemukan" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Menu berhasil diupdate!" }), { status: 200 });
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err.message || "Server error" }), { status: 500 });
    }
};
