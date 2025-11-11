import express from "express"
import { analyzeResume, editResume } from "../controllers/resume.controller.js"
import multer from "multer"
const router = express.Router()

const upload = multer()

router.post('/edit', editResume)

router.post('/analyze',upload.single("file"), analyzeResume)

export default router