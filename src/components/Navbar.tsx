// src/components/Navbar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  async function logout() {
    await signOut();
    router.push('/auth');
  }

  return (
    <nav className="w-full bg-white shadow">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <Link href="/"><a className="font-bold text-lg">BudgetBuddy</a></Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard"><a className="text-sm">Dashboard</a></Link>
          <Link href="/transactions"><a className="text-sm">Transakcje</a></Link>
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.email}</span>
              <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Wyloguj</button>
            </>
          ) : (
            <Link href="/auth"><a className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Zaloguj</a></Link>
          )}
        </div>
      </div>
    </nav>
  );
}
