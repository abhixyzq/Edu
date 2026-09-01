import type { Metadata } from 'next';
import { AdminGuard } from '@/components/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: 'Admin Panel | nainixOne',
  description: 'nainixOne admin dashboard for managing content, users, and analytics.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#f4fafd] flex flex-col md:flex-row w-full">
        <AdminSidebar />
        {/* Main content offset by sidebar width on desktop */}
        <main className="flex-1 md:ml-64 min-h-screen flex flex-col w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
