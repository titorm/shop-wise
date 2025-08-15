// src/routes/__root.tsx
/// <reference types="vite/client" />
// other imports...
import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@fontsource/pt-sans/400.css";
import "@fontsource/pt-sans/700.css";

import appCss from "../styles/app.css?url";

export const Route = createRootRoute({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            { title: "TanStack Start Starter" },
        ],
        links: [{ rel: "stylesheet", href: appCss }],
    }),
    component: RootLayout,
});

function RootLayout() {
    return (
        <html lang="en">
            <head>
                <HeadContent />
            </head>
            <body>
                <Outlet />
                <Scripts />
            </body>
        </html>
    );
}
