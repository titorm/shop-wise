import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';

const noto_sans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'ShopWise',
  description: 'Seu Assistente Inteligente de Compras',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body
        className={cn('min-h-screen bg-background font-body antialiased', noto_sans.variable)}
        suppressHydrationWarning
      >
        <AuthProvider>
            {children}
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
