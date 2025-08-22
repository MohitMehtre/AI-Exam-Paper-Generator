# AI Exam Paper Generator

A full-stack web application that generates customized exam papers using AI.  
Built with **React (frontend)**, **Node.js + Express (backend)**, and integrated with **Gemini AI API** for intelligent paper generation.  

---

### Live Demo  
👉 [View Live Project] Sorry Not added yet  

---

## 🎥 Demo Video

[![Watch the demo](./assets/demo.gif)](./assets/demo.mp4)

---

## 🚀 Features
- Generate exam papers based on subject, topic, and difficulty.  
- Customizable number of questions and paper format.  
- AI-powered question creation using **Gemini API**.  
- Full-stack architecture with separate **frontend** and **backend**.  
- Production-ready deployment support (Vercel, Render, etc).  

---

## 🛠️ Tech Stack
- **Frontend**: React, TailwindCSS  
- **Backend**: Node.js, Express.js  
- **AI Integration**: Gemini API  
- **Hosting**: Vercel / Render  
- **Version Control**: Git & GitHub  

---

## 📂 Project Structure
```
ai-exam-paper-generator/
│
├── exam-frontend/ # React frontend
├── exam-backend/ # Express backend
├── assets/ # demo video
├── .gitignore
├── .env.example # Example environment variables
└── README.md
```
---

## ⚙️ Setup Instructions  

### 1. Clone the repo  
```bash
git clone https://github.com/MohitMehtre/AI-Exam-Paper-Generator.git
cd ai-exam-paper-generator
```

### 2. Install dependencies
```bash
cd exam-frontend && npm install
cd ../exam-backend && npm install
```

### 3. Environment variables

Create a .env file inside the exam-backend/ folder (not committed to git).
```env
GEMINI_API_KEY=your_api_key
FRONTEND_URL=http://localhost:3000
```

For production, set FRONTEND_URL to your deployed frontend link.
PORT is automatically managed by hosting platforms (you don’t need to set it).

### 4. Run the app locally
Backend
```bash
cd exam-backend
npm start
```
Frontend
```bash
cd exam-frontend
npm run dev
```

App runs at:

- Frontend → http://localhost:3000

- Backend → http://localhost:5000

---

## 📝 License
This project is licensed under the MIT License.

---
