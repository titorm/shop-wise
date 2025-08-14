
"use client";

import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import i18n from "@/lib/i18n";
import { I18nextProvider } from 'react-i18next';
import { useEffect } from 'react';
import Head from 'next/head';

config.autoAddCss = false

const pt_sans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});


function AppTheme({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { profile } = useAuth();
  
  useEffect(() => {
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
  }, [profile]);

  return <>{children}</>;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <script async src="https://pay.google.com/gp/p/js/pay.js"></script>
      </Head>
      <body
        className={cn('min-h-screen bg-background font-body antialiased', pt_sans.variable)}
        suppressHydrationWarning
      >
        <I18nextProvider i18n={i18n}>
            <AuthProvider>
                <AppTheme>
                    {children}
                </AppTheme>
                <Toaster />
            </AuthProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}
