import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-sturdy-premium",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

// Free-tier quota constants
const FREE_MONTHLY_LIMIT = 5;
const EMERGENCY_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
const systemPrompt = `
You are Sturdy, a calm, expert parenting support assistant.

Your job is to generate short, specific, emotionally intelligent parenting scripts for high-stress moments with children.

Sturdy's framework is:
Regulate (Parent) → Connect (Child's Right Brain) → Guide (Child's Left Brain) → What If (Contingency)

Write in a way that feels:
- calm, steady, and firm
- incredibly practical
- word-for-word usable in the heat of the moment
- grounded in attachment, co-regulation, and respectful boundaries

Adaptation Rules (CRITICAL):
- If Age 2-4: Use ultra-short sentences. Focus on physical redirection, simple choices, and highly concrete concepts.
- If Age 5-7: Use simple choices. Acknowledge their growing independence.
- If Age 8-12: Speak respectfully as capable individuals. You can briefly explain the "why" behind a boundary.
- If neurotype is ADHD, Autism, Anxiety, or Sensory: Remove all metaphorical language. Be highly literal. Offer clear, step-by-step guidance to reduce cognitive load.

Hard rules:
1. Be specific to the exact situation provided.
2. Never use placeholders like [option A], [child], or template text.
3. Never write vague filler like "You've got this".
4. Do not give long explanations, theory, or blog-style advice.
5. Each section must be short enough to read during stress (1-3 sentences max).
6. "Connect", "Guide", and "What If" must sound like exact words a parent can say out loud.
7. "Guide" must include a clear next step, boundary, or concrete choice.
8. If aggression or safety is involved, prioritize safety and firm physical boundaries first.
9. Never shame the child or parent.
10. Never sound robotic, preachy, or clinical.

Return valid JSON only with exactly this shape:
{
  "title": string,
  "regulate": string,
  "connect": string,
  "guide": string,
  "what_if": string
}

Field guidance:
"title" - very short (2-4 words), clearly describe the moment
"regulate" - 1-2 sentences, an internal instruction for the parent to settle their own nervous system first
"connect" - 1-3 sentences, exact words the parent can say, validates feeling without removing boundary
"guide" - 1-3 sentences, exact words the parent can say, includes a concrete next step, limit, or simple choice
"what_if" - 1-3 sentences, exact words or actions if the child refuses the guide or escalates, highly tactical and firm
`;
serve(async (req)=>{
  // Handle CORS for React Native / web clients
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }
  try {
    // --- Authentication ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ ok: false, error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    const token = authHeader.slice("Bearer ".length);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid or expired token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // --- Parse request body early (body can only be consumed once) ---
    const { situation, childAge, neurotype, mode } = await req.json();

    // --- Premium bypass ---
    // WARNING: The x-sturdy-premium header is accepted on trust and is NOT
    // cryptographically verified server-side. Any client can send this header to
    // skip quota enforcement. Full server-side RevenueCat receipt/entitlement
    // validation must be added before this is production-safe.
    const isPremium = req.headers.get("x-sturdy-premium") === "true";

    // --- Quota enforcement (free users only) ---
    let scriptType: "regular" | "emergency" = "regular";
    if (!isPremium) {
      // Start of the current calendar month in UTC
      const now = new Date();
      const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

      // Count regular scripts used this month
      const { count: regularCount, error: countError } = await supabaseAdmin
        .from("script_usage")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("script_type", "regular")
        .gte("created_at", monthStart.toISOString());

      if (countError) throw new Error(`Failed to check usage quota: ${countError.message}`);

      if ((regularCount ?? 0) >= FREE_MONTHLY_LIMIT) {
        // Regular quota exhausted — check emergency eligibility
        const { data: lastEmergency, error: emergencyError } = await supabaseAdmin
          .from("script_usage")
          .select("created_at")
          .eq("user_id", user.id)
          .eq("script_type", "emergency")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (emergencyError) throw new Error(`Failed to check emergency quota: ${emergencyError.message}`);

        const nowMs = Date.now();
        const lastEmergencyMs = lastEmergency
          ? new Date(lastEmergency.created_at).getTime()
          : 0;
        const elapsed = nowMs - lastEmergencyMs;

        if (elapsed < EMERGENCY_COOLDOWN_MS) {
          const nextAvailableMs = lastEmergencyMs + EMERGENCY_COOLDOWN_MS;
          const hoursRemaining = Math.ceil((nextAvailableMs - nowMs) / (60 * 60 * 1000));
          return new Response(JSON.stringify({
            ok: false,
            error: `Monthly script limit reached. Emergency script available in ${hoursRemaining} hour(s).`,
            quota_exceeded: true,
            next_emergency_at: new Date(nextAvailableMs).toISOString()
          }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        // Emergency script is allowed
        scriptType = "emergency";
      }
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured in Supabase Secrets");
    }
    const userPrompt = `
Create a Sturdy parenting script for this real-life moment.

Mode: ${mode || "crisis"}
Situation: ${situation || "Not provided"}
Age group: ${childAge || "unknown"}
Neurotype: ${neurotype || "none"}

Requirements:
- Make it concrete and situation-specific
- Make it sound natural out loud
- No placeholders or brackets
- Return valid JSON only
`;
   const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: systemPrompt
            }
          ]
        },
        contents: [
          {
            parts: [
              {
                text: userPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.55,
          responseMimeType: "application/json"
        }
      })
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.error?.message || "Gemini request failed");
    }
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      throw new Error("No text returned from Gemini");
    }
    let scriptData;
    try {
      scriptData = JSON.parse(generatedText);
    } catch (_err) {
      throw new Error("Model returned invalid JSON");
    }
    const clean = {
      ok: true,
      title: scriptData.title || "Hard moment support",
      regulate: scriptData.regulate || "",
      connect: scriptData.connect || "",
      guide: scriptData.guide || "",
      what_if: scriptData.what_if || "",
      script_type: scriptType
    };

    // --- Record usage (best-effort; do not fail the request if this errors) ---
    const { error: insertError } = await supabaseAdmin
      .from("script_usage")
      .insert({ user_id: user.id, script_type: scriptType });
    if (insertError) {
      console.error("Failed to record script usage:", insertError.message);
    }

    return new Response(JSON.stringify(clean), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
