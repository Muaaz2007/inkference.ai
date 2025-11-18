// OCR functionality matching Python backend's ocr.py
import Tesseract from 'tesseract.js';

export type OCRProvider = 'tesseract' | 'vision';

/**
 * Extract text from image using Tesseract OCR (browser-compatible)
 * Matches the functionality of Python backend's extract_text_from_image
 */
export async function extractTextFromImage(
  imageBytes: Buffer,
  provider: OCRProvider = 'tesseract'
): Promise<string> {
  if (provider === 'vision') {
    // Google Cloud Vision API (optional)
    return await visionOCR(imageBytes);
  }
  
  // Default to Tesseract
  return await tesseractOCR(imageBytes);
}

async function tesseractOCR(imageBytes: Buffer): Promise<string> {
  try {
    const result = await Tesseract.recognize(imageBytes, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`[v0] OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });
    
    return result.data.text;
  } catch (error) {
    throw new Error(`Tesseract OCR failed: ${error}`);
  }
}

async function visionOCR(imageBytes: Buffer): Promise<string> {
  // Placeholder for Google Cloud Vision API
  // Would require google-cloud/vision package and GOOGLE_APPLICATION_CREDENTIALS
  throw new Error('Google Cloud Vision OCR not yet implemented. Use tesseract provider.');
}
