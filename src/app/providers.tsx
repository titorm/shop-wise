
"use client";

import { AuthProvider, useAuth } from "@/hooks/use-auth";
import i18n from "@/lib/i18n";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";

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
    return (
        <I18nextProvider i18n={i18n}>
            <AuthProvider>
                <AppTheme>
                    {children}
                </AppTheme>
                <Toaster />
            </AuthProvider>
        </I18nextProvider>
    )
}
