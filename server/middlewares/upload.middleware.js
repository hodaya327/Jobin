import multer from "multer";

// שמירה בזיכרון כדי לא לקרוא מהדיסק
const upload = multer({ storage: multer.memoryStorage() });

export const uploadCV = upload.single("cv");
