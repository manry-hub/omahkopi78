import type { APIRoute } from "astro";

// =========================
// GET (public / filter)
// =========================
import pool from "src/lib/db";

export const GET: APIRoute = async ({ url }) => {
    const category = url.searchParams.get("category");
    const favorite = url.searchParams.get("favorite");

    try {
        let sql = `
    SELECT 
        m.id,
        m.name,
        m.price,
        m.material,
        m.image_url,
        m.is_favorite,
        mc.name AS category_name
    FROM menus m
    LEFT JOIN menu_categories mc 
        ON m.category_id = mc.id
`;
        const params: any[] = [];
        const conditions: string[] = [];

        if (category) {
            conditions.push("mc.name = ?");
            params.push(category);
        }

        if (favorite === "true") {
            conditions.push("m.is_favorite = ?");
            params.push(1);
        }

        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        sql += " ORDER BY m.id ASC";

        const [rows]: any = await pool.query(sql, params);

        const formatted = rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            price: row.price,
            material: row.material,
            image_url: row.image_url,
            is_favorite: Boolean(row.is_favorite),
            menu_categories: {
                name: row.category_name,
            },
        }));

        return new Response(JSON.stringify(formatted), {
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
        const category_id = Number(body.category_id);
        const price = Number(body.price);
        const material = body.material || "";
        const is_favorite = body.is_favorite ? 1 : 0; // simpan sebagai tinyint
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

        const [result]: any = await pool.query(
            `INSERT INTO menus 
            (name, category_id, price, material, is_favorite, image_url)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [name, category_id, price, material, is_favorite, image_url]
        );

        return new Response(
            JSON.stringify({
                message: "Menu berhasil ditambahkan!",
                id: result.insertId,
            }),
            { status: 201 }
        );
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err.message || "Server error" }), { status: 500 });
    }
};
