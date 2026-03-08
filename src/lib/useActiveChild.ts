import { useState, useEffect } from 'react';
import { ChildProfile } from '@/types/child';
import { getActiveChild } from './childProfile';

export function useActiveChild() {
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(null);

  useEffect(() => {
    getActiveChild().then((child) => {
      setActiveChild(child);
    });
  }, []);

  return activeChild;
}
