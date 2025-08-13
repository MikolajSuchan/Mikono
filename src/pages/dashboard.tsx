import Layout from '@/components/Layout';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  return (
    <Layout>
      <h1 className={styles.title}>Witaj!</h1>

      {/* Sekcja podsumowania */}
      <section className={styles.summary}>
        <div className={styles.card}>
          <h2>Saldo</h2>
          <p className={styles.balance}>0 zł</p>
        </div>
        <div className={styles.card}>
          <h2>Przychody</h2>
          <p className={styles.income}>0 zł</p>
        </div>
        <div className={styles.card}>
          <h2>Wydatki</h2>
          <p className={styles.expense}>0 zł</p>
        </div>
      </section>

      {/* Ostatnie transakcje */}
      <section className={styles.transactions}>
        <h2>Ostatnie transakcje</h2>
        <ul>
          <li>Brak transakcji</li>
        </ul>
        <button className={styles.viewAll}>Zobacz wszystkie</button>
      </section>
    </Layout>
  );
}
