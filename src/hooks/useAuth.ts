// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { supabase } from (process.env.NEXT_PUBLIC_USE_SRC ? '@/lib/supabaseClient' : '../lib/supabaseClient') as any; // usuń ten ternary, jeśli masz ustawioną ścieżkę importu
// Jeśli używasz aliasów, importuj: import { supabase } from '@lib/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getSession() {
      try {
        // supabase v2
        if ((supabase.auth as any).getSession) {
          const { data } = await supabase.auth.getSession();
          if (mounted) setUser(data?.session?.user ?? null);
        } else if ((supabase.auth as any).session) {
          // supabase v1 fallback
          const session = (supabase.auth as any).session();
          if (mounted) setUser(session?.user ?? null);
        } else {
          // ostatnia deska ratunku
          const u = (supabase.auth as any).user?.() ?? null;
          if (mounted) setUser(u);
        }
      } catch (err) {
        console.error('getSession error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    getSession();

    // nasłuch zmian (v2: onAuthStateChange)
    const sub = (supabase.auth as any).onAuthStateChange?.((event: any, session: any) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      if (sub?.data?.subscription) sub.data.subscription.unsubscribe?.();
      if (sub?.unsubscribe) sub.unsubscribe?.();
    };
  }, []);

  async function signIn(email: string, password: string) {
    // v2: signInWithPassword, v1: signIn
    if ((supabase.auth as any).signInWithPassword) {
      return supabase.auth.signInWithPassword({ email, password });
    } else {
      return supabase.auth.signIn({ email, password });
    }
  }

  async function signUp(email: string, password: string) {
    if ((supabase.auth as any).signUp) {
      return supabase.auth.signUp({ email, password });
    } else {
      return supabase.auth.signUp({ email, password });
    }
  }

  async function signOut() {
    return supabase.auth.signOut();
  }

  return { user, loading, signIn, signUp, signOut };
}
