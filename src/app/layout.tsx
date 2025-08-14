
"use client";

import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import i18n from "@/lib/i18n";
import { I18nextProvider } from 'react-i18next';

config.autoAddCss = false

const pt_sans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

// Metadata can't be used in a client component.
// We can either move it to a separate file or handle it differently if needed.
// For now, I will comment it out to fix the immediate issue.
// export const metadata: Metadata = {
//   title: 'ShopWise',
//   description: 'Your Intelligent Shopping Assistant',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn('min-h-screen bg-background font-body antialiased', pt_sans.variable)}
        suppressHydrationWarning
      >
        <I18nextProvider i18n={i18n}>
            <AuthProvider>
                {children}
                <Toaster />
            </AuthProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}
