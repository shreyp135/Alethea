import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import { connectToMongo } from "../src/utils/mongodb";
import logsRouter from "./routers/logsRouter";
import incidentsRouter from "./routers/incidentRouter";
import chatbotRouter from "./routers/chatRouter";
import memoryRouter from "./routers/memoryRouter";
import prRouter from "./routers/prRouter";
import authRouter from "./routers/authRouter";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

await connectToMongo();

const app = express();
app.use(cors({
  origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  } 
));

app.use(express.json());

app.use("/api/logs", logsRouter);
app.use("/api/incidents", incidentsRouter);
app.use("/api/chatbot", chatbotRouter);
app.use("/api/memory", memoryRouter);
app.use("/api/pr", prRouter);
app.use("/api/auth", authRouter);


app.listen(process.env.PORT || 8080, () => {
  console.log(`API Server running on port ${process.env.PORT || 8080}`);
}
);
