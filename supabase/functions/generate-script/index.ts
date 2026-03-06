import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// 1. Maintain your specialized system prompt
const systemPrompt = `You are Sturdy, a compassionate parenting script generator...`; 

serve(async (req) => {
  try {
    const { situation, childName, childAge, neurotype, tonePreference, mode } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    // 2. Call the Gemini API using the Fetch API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [{
            parts: [{ text: `Situation: ${situation}. Child: ${childName}. Age: ${childAge}.` }]
          }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json", // Critical for maintaining your ScriptResult interface
          }
        })
      }
    );

    const result = await response.json();
    
    // 3. Extract and parse the JSON response to match your ScriptResult interface
    const generatedText = result.candidates[0].content.parts[0].text;
    const scriptData = JSON.parse(generatedText);

    return new Response(JSON.stringify({ ok: true, ...scriptData }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
})