import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts } from 'pdf-lib';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ממיר buffer ל-base64 עבור Gemini
function bufferToGenerativePart(buffer) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType: 'application/pdf',
    },
  };
}

// יצירת PDF חדש מהטקסט המשופר
async function createImprovedCvPdf(improvedText) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const lineHeight = 16;

  const maxWidth = width - 80;
  const wrappedLines = wrapText(improvedText, 90); // עטיפת שורות בסיסית

  let y = height - 50;

  for (const line of wrappedLines) {
    if (y < 50) {
      page.addPage();
      y = height - 50;
    }
    page.drawText(line, {
      x: 40,
      y,
      size: fontSize,
      font,
    });
    y -= lineHeight;
  }

  const pdfBytes = await pdfDoc.save();

  const dir = path.join('generated');
  await fs.promises.mkdir(dir, { recursive: true });

  const fileName = `cv-optimized-${Date.now()}.pdf`;
  const filePath = path.join(dir, fileName);

  await fs.promises.writeFile(filePath, pdfBytes);

  return { fileName, filePath };
}

// עטיפת שורות מאוד פשוטה (לא חייב מושלם)
function wrapText(text, maxCharsPerLine) {
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > maxCharsPerLine) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += ' ' + word;
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return lines;
}

// ====== פונקציית ה-service המרכזית ======
export async function analyzeAndOptimizeCVService(fileBuffer, jobDescription) {
  const pdfPart = bufferToGenerativePart(fileBuffer);

  const prompt = `
You are an expert CV and job-matching assistant.

The user has provided:
1. CV as PDF (inlineData)
2. Job description text.

Tasks:
- Extract the main skills and experience from the CV.
- Compare them to the job description.
- Return JSON ONLY in the following structure:

{
  "keySkills": [ "skill1", "skill2", ... ],
  "suggestedChanges": "text",
  "missingSkills": [ "skillA", "skillB" ],
  "matchScore": 0-100,
  "specificRecommendations": "text",
  "improvedCvContent": "FULL CV TEXT IN MARKDOWN OR PLAIN TEXT"
}

Do not add any extra text outside this JSON.
Job description:
${jobDescription}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [pdfPart, prompt],
  });

  // ב-SDK שלך ייתכן שצריך response.response.text(), משאירה כמו בדוגמה שלך:
  const rawText = response.text ?? response.response?.text?.();

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (e) {
    // אם ה-AI לא החזיר JSON תקין
    parsed = {
      raw: rawText,
      error: 'Failed to parse JSON from AI',
    };
  }

  const improvedText = parsed.improvedCvContent || 'No improved CV returned from AI.';
  const { fileName } = await createImprovedCvPdf(improvedText);

  return {
    analysis: {
      keySkills: parsed.keySkills ?? [],
      suggestedChanges: parsed.suggestedChanges ?? '',
      missingSkills: parsed.missingSkills ?? [],
      matchScore: parsed.matchScore ?? null,
      specificRecommendations: parsed.specificRecommendations ?? '',
    },
    fileName,
  };
}
