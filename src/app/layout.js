import './globals.css';
import { Inter } from 'next/font/google';
import SideNav from '@/components/SideNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MyRamadhan - Pendamping Ibadah',
  description:
    "Aplikasi pendamping ibadah Ramadhan lengkap dengan Al-Qur'an, Tracker, Jurnal, dan Jadwal Sholat secara offline.",
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/myramadhan-app-logo-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MyRamadhan',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6F9FC' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang='id' className='light' suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.className} min-h-screen bg-[#F6F9FC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 selection:bg-primary-bg dark:selection:bg-primary-bg transition-colors duration-300 antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme');
                if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', t);
                if (t === 'dark' || t === 'ramadan-dark') document.documentElement.classList.add('dark');
              } catch (_) {}
            `,
          }}
        />
        <SideNav />
        {children}
      </body>
    </html>
  );
}
