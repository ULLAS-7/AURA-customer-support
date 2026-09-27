import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import ToastStack from '@/components/ToastStack';
import { AppStateProvider } from '@/lib/context/AppStateContext';
import { AuthProvider } from '@/lib/context/AuthContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'AURA — Autonomous Support Intelligence',
  description:
    'A hackathon demo that visualises conceptual AI ticket routing. Uses a TF-IDF keyword engine to match support queries against static knowledge base records and route them to the appropriate agent category.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('aura-theme');
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-body min-h-screen transition-colors duration-300`}>
        {/* Prism Glass — Ambient Pastel Orb Washes */}
        <div className="orb orb-mint" />
        <div className="orb orb-indigo" />
        <div className="orb orb-pink" />

        <AuthProvider>
          <AppStateProvider>
            <div className="relative z-[1]">
              <Nav />
              <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-7">{children}</main>
            </div>
            <ToastStack />
          </AppStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
