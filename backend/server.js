import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";


import authRoutes from './routes/auth.route.js';
import resumeRoutes from "./routes/resume.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();


app.use(
    cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve()

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth/', authRoutes);
app.use('/api/resume/', resumeRoutes);

app.use(express.static(path.join(__dirname, "frontend/dist")));

// SPA fallback (Express v5 safe)
app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "frontend", "dist", "index.html")
  );
});

app.listen(PORT, ()=>{
    console.log(`Server started at PORT: ${PORT}`);
    connectDB();
})