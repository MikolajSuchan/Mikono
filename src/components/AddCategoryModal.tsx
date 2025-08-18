import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import styles from '../styles/AddCategoryModal.module.css';

type AddCategoryModalProps = {
  onClose: () => void;
  onAdded: () => void;
};

export default function AddCategoryModal({ onClose, onAdded }: AddCategoryModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const addCategory = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('categories').insert([
      { name, owner_id: user!.id },
    ]);
    setLoading(false);
    if (error) console.error(error);
    else {
      setName('');
      onAdded();
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Dodaj kategorię</h2>
        <input
          type="text"
          placeholder="Nazwa kategorii"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <div className={styles.buttons}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Anuluj
          </button>
          <button onClick={addCategory} className={styles.addBtn} disabled={loading}>
            {loading ? 'Dodawanie...' : 'Dodaj'}
          </button>
        </div>
      </div>
    </div>
  );
}
