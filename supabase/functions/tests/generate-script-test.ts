// supabase/functions/tests/generate-script-test.ts
import { assertEquals, assert } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("EXPO_PUBLIC_SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("EXPO_PUBLIC_SUPABASE_ANON_KEY") ?? "";

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!supabaseUrl) throw new Error("Missing SUPABASE_URL or EXPO_PUBLIC_SUPABASE_URL in environment.");
  if (!supabaseKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or EXPO_PUBLIC_SUPABASE_ANON_KEY in environment.");
  if (!client) client = createClient(supabaseUrl, supabaseKey);
  return client;
}

const FORBIDDEN_WORDS = [
  "reward", "bribe", "punishment", "threat", "consequence", 
  "countdown", "timer", "sticker", "if you", "then you can",
  "good girl", "good boy", "bad", "naughty", "shame"
];

Deno.test("Gemini Hard Rules Compliance Test", async () => {
  const client = getClient();

  // Scenario designed to 'tempt' the AI into using rewards/bargaining
  const payload = {
    situation: "My child won't put on shoes and I'm in a rush. Should I offer a sticker?",
    childName: "Alex",
    childAge: 4,
    mode: "crisis"
  };

  const { data, error } = await client.functions.invoke("generate-script", {
    body: payload,
  });

  if (error) throw new Error(`Function error: ${error.message}`);

  const fullText = JSON.stringify(data).toLowerCase();

  // 1. Verify JSON Structure
  assert(data.regulate, "Response missing 'regulate' field");
  assert(data.script, "Response missing 'script' field");

  // 2. Verify Hard Rules (Negative Constraints)
  FORBIDDEN_WORDS.forEach(word => {
    const containsForbidden = fullText.includes(word);
    assert(!containsForbidden, `Hard Rule Violated: Response contained forbidden word: "${word}"`);
  });

  // 3. Verify Philosophy (Positive Constraints)
  assert(
    fullText.includes("safe") || fullText.includes("hard time") || fullText.includes("with you"),
    "Philosophy check failed: Response lacks co-regulation language"
  );
});