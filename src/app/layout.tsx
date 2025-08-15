
import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Head from 'next/head';
import { Providers } from './providers';

config.autoAddCss = false

const pt_sans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
    title: 'ShopWise',
    description: 'Intelligent shopping list management.',
};

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
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
