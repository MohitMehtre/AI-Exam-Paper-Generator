import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
}));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate-exam", async (req, res) => {
  try {
    const { topic, count } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate ${count} exam questions on the topic: ${topic}.
    Return only a valid JSON array of objects with 'question' and 'answer'.
    Do not include any extra text or formatting.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean Gemini's response
    const cleaned = text.replace(/```json|```/g, "").trim();
    const match = cleaned.match(/\[.*\]/s);

    if (!match) {
      throw new Error("No JSON array found in response");
    }

    const questions = JSON.parse(match[0]);

    res.json({ questions });
  } catch (err) {
    console.error("❌ Error generating exam:", err);
    res.status(500).json({ error: "Failed to generate exam" });
  }
});

// ------------------ Trying to deploy and host Serve React frontend ------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// ----------------------------------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
//   console.log(` Server running on http://localhost:${PORT}`);
});
