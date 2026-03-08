import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthSession } from './useAuthSession';

export function useRequireAuth() {
  const { session, loading } = useAuthSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/auth');
    }
  }, [session, loading, router]);

  return { session, loading };
}
