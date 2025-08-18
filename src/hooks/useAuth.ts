import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface User {
  id: string;
  email: string;
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
        const { data } = await supabase.auth.getSession();
        const sessionUser = data?.session?.user;
       if (mounted && data?.session?.user?.email) {
  const supabaseUser = data.session.user;
  if (supabaseUser?.id && supabaseUser?.email) {
    setUser({ id: supabaseUser.id, email: supabaseUser.email });
  } else {
    setUser(null);
  }
} else {
  setUser(null);
}

      } catch (err) {
        console.error('getSession error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    const sub = supabase.auth.onAuthStateChange((event, session) => {
      const supabaseUser = session?.user;
      setUser(supabaseUser && supabaseUser.email ? { id: supabaseUser.id, email: supabaseUser.email } : null);
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
