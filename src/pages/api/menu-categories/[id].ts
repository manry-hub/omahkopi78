import type { APIRoute } from "astro";
import pool from "src/lib/db";

export const GET: APIRoute = async ({ params }) => {
    try {
        const id = Number(params.id);
        const [rows]: any = await pool.query("SELECT * FROM menu_categories WHERE id = ?", [id]);
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
        const [result]: any = await pool.query("DELETE FROM menu_categories WHERE id = ?", [id]);

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
