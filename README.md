# 🐇 Explorer Rabbit — AI-Powered Learning & Sharing Platform

**Explorer Rabbit** is a full-stack, AI-powered platform where users can generate educational content based on prompts or custom text. It enhances the learning experience with relevant images, multiple-choice questions (MCQs), social media post generation, and the ability to save and export personalized content.

---

## 📺 Demo Video

▶️ Watch the full walkthrough on YouTube:  
[![Explorer Rabbit Demo]([https://img.youtube.com/vi/YOUR_VIDEO_ID_HERE/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID_HERE](https://youtu.be/uqjX_mTLotU?si=TZUV_DaVCzzos8pL))

> EXPLORERrabbit – AI-Powered Learning + Quiz + Content Generator | Built with Bolt.new.

---

## 🚀 Features

- ✍️ **Prompt-Based Content Generation**: Users can enter a prompt or paste their own text to receive AI-generated explanations.
- 🖼️ **Image Enrichment**: Automatically adds relevant AI-generated images between text sections for better visual engagement.
- 🧠 **MCQ Generation**: Users can generate multiple-choice questions by selecting a difficulty level to test their understanding.
- 📤 **MCQ Result Sharing**: Converts quiz results into a shareable image using `html2canvas`.
- 📱 **Social Media Post Generator**: Users can generate posts in formats like:
  - Motivational
  - Did-you-know
  - Personal Journey
- 💾 **User Dashboard**: Save content, quizzes, and posts to your account for future access.
- 📄 **PDF Export**: Download everything as a clean PDF using `html2pdf`.
- ☁️ **Authentication & Storage**: Managed via Supabase with secure backend logic using Supabase Edge Functions.

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Zustand, Vite
- **Backend & Auth**: Supabase, Supabase Edge Functions
- **AI Generation**: Groq API (for text, MCQs, and social media post creation)
- **PDF/Image Tools**: HTML2Canvas, HTML2PDF
- **Deployment**: Vercel

---

## 🌐 Live Demo

💻 [GitHub Repository]([https://github.com/sameerdevlab/explorer-rabbit](https://github.com/sameerdevlab/Explorerrabbit.git))

---

## 📦 Installation

```bash
git clone [https://github.com/sameerdevlab/explorer-rabbit.git](https://github.com/sameerdevlab/Explorerrabbit.git)
cd Explorerrabbit
npm install
npm run dev

