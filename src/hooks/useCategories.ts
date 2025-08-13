// hooks/useCategories.ts
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchCategories = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setCategories(data || []);

      setLoading(false);
    };

    fetchCategories();
  }, [user]);

  return { categories, loading, setCategories };
}
