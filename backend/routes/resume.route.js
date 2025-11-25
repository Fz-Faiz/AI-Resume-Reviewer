import express from "express"
import { analyzeResume, editResume, uploadResume, chatResume, generatePdf } from "../controllers/resume.controller.js"
import multer from "multer"
const router = express.Router()

const upload = multer()

router.post('/edit',upload.single("file"), editResume)

router.post('/analyze',upload.single("file"), analyzeResume)

router.post('/upload', upload.single("file"), uploadResume)

router.post('/chat', chatResume)

router.post('/generate-pdf', generatePdf)

export default router