import { supabase } from '@/lib/supabase';

export interface ScriptResult {
  regulate: string;
  connect: string;
  guide: string;
  repair: string;
  script: string;
}

export async function generateScript(input: {
  situation: string;
  childName?: string;
  childAge?: number;
  neurotype?: string;
  tonePreference?: string;
  mode?: 'crisis' | 'guidance';
}): Promise<ScriptResult> {
  const { data, error } = await supabase.functions.invoke('generate-script', {
    body: input,
  });

  if (error) throw new Error(error.message);
  if (!data.ok) throw new Error(data.error ?? 'Unknown error');

  return data as ScriptResult;
}
