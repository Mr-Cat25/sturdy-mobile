import { useState, useEffect } from 'react';
import { ChildProfile } from '@/types/child';
import { getActiveChild } from './childProfile';

export function useActiveChild() {
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(null);

  useEffect(() => {
    // Get the initial active child
    const child = getActiveChild();
    setActiveChild(child);
  }, []);

  return activeChild;
}
