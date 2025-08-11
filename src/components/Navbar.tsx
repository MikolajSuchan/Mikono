import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  async function logout() {
    await signOut();
    router.push('/auth');
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div>
          <Link href="/" legacyBehavior>
            <a className={styles.logo}>Mikono</a>
          </Link>
        </div>
        <div className={styles.navLinks}>
          <Link href="/dashboard" legacyBehavior>
            <a className={styles.link}>Dashboard</a>
          </Link>
          <Link href="/transactions" legacyBehavior>
            <a className={styles.link}>Transakcje</a>
          </Link>
          {user ? (
            <>
              <span className={styles.email}>{user.email}</span>
              <button onClick={logout} className={styles.logoutBtn}>
                Wyloguj
              </button>
            </>
          ) : (
            <Link href="/auth" legacyBehavior>
              <a className={styles.loginBtn}>Zaloguj</a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
