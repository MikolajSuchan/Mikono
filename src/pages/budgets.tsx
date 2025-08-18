import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '../../lib/supabaseClient';
import styles from '../styles/Budgets.module.css';

interface Budget {
  id: string;
  category_id: string;
  limit_amount: string; // można też number, zależnie od Supabase
  period: string;
}

interface Category {
  id: string;
  name: string;
  owner_id?: string;
}

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category_id: '',
    limit_amount: '',
    period: 'daily'
  });

  // Pobieranie kategorii
  const fetchCategories = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return; // brak użytkownika, kończymy

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('owner_id', userId);

    if (error) console.error(error);
    else setCategories(data || []);
  };

  // Pobieranie budżetów
  const fetchBudgets = async () => {
    const { data, error } = await supabase
      .from('budget_limits')
      .select('*');

    if (error) console.error(error);
    else
      setBudgets(
        (data || []).map(b => ({
          ...b,
          limit_amount: String(b.limit_amount)
        }))
      );
  };

  useEffect(() => {
    // tylko po stronie klienta
    if (typeof window !== 'undefined') {
      fetchCategories();
      fetchBudgets();
    }
  }, []);

  const addBudget = async () => {
    const exists = budgets.some(
      b => b.category_id === newBudget.category_id && b.period === newBudget.period
    );
    if (exists) {
      alert('Budżet dla tej kategorii i okresu już istnieje!');
      return;
    }

    const { data, error } = await supabase
      .from('budget_limits')
      .insert([{ ...newBudget }])
      .select();

    if (error) {
      console.error(error);
      alert('Nie udało się dodać budżetu.');
    } else {
      setBudgets([...budgets, ...(data || []).map(b => ({
        ...b,
        limit_amount: String(b.limit_amount)
      }))]);
      setIsModalOpen(false);
      setNewBudget({
        category_id: '',
        limit_amount: '',
        period: 'daily'
      });
    }
  };

  const deleteBudget = async (id: string) => {
    const { error } = await supabase.from('budget_limits').delete().eq('id', id);
    if (error) return console.error(error);

    setBudgets(budgets.filter(b => b.id !== id));
  };

  return (
    <Layout>
      <main className={styles.container}>
        <h1 className={styles.title}>Budżety</h1>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          Dodaj budżet
        </button>

        <ul className={styles.list}>
          {budgets.map(b => (
            <li key={b.id} className={styles.listItem}>
              <div className={styles.budgetDetails}>
                <span className={styles.categoryName}>
                  {categories.find(c => c.id === b.category_id)?.name || 'Nieznana'}
                </span>
                <span className={styles.limitAmount}>{b.limit_amount} zł</span>
                <span className={styles.period}>{b.period}</span>
              </div>
              <button className={styles.deleteBtn} onClick={() => deleteBudget(b.id)}>
                Usuń
              </button>
            </li>
          ))}
        </ul>

        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>Dodaj nowy budżet</h2>

              <select
                value={newBudget.category_id}
                onChange={e => setNewBudget({ ...newBudget, category_id: e.target.value })}
              >
                <option value="">Wybierz kategorię</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Limit kwoty"
                value={newBudget.limit_amount}
                onChange={e => setNewBudget({ ...newBudget, limit_amount: e.target.value })}
              />

              <select
                value={newBudget.period}
                onChange={e => setNewBudget({ ...newBudget, period: e.target.value })}
              >
                <option value="daily">Dzienny</option>
                <option value="weekly">Tygodniowy</option>
                <option value="monthly">Miesięczny</option>
                <option value="yearly">Roczny</option>
              </select>

              <div className={styles.modalButtons}>
                <button className={styles.saveBtn} onClick={addBudget}>
                  Zapisz
                </button>
                <button className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}
