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
  themeColor: '#7c3aed',
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://one.nainix.me';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'nainixOne • Board & Exam Prep, AI Mock Tests & Gamified Learning',
    template: '%s | nainixOne',
  },
  description:
    'nainixOne is India\'s top gamified AI learning platform for School & Board exams (CBSE, Bihar Board BSEB, UP Board & ICSE/ISC). Master Physics, Chemistry, Math & Biology with interactive roadmaps, instant mock test analytics, and state rank leaderboards.',
  keywords: [
    'nainixOne',
    'Board Exam Prep India',
    'CBSE Mock Test',
    'Bihar Board Model Paper 2026',
    'UP Board Practice Papers',
    'ICSE ISC Mock Exam',
    'Class 9 Class 10 Class 11 Class 12',
    'Physics MCQ Practice',
    'Chemistry MCQ Test',
    'Maths Sample Papers',
    'Gamified Education App India',
    'Free Test Series & Roadmaps',
  ],
  authors: [{ name: 'nainixOne Team', url: SITE_URL }],
  creator: 'nainixOne',
  publisher: 'nainixOne Education',
  category: 'Education',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'nainixOne',
    title: 'nainixOne • Board & Competitive Exam Prep, AI Mock Tests & Gamified Roadmaps',
    description:
      'Practice Class 12 CBSE, BSEB, UP & ICSE Board mock tests with interactive gamified roadmaps, real-time analytics, and rank leaderboards.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'nainixOne Class 12 Exam Prep Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'nainixOne • Class 12 Board Exam Prep & AI Mock Tests',
    description:
      'Crack Class 12 Board Exams (CBSE, BSEB, UP, ICSE) with gamified topic paths, mock tests, and state rank leaderboards.',
    images: ['/logo.png'],
    creator: '@nainixone',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.GOOGLE_SITE_VERIFICATION || '',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': `${SITE_URL}/#organization`,
        name: 'nainixOne',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        sameAs: ['https://twitter.com/nainixone'],
        description:
          'Gamified learning and AI mock test preparation platform for Class 12 board examination candidates in India.',
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'nainixOne',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/tests?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Course',
        name: 'Class 12 Physics, Chemistry & Mathematics Complete Board Mastery',
        description:
          'Comprehensive Class 12 curriculum covering Electrostatics, Optics, Organic Chemistry, Calculus, and Modern Physics with interactive quizzes and model test papers.',
        provider: {
          '@id': `${SITE_URL}/#organization`,
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Structured Data Script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Space+Grotesk:wght@700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-[#faf6f0] text-[#161d1f] antialiased selection:bg-[#ede9fe] selection:text-[#6d28d9]">
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
