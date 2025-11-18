import { analyzeAndOptimizeCVService } from "../services/upload.service.js";

export async function analyzeAndOptimizeCV(req, res) {
  try {
    // 1. בדיקה שיש קובץ
    if (!req.file) {
      return res.status(400).json({ error: 'CV file is required (field name: cv)' });
    }

    // 2. קבלת תיאור משרה מה-body
    const jobDescription = req.body.jobDescription;
    if (!jobDescription) {
      return res.status(400).json({ error: 'jobDescription is required in the request body' });
    }

    // 3. קריאה ל-service
    const result = await analyzeAndOptimizeCVService(req.file.buffer, jobDescription);

    // 4. החזרת תשובה ללקוח
    return res.json({
      message: 'CV analyzed and optimized successfully',
      analysis: result.analysis,
      generatedFileName: result.fileName,
    });
  } catch (err) {
    console.error('Error in analyzeAndOptimizeCV controller:', err);
    return res.status(500).json({ error: err.message });
  }
}