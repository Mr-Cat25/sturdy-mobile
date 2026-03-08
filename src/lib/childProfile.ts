import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChildProfile } from '@/types/child';

const ACTIVE_CHILD_KEY = 'sturdy:active_child';
const SAVED_SCRIPTS_KEY = 'sturdy:saved_scripts';

export const MAX_SAVED_SCRIPTS = 5;

export interface SavedScript {
  id: string;
  trigger: string;
  situation: string;
  regulate: string;
  connect: string;
  guide: string;
  what_if: string;
  savedAt: string;
}

export async function addChild(partial: Partial<ChildProfile>): Promise<ChildProfile> {
  const existing = await getActiveChild();
  if (existing) {
    throw new Error('FREE_LIMIT_CHILD');
  }

  const now = new Date().toISOString();
  const child: ChildProfile = {
    id: partial.id ?? 'local-' + Math.random().toString(36).slice(2),
    name: partial.name ?? 'Unnamed',
    nickname: partial.nickname ?? '',
    age: partial.age ?? '',
    neurotype: partial.neurotype ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
    isActive: true,
  };

  await AsyncStorage.setItem(ACTIVE_CHILD_KEY, JSON.stringify(child));
  return child;
}

export async function getActiveChild(): Promise<ChildProfile | null> {
  const json = await AsyncStorage.getItem(ACTIVE_CHILD_KEY);
  return json ? (JSON.parse(json) as ChildProfile) : null;
}

export async function getSavedScripts(): Promise<SavedScript[]> {
  const json = await AsyncStorage.getItem(SAVED_SCRIPTS_KEY);
  return json ? (JSON.parse(json) as SavedScript[]) : [];
}

export async function saveScript(
  script: Omit<SavedScript, 'id' | 'savedAt'>,
): Promise<{ ok: boolean; limitReached?: boolean }> {
  const scripts = await getSavedScripts();
  if (scripts.length >= MAX_SAVED_SCRIPTS) {
    return { ok: false, limitReached: true };
  }
  const entry: SavedScript = {
    ...script,
    id: 'script-' + Math.random().toString(36).slice(2),
    savedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(SAVED_SCRIPTS_KEY, JSON.stringify([entry, ...scripts]));
  return { ok: true };
}

export async function removeSavedScript(id: string): Promise<void> {
  const scripts = await getSavedScripts();
  await AsyncStorage.setItem(
    SAVED_SCRIPTS_KEY,
    JSON.stringify(scripts.filter((s) => s.id !== id)),
  );
}
