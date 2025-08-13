import Layout from '@/components/Layout';
import styles from '../styles/Dashboard.module.css';

export default function Budgets() {
  return (
    <Layout>
        <main className={styles.container}>
        <h1 className={styles.title}>Budżety</h1>
        <p>Tu będzie lista budżetów.</p>
        </main>
    </Layout>
  );
}
