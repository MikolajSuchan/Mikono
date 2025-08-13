import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import Sidebar from './Sidebar'; // <- tu jest Sidebar
import styles from '../styles/Layout.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useRequireAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  if (loading || !user)
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingText}>Ładowanie...</div>
      </div>
    );

  return (
    <div className={styles.layout}>
      <Sidebar /> {/* <- tu sidebar */}
      <main className={styles.container}>{children}</main>
    </div>
  );
}
