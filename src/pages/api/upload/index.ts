import type { APIRoute } from "astro";
import fs from "fs/promises";
import path from "path";
export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const { isAuthenticated } = locals.auth();
        // Protect the route by checking if the user is signed in
        if (!isAuthenticated) {
            return new Response("Unauthorized", { status: 401 });
        }
        const formData = await request.formData();
        const file = formData.get("file");
        const folder = formData.get("folder");

        if (!file || !(file instanceof File)) {
            return new Response(JSON.stringify({ message: "File tidak ditemukan" }), { status: 400 });
        }

        // ✅ Validasi folder
        const allowedFolders = ["facilities", "menus", "galleries", "reservation_tables"];

        if (!folder || !allowedFolders.includes(folder.toString())) {
            return new Response(JSON.stringify({ message: "Folder tidak valid" }), { status: 400 });
        }

        // ✅ Validasi tipe file (basic security)
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return new Response(JSON.stringify({ message: "Tipe file tidak diizinkan" }), { status: 400 });
        }

        // generate nama unik
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        // path tujuan
        const uploadDir = path.join(process.cwd(), `public/uploads/${folder}`);

        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);
        const buffer = Buffer.from(await file.arrayBuffer());

        await fs.writeFile(filePath, buffer);

        const publicUrl = `/uploads/${folder}/${fileName}`;

        return new Response(JSON.stringify({ publicUrl }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err.message || "Server error" }), { status: 500 });
    }
};
