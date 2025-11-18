import express from 'express';
import { analyzeAndOptimizeCV } from "../controllers/upload.controller.js";
import * as uploadController from "../controllers/upload.controller.js";
import { uploadCV } from '../middlewares/upload.middleware.js';
const router = express.Router();

router.post('/optimize-for-job', uploadCV, analyzeAndOptimizeCV);
router.get('/analydownload/:filenameze', uploadController.createpdfAndDownload);

export default router;