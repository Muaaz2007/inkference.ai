// Main API route matching Python backend's main.py
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { extractTextFromImage } from "@/lib/ocr";
import { GeminiAgent } from "@/lib/gemini-agent";
import { SupabaseClient } from "@/lib/supabase-client";
import { generateFilledPDF } from "@/lib/pdf-generator";

const GEMINI_MODEL =
  process.env.GEMINI_MODEL && process.env.GEMINI_MODEL.startsWith("models/gemini")
    ? process.env.GEMINI_MODEL
    : "models/gemini-1.5-flash";

const OCR_PROVIDER =
  (process.env.OCR_PROVIDER as "tesseract" | "vision") || "tesseract";
const STORE_PDF = process.env.STORE_PDF?.toLowerCase() !== "false";

// Initialize clients
const agent = new GeminiAgent(GEMINI_MODEL);
const supabase = new SupabaseClient();

/**
 * POST /api/formsnap - Main upload endpoint
 * Matches Python backend's POST /upload endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const formType = formData.get("form_type") as string | null;

    if (!file) {
      return NextResponse.json(
        { detail: "No file provided" },
        { status: 400 },
      );
    }

    const contents = await file.arrayBuffer();
    if (contents.byteLength === 0) {
      return NextResponse.json(
        { detail: "Uploaded file is empty" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(contents);

    console.log("[v0] Using MOCKED logistics shipping form (no OCR, no Gemini)");

    const parsed = {
      formType: "logistics_shipping",
      trackingNumber: "DXB-2025-112358",
      shipmentDate: "2025-11-18",
      senderName: "Acme Trading LLC",
      senderAddress: "Warehouse 3, Dubai Industrial City, UAE",
      senderPhone: "+971-4-1234567",
      receiverName: "Global Imports Co.",
      receiverAddress: "Jebel Ali Free Zone, Dubai, UAE",
      receiverPhone: "+971-4-7654321",
      weightKg: "250",
      volumeM3: "2.5",
      numberOfItems: "12",
      declaredValue: "5000",
      currency: "AED",
      specialInstructions: "Handle with care",
      confidenceHints: {
        trackingNumber: 0.98,
        shipmentDate: 0.97,
        senderName: 0.96,
        senderAddress: 0.95,
        senderPhone: 0.95,
        receiverName: 0.96,
        receiverAddress: 0.95,
        receiverPhone: 0.94,
        weightKg: 0.93,
        volumeM3: 0.92,
        numberOfItems: 0.93,
        declaredValue: 0.9,
        currency: 0.95,
        specialInstructions: 0.9,
      },
    };

    console.log("[v0] ✓ Returning mocked parsed data with", Object.keys(parsed).length, "fields");

    // Step 1: Persist to Supabase
    const submissionId = uuidv4();
    let pdfUrl: string | null = null;

    try {
      console.log("[v0] Saving to Supabase with ID:", submissionId);
      await supabase.insertSubmission(submissionId, parsed, "MOCKED_OCR_TEXT");
      console.log("[v0] Submission saved successfully");
    } catch (error) {
      // Non-fatal: still return parsed result but warn
      console.warn("[v0] Supabase insert failed:", error);
    }

    // Step 2: Optional PDF generation & storage
    if (STORE_PDF) {
      try {
        console.log("[v0] Generating PDF...");
        const pdfBytes = generateFilledPDF(parsed, buffer);

        // Upload to Supabase bucket
        try {
          await supabase.uploadPDF(submissionId, pdfBytes);
          pdfUrl = supabase.getPDFUrl(submissionId);
          console.log("[v0] PDF uploaded:", pdfUrl);
        } catch (error) {
          console.warn("[v0] PDF upload failed:", error);
          pdfUrl = null;
        }
      } catch (error) {
        console.warn("[v0] PDF generation failed:", error);
      }
    }

    // Return response matching Python backend structure
    return NextResponse.json({
      id: submissionId,
      parsed,
      pdf_url: pdfUrl,
    });
  } catch (error) {
    console.error("[v0] API error:", error);
    return NextResponse.json(
      {
        detail:
          error instanceof Error ? error.message : "Processing failed",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/formsnap/health - Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "Inkference AI",
    mode: "mocked_data",
  });
}
