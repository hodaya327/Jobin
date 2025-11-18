import {
  checkFileExists,
  getFilePath,
  deleteFileAfterDownload
} from "../services/download.service.js";

export function downloadFile(req, res) {
  try {
    const filename = req.params.filename;

    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    // בדיקה שהקובץ קיים
    if (!checkFileExists(filename)) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = getFilePath(filename);

    // headers להורדה
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // שליחה
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        return;
      }

      // אופציונלי — מחיקה לאחר הורדה
      deleteFileAfterDownload(filename);
    });

  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: err.message });
  }
}
