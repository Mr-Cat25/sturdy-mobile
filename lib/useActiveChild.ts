export interface ActiveChild {
  id?: string;
  name?: string;
  nickname?: string | null;
  age?: number | null;
  neurotype?: string | null;
}

export function useActiveChild(): { child: ActiveChild | null } {
  // Temporary stub: always returns null.
  // Later we'll wire this to Supabase + local selection.
  return { child: null };
}
