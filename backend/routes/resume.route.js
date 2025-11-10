import express from "express"
import { analyzeResume, editResume } from "../controllers/resume.controller.js"

const router = express.Router()

router.post('/edit', editResume)

router.post('/analyze', analyzeResume)

export default router