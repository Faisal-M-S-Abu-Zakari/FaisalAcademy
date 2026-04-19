import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Faisal Academy – Learn Anything, Anywhere',
  description: 'Faisal Academy is a premium educational platform with interactive video lessons, top-tier instructors, and recognized certificates.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50 text-gray-900`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow pb-10">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
