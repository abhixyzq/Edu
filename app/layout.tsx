import type { Metadata, Viewport } from 'next';
import './globals.css';
import { UserProvider } from '@/context/UserContext';
import { TestProvider } from '@/context/TestContext';
import { Navbar } from '@/components/Navbar';
import { SecurityGuard } from '@/components/SecurityGuard';
import { AuthGuard } from '@/components/AuthGuard';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'nainixOne | Class 12 Board Exam Prep & Mock Tests',
  description: 'AI-curated practice exams, mock tests, and subject learning platform for Class 12 CBSE, Bihar Board, UP Board, and ICSE students.',
  keywords: ['nainixOne', 'Class 12 Prep', 'CBSE Class 12', 'Bihar Board', 'Mock Test', 'Physics Mock Test'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Space+Grotesk:wght@700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-[#f4fafd] text-[#161d1f] antialiased selection:bg-[#ffdbc9] selection:text-[#6a2d00]">
        <UserProvider>
          <AuthGuard>
            <TestProvider>
              <SecurityGuard />
              <div className="min-h-screen flex flex-col justify-between">
                <Navbar />
                <div className="flex-1">{children}</div>
              </div>
            </TestProvider>
          </AuthGuard>
        </UserProvider>
      </body>
    </html>
  );
}
