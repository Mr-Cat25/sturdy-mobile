// src/lib/childProfile.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChildProfile } from '@/types/child';

const CHILDREN_KEY = 'sturdy.children';

export async function getChildren(): Promise<ChildProfile[]> {
  const raw = await AsyncStorage.getItem(CHILDREN_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ChildProfile[];
  } catch {
    return [];
  }
}

export async function saveChildren(children: ChildProfile[]) {
  await AsyncStorage.setItem(CHILDREN_KEY, JSON.stringify(children));
}

export async function addChild(newChild: ChildProfile) {
  const existing = await getChildren();
  const updated = [
    ...existing.map((c) => ({ ...c, isActive: false })),
    { ...newChild, isActive: true },
  ];
  await saveChildren(updated);
}

export async function getActiveChild(): Promise<ChildProfile | null> {
  const children = await getChildren();
  return children.find((c) => c.isActive) ?? null;
}
