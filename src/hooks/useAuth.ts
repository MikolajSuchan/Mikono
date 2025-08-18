import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface User {
  id: string;
  email: string;
  // możesz dodać inne pola z supabase.user_metadata
}

interface AuthResponse {
  user: User | null;
  session?: unknown;
  error?: { message: string };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getSession() {
      try {
        const { data }: { data: { session: { user: User } | null } } = await supabase.auth.getSession();
        if (mounted) setUser(data?.session?.user ?? null);
      } catch (err) {
        console.error('getSession error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    getSession();

    const sub = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.data.subscription.unsubscribe?.();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string) => {
    return supabase.auth.signUp({ email, password });
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  return { user, loading, signIn, signUp, signOut };
}
