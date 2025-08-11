import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import styles from '../styles/Auth.module.css';

export default function AuthPage() {
  const { user, signIn, signUp } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
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
    <div className={styles.pageWrapper}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>
          {mode === 'login' ? 'Logowanie' : 'Rejestracja'}
        </h1>
        <form onSubmit={submit} className={styles.form}>
          <div>
            <label className={styles.label}>Email</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              type="email"
              autoComplete="username"
            />
          </div>
          <div>
            <label className={styles.label}>Hasło</label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className={styles.input}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.actions}>
            <button disabled={loading} className={styles.buttonPrimary}>
              {loading
                ? 'Proszę czekać...'
                : mode === 'login'
                ? 'Zaloguj'
                : 'Zarejestruj'}
            </button>
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className={styles.toggleButton}
            >
              {mode === 'login'
                ? 'Nie masz konta? Zarejestruj się'
                : 'Masz konto? Zaloguj się'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
