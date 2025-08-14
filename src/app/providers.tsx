
"use client";

import { AuthProvider, useAuth } from "@/hooks/use-auth";
import i18n from "@/lib/i18n";
import { useEffect, useState, ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";

if (typeof window !== 'undefined') {
    posthog.init('phc_Rx5hJgLvJDH6uquKZQBR8O607ghbxitiLNwfTtD3A9P', {
        api_host: 'https://us.i.posthog.com',
    })
}

function PostHogPageview(): React.ReactNode {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (pathname) {
            let url = window.origin + pathname
            if (searchParams && searchParams.toString()) {
                url = url + `?${searchParams.toString()}`
            }
            posthog.capture(
                '$pageview',
                {
                    '$current_url': url,
                }
            )
        }
    }, [pathname, searchParams])
    
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


export function Providers({
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
                <PostHogProvider client={posthog}>
                    <PostHogPageview />
                    <AppTheme>
                        {children}
                    </AppTheme>
                    <Toaster />
                </PostHogProvider>
            </AuthProvider>
        </I18nextProvider>
    )
}
