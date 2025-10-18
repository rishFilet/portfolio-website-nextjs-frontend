import { redirect } from 'next/navigation';

import AdminNav from '@/components/admin/AdminNav';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <AdminNav user={user} />
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}