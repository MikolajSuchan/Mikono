// src/pages/dashboard.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-8">Ładowanie...</div>;

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-4">Witaj, {user.email}</h1>
      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-medium">Saldo (przykład)</h2>
        <p className="text-3xl mt-2">-- tutaj później pojawi się saldo --</p>
      </section>
    </main>
  );
}
