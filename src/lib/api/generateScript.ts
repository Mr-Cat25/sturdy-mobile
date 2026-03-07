import { supabase } from '@/lib/supabase'; // Using your clean absolute path alias!

export interface GenerateScriptParams {
  situation: string;
  childAge: string; 
  neurotype: string;
  mode?: string;
}

export interface ScriptResult {
  title: string;
  regulate: string;
  connect: string;
  guide: string;
  what_if: string; 
}

export const generateScript = async ({
  situation,
  childAge,
  neurotype,
  mode = 'crisis',
}: GenerateScriptParams): Promise<ScriptResult> => {
  
  const { data, error } = await supabase.functions.invoke('generate-script', {
    // Notice how clean this is now! No more hardcoded names or tone preferences.
    body: { situation, childAge, neurotype, mode },
  });

  if (error) {
    console.error('Supabase function error:', error);
    // Try to extract the real error message if it's a 500 response with error details
    const errorMsg = error?.context?.errorMessage || error?.message || 'Unknown server error';
    throw new Error(`Failed to connect to Sturdy server: ${errorMsg}`);
  }

  // Check if we got a valid response
  if (!data) {
    console.error('No data returned from function');
    throw new Error('No response from Sturdy server');
  }

  // Check if the function returned an error response
  if (!data.ok) {
    console.error('Function returned error:', data.error);
    throw new Error(`Sturdy server error: ${data.error}`);
  }

  // Returning the exact fields we expect from the Edge Function
  return {
    title: data.title || 'Support Script',
    regulate: data.regulate,
    connect: data.connect,
    guide: data.guide,
    what_if: data.what_if,
  };
};