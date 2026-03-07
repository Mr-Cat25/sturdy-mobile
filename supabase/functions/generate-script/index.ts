import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
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
    const { situation, childAge, neurotype, mode } = await req.json();
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
      what_if: scriptData.what_if || ""
    };
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
