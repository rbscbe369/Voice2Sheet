# Voice2Sheet 🎙️➡️📊

**Voice2Sheet** is an AI-powered Voice CRM that allows professionals to dictate complex medical or business records, auto-correct them using Google Gemini, and instantly sync them to dynamically generated cloud databases and exportable Excel files.

## 🚀 Key Features

- **Dynamic Database Generation**: Upload any blank Excel template, and the app will instantly detect the headers and automatically build a matching SQL table in your Supabase cloud—no database knowledge required.
- **AI Auto-Correction**: Built-in voice recognition (tuned for local accents) captures your speech, while Google Gemini 3.5 Flash actively corrects grammar, medical terminology, and standardizes formats before saving.
- **Smart Date Math**: Say conversational terms like "yesterday" or "last week", and the AI will automatically calculate and inject the correct calendar date (YYYY-MM-DD).
- **Media Attachments**: Snap pictures of medical charts, bills, or receipts and attach them directly to your voice entries via Cloudinary integration.
- **Universal History Dashboard**: A fully searchable, date-filterable CRM dashboard to track all voice entries.
- **1-Click Excel Export**: Filter your data and instantly download it back into a pristine `.xlsx` file.
- **AI Push Notifications**: Background service workers deliver daily AI-generated briefings of your recent CRM activity.

## 🛠️ Tech Stack
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS (Glassmorphism UI)
- **AI Engine:** Google Gemini 3.5 Flash API
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Clerk
- **Storage:** Cloudinary

## ⚙️ Local Setup
To run this project locally, you will need to add a `.env.local` file with the following keys:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
GEMINI_API_KEY=your_gemini_key
```
Then run:
```bash
npm install
npm run dev
```
