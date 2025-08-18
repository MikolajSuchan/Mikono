import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import AddCategoryModal from '@/components/AddCategoryModal';
import styles from '../styles/Categories.module.css';

type Category = {
  id: number;
  name: string;
  owner_id: string;
};

export default function Categories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchCategories = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('owner_id', user.id)
      .order('name', { ascending: true });
    if (error) console.error(error);
    else setCategories(data);
  };

  useEffect(() => {
  fetchCategories();
}, [fetchCategories]);


  return (
    <Layout>
      <main className={styles.container}>
        <h1 className={styles.title}>Kategorie transakcji</h1>
        <button className={styles.addBtn} onClick={() => setModalOpen(true)}>
          + Dodaj kategorię
        </button>

        {categories.length ? (
          <ul className={styles.list}>
  {categories.map((cat) => (
    <li key={cat.id} className={styles.listItem}>
      <span>{cat.name}</span>
      <button
        className={styles.deleteBtn}
        onClick={async () => {
          if (!user) return;
          const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', cat.id)
            .eq('owner_id', user.id);
          if (error) console.error(error);
          else setCategories(categories.filter(c => c.id !== cat.id));
        }}
      >
        Usuń
      </button>
    </li>
  ))}
</ul>

        ) : (
          <p>Brak kategorii. Dodaj pierwszą kategorię!</p>
        )}

        {modalOpen && (
          <AddCategoryModal
            onClose={() => setModalOpen(false)}
            onAdded={fetchCategories}
          />
        )}
      </main>
    </Layout>
  );
}
