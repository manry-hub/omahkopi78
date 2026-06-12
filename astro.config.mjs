import { defineConfig, envField } from "astro/config";
import path from "node:path";
import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import clerk from "@clerk/astro";
export default defineConfig({
    site: "https://omahkopi78.com",
    output: "server",
    adapter: node({
        mode: "standalone",
    }),

    vite: {
        resolve: {
            alias: {
                "@components": path.resolve("./src/components"),
                "@layouts": path.resolve("./src/layouts"),
                "@data": path.resolve("./src/data"),
                "@pages": path.resolve("./src/pages"),
                "@lib": path.resolve("./src/lib"),
            },
        },
    },

    integrations: [
        clerk(),
        react(),
        sitemap({
            // optional: filter halaman yang tidak mau masuk sitemap
            filter: (page) => {
                // contoh: jangan masukkan halaman admin
                if (page.includes("/admin")) return false;

                // contoh: jangan masukkan halaman api
                if (page.includes("/api/")) return false;

                return true;
            },
        }),
    ],
    env: {
        schema: {
            DB_HOST: envField.string({ context: "server", access: "secret" }),
            DB_USER: envField.string({ context: "server", access: "secret" }),
            DB_PASSWORD: envField.string({ context: "server", access: "secret" }),
            DB_NAME: envField.string({ context: "server", access: "secret" }),
        },
    },
});
