// src/lib/useActiveChild.ts
import { useEffect, useState } from 'react';
import { ChildProfile } from '@/types/child';
import { getActiveChild } from '@/lib/childProfile';

export function useActiveChild() {
  const [child, setChild] = useState<ChildProfile | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const c = await getActiveChild();
      if (mounted) setChild(c);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return child;
}
