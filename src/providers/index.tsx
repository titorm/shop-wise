import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { useEffect, useState, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { i18n } from "@lingui/core"
import { I18nProvider } from "@lingui/react"
import { messages as ptMessages } from "../locales/pt/messages";
import { messages as enMessages } from "../locales/en/messages";

i18n.load("pt", ptMessages);
i18n.load("en", enMessages);
i18n.activate("pt");
i18n.activate("en");

function PageViewTracker(): React.ReactNode {
    // const pathname = usePathname()
    // const searchParams = useSearchParams()

    // useEffect(() => {
    //     if (pathname) {
    //         const url = window.origin + pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    //         trackEvent('screen_view', {
    //             firebase_screen: pathname,
    //             firebase_screen_class: 'NextJS', // You can customize this
    //             page_location: url,
    //         });
    //     }
    // }, [pathname, searchParams]);

    return null;
}

function AppTheme({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { profile } = useAuth();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const theme = profile?.settings?.theme;
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');

            if (theme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                root.classList.add(systemTheme);
                return;
            }

            if (theme) {
                root.classList.add(theme);
            }
        }
    }, [profile]);

    return <>{children}</>;
}

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <I18nProvider i18n={i18n}>
            <AuthProvider>
                <PageViewTracker />
                <AppTheme>
                    {children}
                </AppTheme>
                <Toaster />
            </AuthProvider>
        </I18nProvider>
    )
}
