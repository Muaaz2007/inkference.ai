// Gemini Agent: direct REST call to Gemini v1 API with a strict JSON-only prompt

export interface ParsedForm {
  formType?: string;
  confidenceHints?: Record<string, number>;
  [key: string]: any;
}

export class GeminiAgent {
  private model: string;

  constructor(model: string = "models/gemini-1.5-flash") {
    this.model = model || "models/gemini-1.5-flash";
  }

  async parseFormText(text: string, formType?: string): Promise<ParsedForm> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const strictPrompt = `
You are a form extraction engine. You will receive OCR text from a photographed form.

You MUST follow these rules exactly:
- OUTPUT: Return ONLY a single JSON object. No explanations, no markdown, no prose, no backticks.
- FORMAT: The JSON must be syntactically valid and parseable by JSON.parse.
- KEYS: Use camelCase for all field names.
- VALUES: All field values must be strings, or null if missing/uncertain.
- CONFIDENCE: Include a top-level "confidenceHints" object mapping each field key to a number between 0 and 1.
- FORM TYPE: Include a top-level "formType" string describing the form, such as:
  - "invoice"
  - "receipt"
  - "shipping_label"
  - "application_form"
  - "tax_form"
  - "medical_form"
  - "generic_form"
- UNKNOWN FIELDS: If a likely field exists but the value is unreadable, still include the key with value null.
- NO EXTRA KEYS: Avoid adding random or speculative fields that are not clearly present in the OCR.
- STRICT JSON: Do NOT wrap the JSON in quotes, do NOT prefix with "Here is the JSON", do NOT include comments or markdown.
- OCR ERRORS: The OCR text may have errors. Use context to infer correct values when possible.

Example shape (illustrative only, do not copy values):

{
  "formType": "invoice",
  "invoiceNumber": "INV-004128",
  "date": "2025-03-18",
  "vendor": "Northwind Traders LLC",
  "totalAmount": "1274.50",
  "currency": "USD",
  "paymentTerms": "Net 30",
  "poNumber": "PO-79231",
  "confidenceHints": {
    "invoiceNumber": 0.86,
    "date": 0.95,
    "vendor": 0.62,
    "totalAmount": 0.88,
    "currency": 0.92,
    "paymentTerms": 0.75,
    "poNumber": 0.82
  }
}

Now process this OCR text and output ONLY the JSON object:

"""
${text.trim()}
"""
`;

    console.log("[v0] Calling Gemini API with model:", this.model);
    
    const url = `https://generativelanguage.googleapis.com/v1/${this.model}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: strictPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[v0] Gemini API error:", errText);
      throw new Error(`Gemini HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    console.log("[v0] Gemini API response received");

    // v1 API response shape
    const textOut =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("[v0] Gemini raw response:", textOut.substring(0, 200));

    const jsonText = this.extractJSONBlock(textOut);

    if (!jsonText) {
      console.error("[v0] Could not extract JSON from response:", textOut);
      throw new Error(
        `Could not find JSON in Gemini response. Raw response:\n${textOut}`,
      );
    }

    console.log("[v0] Extracted JSON block, parsing...");
    const parsed = JSON.parse(jsonText);
    console.log("[v0] Successfully parsed JSON with", Object.keys(parsed).length, "fields");
    
    return parsed;
  }

  private extractJSONBlock(text: string): string | null {
    const start = text.indexOf("{");
    if (start === -1) return null;

    const stack: string[] = [];
    for (let i = start; i < text.length; i++) {
      const ch = text[i];
      if (ch === "{") {
        stack.push("{");
      } else if (ch === "}") {
        stack.pop();
        if (stack.length === 0) {
          return text.substring(start, i + 1);
        }
      }
    }
    return null;
  }
}
