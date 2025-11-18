import fs from "fs";
import path from "path";

const GENERATED_DIR = path.join("generated");

// בדיקה האם קובץ קיים
export function checkFileExists(filename) {
  const filePath = path.join(GENERATED_DIR, filename);

  return fs.existsSync(filePath);
}

// שליפת הנתיב המלא לפידיאף
export function getFilePath(filename) {
  return path.join(GENERATED_DIR, filename);
}

// אופציונלי: מחיקה אחרי הורדה
export function deleteFileAfterDownload(filename) {
  const filePath = getFilePath(filename);
  fs.unlink(filePath, err => {
    if (err) console.warn("Could not delete file:", filePath);
  });
}
