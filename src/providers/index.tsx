import { AuthProvider, useAuth } from "@/hooks/use-auth";
import i18n from "@/lib/i18n";
import { useEffect, useState, ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";
import { trackEvent } from "@/services/analytics-service";

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

function PageSkeleton() {
    return (
        <div className="flex flex-col h-screen">
            <header className="flex h-16 items-center justify-between border-b px-6 bg-card">
                <Skeleton className="h-8 w-32" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </header>
            <div className="flex flex-1">
                <aside className="w-56 border-r p-6 bg-card hidden md:block">
                    <Skeleton className="h-8 w-full mb-4" />
                    <Skeleton className="h-8 w-full mb-4" />
                    <Skeleton className="h-8 w-full mb-4" />
                </aside>
                <main className="flex-1 p-6 bg-background">
                    <Skeleton className="h-full w-full" />
                </main>
            </div>
        </div>
    );
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
    const [i18nLoaded, setI18nLoaded] = useState(false);

    useEffect(() => {
        i18n.init().then(() => {
            setI18nLoaded(true);
        });
    }, []);

    if (!i18nLoaded) {
        return <PageSkeleton />
    }

    return (
        <I18nextProvider i18n={i18n}>
            <AuthProvider>
                <PageViewTracker />
                <AppTheme>
                    {children}
                </AppTheme>
                <Toaster />
            </AuthProvider>
        </I18nextProvider>
    )
}
