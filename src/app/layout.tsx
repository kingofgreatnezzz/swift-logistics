import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import KeepAliveProvider from '@/components/KeepAliveProvider';
import { themeConfig } from '@/lib/theme';

export const metadata: Metadata = {
  title: `${themeConfig.brandName} - ${themeConfig.tagline}`,
  description: 'Premium logistics and delivery platform with real-time tracking, secure handling, and investment opportunities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <style>{`
          :root {
            --primary: ${themeConfig.colors.primary};
            --primary-dark: ${themeConfig.colors.primaryDark};
            --secondary: ${themeConfig.colors.secondary};
            --accent: ${themeConfig.colors.accent};
            --success: ${themeConfig.colors.success};
            --warning: ${themeConfig.colors.warning};
            --error: ${themeConfig.colors.error};
            --muted: ${themeConfig.colors.muted};
            --background: ${themeConfig.colors.background};
            --foreground: ${themeConfig.colors.foreground};
            --card: ${themeConfig.colors.card};
            --card-foreground: ${themeConfig.colors.cardForeground};
            --border: ${themeConfig.colors.border};
            --radius: ${themeConfig.borderRadius.md};
          }
        `}</style>
      </head>
      <body className="antialiased">
        <KeepAliveProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navigation />
            <main className="relative pt-20">
              {children}
            </main>
            <Footer />
          </div>
        </KeepAliveProvider>
      </body>
    </html>
  );
}