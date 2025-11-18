import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function extractFormFields(imageBase64: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are an AI form extraction expert. Analyze this form image and extract ALL fields into structured JSON.

Your response MUST be valid JSON with this exact structure:
{
  "form_type": "invoice" | "receipt" | "form" | "other",
  "detection_confidence": 0.0 to 1.0,
  "fields": {
    // All extracted key-value pairs from the form
  },
  "validation": {
    "issues": [
      // Array of validation issues found
    ],
    "warnings": [
      // Array of warnings
    ]
  }
}

Extract everything you can see including:
- Invoice/form numbers
- Dates
- Names/vendors
- Amounts
- Line items
- Any other text fields

Also validate:
- Math calculations (totals, subtotals)
- Missing required fields
- Low confidence readings
- Suspicious values

Return ONLY the JSON, no markdown formatting, no explanations.`;

  const result = await model.generateContent([
    {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg",
      },
    },
    prompt,
  ]);

  const response = result.response.text();
  
  // Clean response (remove markdown code blocks if present)
  const cleaned = response
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  return JSON.parse(cleaned);
}
