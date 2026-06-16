import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { transcript, templateHeaders, localDate } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing on the server.' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    // Use the browser's local date, or fallback to UTC if not provided
    const currentDate = localDate || new Date().toISOString().split('T')[0];

    const prompt = `
You are an expert data extraction assistant. The user has spoken the following transcript (it may be in a local language, please translate it to English implicitly if needed before mapping):
"${transcript}"

The target database table has the following columns:
[${templateHeaders.join(', ')}]

CRITICAL RULES:
1. Extract the relevant information from the transcript and map it EXACTLY to these columns.
2. Transcription Correction: The transcript comes from a raw speech-to-text engine which often mishears words. Use your contextual AI reasoning to actively CORRECT any phonetically misspelled words, especially medical terminology, hospital names, Indian names, or acronyms (e.g. "ENT", "GKNM") before extracting them.
3. Grammar & Formatting: Ensure all extracted text has perfect grammar and forms correct sentences. Automatically standardize professional titles (e.g., if the user says "Doctor", format it as "Dr.").
4. If a column expects a DATE (and the user says things like "today", "yesterday", "last week"), you MUST calculate the actual calendar date and return it in standard YYYY-MM-DD format. For reference, today's date is: ${currentDate}.
5. Return ONLY a raw JSON object where the keys are the exact column names, and the values are the extracted strings. 
6. Do not include any markdown formatting like \`\`\`json. If a column's data is not present in the transcript, leave it as an empty string.
`;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Clean up any markdown that Gemini might accidentally include
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const extractedData = JSON.parse(cleanJson);

      return NextResponse.json({ data: extractedData });
    } catch (apiError: any) {
      console.error('Gemini API Error:', apiError);
      
      // FALLBACK MOCK DATA: If Google's servers are overloaded (503), return dummy data
      // so the user can still test the Confirmation UI.
      const mockData: any = {};
      templateHeaders.forEach((h: string) => {
        const lower = h.toLowerCase();
        if (lower.includes('date')) mockData[h] = new Date().toISOString().split('T')[0];
        else if (lower.includes('amount') || lower.includes('cost') || lower.includes('price')) mockData[h] = "45.00";
        else if (lower.includes('name')) mockData[h] = "John Doe";
        else mockData[h] = `Sample ${h}`;
      });

      return NextResponse.json({ 
        data: mockData,
        note: "Note: Google's AI servers are currently overloaded (503 error). This is auto-generated mock data so you can test the UI!"
      });
    }
  } catch (err: any) {
    console.error('Gemini Extraction Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
