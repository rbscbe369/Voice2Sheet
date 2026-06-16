import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { supabaseUrl, supabaseKey, templates } = await req.json();

    if (!supabaseUrl || !supabaseKey || !templates || templates.length === 0) {
      return NextResponse.json({ error: 'Missing configuration' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const tableName = templates[0].name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_").toLowerCase();

    // Fetch the last 10 entries to generate a briefing
    const { data: rows, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error || !rows || rows.length === 0) {
      return NextResponse.json({ summary: "You have no recent entries today. A quiet day!" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `
You are a daily briefing AI for a busy professional. Here are their most recent CRM entries:
${JSON.stringify(rows)}

Write a very short, punchy 2-sentence summary of what happened recently. Mention any "Important Remarks" or action items if they exist. Do NOT use markdown. Keep it strictly under 150 characters.
`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();

    return NextResponse.json({ summary });
  } catch (err: any) {
    console.error('Briefing Error:', err);
    return NextResponse.json({ error: 'Failed to generate briefing' }, { status: 500 });
  }
}
