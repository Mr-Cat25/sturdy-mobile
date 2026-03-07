import { ChildProfile } from '@/types/child';

// Temporary in-memory store just so the UI compiles.
// Later we will replace this with real Supabase calls.
let activeChild: ChildProfile | null = null;

export function addChild(partial: Partial<ChildProfile>): ChildProfile {
  const now = new Date().toISOString();
  const child: ChildProfile = {
    id: partial.id ?? 'local-' + Math.random().toString(36).slice(2),
    name: partial.name ?? 'Unnamed',
    nickname: partial.nickname ?? '',
    age: partial.age ?? '',
    neurotype: partial.neurotype ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
    isActive: partial.isActive ?? true,
  };
  activeChild = child;
  return child;
}

export function getActiveChild(): ChildProfile | null {
  return activeChild;
}
