import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import styles from '../styles/Dashboard.module.css';

export default function DashboardPage() {
  const { user, loading } = useRequireAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  if (loading || !user) return (
    <div className={styles.loadingWrapper}>
      <div className={styles.loadingText}>Ładowanie...</div>
    </div>
  );

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Witaj, {user.email}</h1>
      <section className={styles.card}>
        <h2 className={styles.subtitle}>Saldo (przykład)</h2>
        <p className={styles.balance}>-- tutaj później pojawi się saldo --</p>
      </section>
    </main>
  );
}
