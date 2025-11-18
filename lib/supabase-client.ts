// Supabase Client matching Python backend's supabase_client.py
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const PDF_BUCKET = process.env.SUPABASE_PDF_BUCKET || "inkference-pdfs";

/**
 * SupabaseClient class matching Python backend's SupabaseClient
 */
export class SupabaseClient {
  private client: ReturnType<typeof createSupabaseClient> | null;

  constructor(url?: string, key?: string) {
    const finalUrl = url || SUPABASE_URL;
    const finalKey = key || SUPABASE_KEY;

    if (finalUrl && finalKey) {
      this.client = createSupabaseClient(finalUrl, finalKey);
    } else {
      this.client = null;
    }
  }

  /**
   * Insert submission to formsnap_submissions table
   */
  async insertSubmission(
    submissionId: string,
    parsed: Record<string, any>,
    rawText?: string
  ) {
    if (!this.client) {
      throw new Error("Supabase client not configured");
    }

    const payload = {
      id: submissionId,
      parsed,
      raw_text: rawText,
    };

    const { data, error } = await this.client
      .from("formsnap_submissions")
      .insert(payload)
      .select();

    if (error) {
      throw new Error(`Supabase insert failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Upload PDF to storage bucket
   */
  async uploadPDF(submissionId: string, pdfBuffer: Buffer) {
    if (!this.client) {
      throw new Error("Supabase client not configured");
    }

    const dest = `${submissionId}.pdf`;
    const { data, error } = await this.client.storage
      .from(PDF_BUCKET)
      .upload(dest, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (error) {
      throw new Error(`PDF upload failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Get public URL for uploaded PDF
   */
  getPDFUrl(submissionId: string): string {
    if (!this.client) {
      throw new Error("Supabase client not configured");
    }

    const dest = `${submissionId}.pdf`;
    const { data } = this.client.storage
      .from(PDF_BUCKET)
      .getPublicUrl(dest);

    return data.publicUrl;
  }
}
