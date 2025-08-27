import { NextRequest, NextResponse } from "next/server";
import { gemini, MIN_CONF } from "@/lib/ai/gemini";
import { INTENT_DEFS } from "@/lib/intents";

const SYSTEM_PROMPT = `You are an Intent Normalizer for a finance/invoicing UI. Map user text to EXACTLY ONE of the intents below and extract params.
Return STRICT JSON only, no prose.

Intents:
${Object.entries(INTENT_DEFS).map(([k, v]) => `- ${k}: ${v.description} | params: ${JSON.stringify(v.params)}`).join("\n")}

Rules:
- If multiple intents seem possible, pick the most task-ready one.
- Normalize wording (e.g., "last quarter" -> 90 days if unspecified; "three items" -> 3).
- businessId must preserve prefix like "INV-1047".
- If you cannot map confidently, output intent "none" with confidence 0 and empty params.

Output JSON shape:
{
"intent": "show_invoices" | "open_invoice" | "top_debtors" | "create_invoice" | "none",
"normalizedUtterance": string,
"confidence": number, // 0..1 model confidence of the mapping
"params": object // matches the selected intent's params
}

Few-shot examples:

User: "show me invoices for 90 days"
JSON: {"intent":"show_invoices","normalizedUtterance":"show invoices for the last 90 days","confidence":0.88,"params":{"periodDays":90}}

User: "open inv-1047. who did we send it to?"
JSON: {"intent":"open_invoice","normalizedUtterance":"open invoice INV-1047","confidence":0.86,"params":{"businessId":"INV-1047"}}

User: "who owes us the most?"
JSON: {"intent":"top_debtors","normalizedUtterance":"top debtors by amount","confidence":0.8,"params":{"limit":10}}

User: "create invoice for Acme, 3 items, net 30"
JSON: {"intent":"create_invoice","normalizedUtterance":"create draft invoice for Acme with 3 items, Net 30 terms","confidence":0.84,"params":{"clientName":"Acme","items":[{"qty":3}],"terms":"Net 30"}}`;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${text}\nJSON:`;
    const result = await gemini.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      },
    });

    const raw = result.response.text().trim();
    let parsed: Record<string, unknown>;
    try { 
      parsed = JSON.parse(raw); 
    } catch { 
      return NextResponse.json({ error: "Bad JSON from model", raw }, { status: 502 }); 
    }

    // Simple safety/validation
    const intent = parsed.intent ?? "none";
    const confidence = Number(parsed.confidence ?? 0);
    if (intent === "none" || isNaN(confidence) || confidence < MIN_CONF) {
      return NextResponse.json({ 
        intent: "none", 
        confidence: 0, 
        params: {}, 
        normalizedUtterance: text 
      }, { status: 200 });
    }

    // Basic param normalization
    if (intent === "show_invoices" && (parsed.params as any)?.periodDays) {
      (parsed.params as any).periodDays = Number((parsed.params as any).periodDays);
    }
    if (intent === "top_debtors" && (parsed.params as any)?.limit == null) {
      parsed.params = { ...(parsed.params as any), limit: 10 };
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
