import type { Metadata } from 'next';
import './globals.css';
import { UserProvider } from '@/context/UserContext';
import { TestProvider } from '@/context/TestContext';
import { Navbar } from '@/components/Navbar';
import { SecurityGuard } from '@/components/SecurityGuard';

export const metadata: Metadata = {
  title: 'EduStride Class 12 Prep | PrepMaster',
  description: 'AI-curated practice exams, mock tests, and subject learning platform for Class 12 CBSE, Bihar Board, UP Board, and ICSE students.',
  keywords: ['EduStride', 'PrepMaster', 'Class 12 Prep', 'CBSE Class 12', 'Bihar Board', 'Mock Test', 'Physics Mock Test'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-[#f4fafd] text-[#161d1f] antialiased selection:bg-[#ffdbc9] selection:text-[#6a2d00]">
        <UserProvider>
          <TestProvider>
            <SecurityGuard />
            <div className="min-h-screen flex flex-col justify-between">
              <Navbar />
              <div className="flex-1">{children}</div>
            </div>
          </TestProvider>
        </UserProvider>
      </body>
    </html>
  );
}
