import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '../../lib/supabaseClient';
import styles from '../styles/Transactions.module.css';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [newTransaction, setNewTransaction] = useState({
    transaction_name: '',
    amount: '',
    transaction_type: 'income',
    transaction_date: '',
    description: '',
    category_id: ''
  });

  // Pobranie użytkownika, transakcji i kategorii
  useEffect(() => {
    const fetchUserAndData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('owner_id', user.id);

      if (txError) console.error(txError);
      else setTransactions(txData || []);

      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('owner_id', user.id);

      if (catError) console.error(catError);
      else setCategories(catData || []);
    };

    fetchUserAndData();
  }, []);

  const addTransaction = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...newTransaction, owner_id: userId }])
      .select();

    if (error) console.error(error);
    else {
      setTransactions([...transactions, ...(data || [])]);
      setIsModalOpen(false);
      setNewTransaction({
        transaction_name: '',
        amount: '',
        transaction_type: 'income',
        transaction_date: '',
        description: '',
        category_id: ''
      });
    }
  };

  const deleteTransaction = async (id: string, type: string, amount: number) => {
    if (!userId) return;

    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) return console.error(error);

    setTransactions(transactions.filter((tx) => tx.id !== id));

    const { data: balData, error: balError } = await supabase
      .from('balances')
      .select('*')
      .eq('owner_id', userId)
      .single();
    if (balError) console.error(balError);

    if (balData) {
      const newAmount = type === 'income'
        ? Number(balData.amount) - Number(amount)
        : Number(balData.amount) + Number(amount);

      await supabase
        .from('balances')
        .update({ amount: newAmount })
        .eq('id', balData.id);
    }
  };

  return (
    <Layout>
      <main className={styles.container}>
        <h1 className={styles.title}>Transakcje</h1>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>Dodaj transakcję</button>

        <ul className={styles.list}>
          {transactions.map((tx) => (
            <li key={tx.id} className={styles.listItem}>
              <div className={styles.txDetails}>
                <span className={styles.txName}>{tx.transaction_name}</span>
                <span
                  className={`${styles.txAmount} ${tx.transaction_type === 'income' ? styles.income : styles.expense}`}
                >
                  {tx.transaction_type === 'income' ? '+' : '-'}
                  {tx.amount} zł
                </span>
                <span className={styles.txDate}>{tx.transaction_date}</span>
              </div>
              <button
                className={styles.deleteBtn}
                onClick={() => deleteTransaction(tx.id, tx.transaction_type, tx.amount)}
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>

        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>Dodaj nową transakcję</h2>
              <input
                type="text"
                placeholder="Nazwa"
                value={newTransaction.transaction_name}
                onChange={(e) => setNewTransaction({ ...newTransaction, transaction_name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Kwota"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              />
              <select
                value={newTransaction.transaction_type}
                onChange={(e) => setNewTransaction({ ...newTransaction, transaction_type: e.target.value })}
              >
                <option value="income">Przychód</option>
                <option value="expense">Wydatek</option>
              </select>
              <input
                type="date"
                value={newTransaction.transaction_date}
                onChange={(e) => setNewTransaction({ ...newTransaction, transaction_date: e.target.value })}
              />
              <textarea
                placeholder="Opis"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              ></textarea>
              <select
                value={newTransaction.category_id}
                onChange={(e) => setNewTransaction({ ...newTransaction, category_id: e.target.value })}
              >
                <option value="">Wybierz kategorię</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>

              <div className={styles.modalButtons}>
                <button className={styles.saveBtn} onClick={addTransaction}>Zapisz</button>
                <button className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Anuluj</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}
