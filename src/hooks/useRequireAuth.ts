// src/hooks/useRequireAuth.ts
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from './useAuth';

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [loading, user, router]);

  return { user, loading };
}
