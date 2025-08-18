import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

interface Category {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
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
