import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [
        tailwindcss(),
        tsconfigPaths(),
        tanstackRouter({
            target: "react",
            autoCodeSplitting: true,
        }),
        react(),
    ],
});
