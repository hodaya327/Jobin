import express from "express";
import { downloadFile } from "../controllers/download.controller.js";
// import { downloadCv } from '../middlewares/download.middleware.js';

const router = express.Router();

// GET /api/download/:filename
router.get("/download/:filename", downloadFile);

export default router;
