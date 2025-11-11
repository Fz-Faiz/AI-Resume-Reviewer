import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";


import authRoutes from './routes/auth.route.js';
import resumeRoutes from "./routes/resume.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();


app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth/', authRoutes);
app.use('/api/resume/', resumeRoutes);

app.listen(PORT, ()=>{
    console.log(`Server started at PORT: ${PORT}`);
    connectDB();
})