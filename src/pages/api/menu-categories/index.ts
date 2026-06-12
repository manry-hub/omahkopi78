import type { APIRoute } from "astro";
import pool from "src/lib/db";

export const GET: APIRoute = async () => {
    try {
        const [rows] = await pool.query("SELECT * FROM menu_categories");

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
