// src/pages/auth.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth'; // lub '../hooks/useAuth' jeśli bez src

export default function AuthPage() {
  const { user, signIn, signUp } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    // jeśli już zalogowany
    router.push('/dashboard');
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        const res = await signIn(email, password);
        // v2 zwraca { data, error } lub { error }
        if (res?.error) throw res.error;
      } else {
        const res = await signUp(email, password);
        if (res?.error) throw res.error;
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message ?? JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">{mode === 'login' ? 'Logowanie' : 'Rejestracja'}</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input required value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm">Hasło</label>
            <input required value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full border p-2 rounded" />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <div className="flex items-center justify-between">
            <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? 'Proszę czekać...' : mode === 'login' ? 'Zaloguj' : 'Zarejestruj'}
            </button>
            <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-sm text-gray-600">
              {mode === 'login' ? 'Nie masz konta? Zarejestruj się' : 'Masz konto? Zaloguj się'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
