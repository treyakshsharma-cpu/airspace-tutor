import { NextRequest, NextResponse } from 'next/server';

// --- SETUP ---
// 1. Add your OpenAI API key and SerpAPI key to your environment variables (.env.local):
//    OPENAI_API_KEY=sk-...
//    SERPAPI_KEY=...
// 2. Install dependencies: npm install openai node-fetch
// 3. (Optional) For advanced TTS, use ElevenLabs/Google TTS API in the frontend.

import OpenAI from 'openai';
import fetch from 'node-fetch';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const SERPAPI_KEY = process.env.SERPAPI_KEY;

async function fetchWebResults(query: string) {
  if (!SERPAPI_KEY) return null;
  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&num=3`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data.organic_results?.map((r: any) => ({ title: r.title, link: r.link, snippet: r.snippet })).slice(0, 3) || [];
}

function summarizeWebResults(results: any[]) {
  if (!results || results.length === 0) return '';
  return results.map(r => `${r.title}: ${r.snippet} (${r.link})`).join('\n');
}

export async function POST(req: NextRequest) {
  const { message, history } = await req.json();

  // 1. Fetch web results
  const webResults = await fetchWebResults(message);
  const webSummary = summarizeWebResults(webResults);

  // 2. Compose messages for OpenAI
  const chatHistory = (history || []).map((m: any) => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: m.text,
  }));
  const systemPrompt = webSummary
    ? `You are Max, an expert AI assistant. Use the following web results for accuracy and cite sources if relevant.\n${webSummary}`
    : `You are Max, an expert AI assistant. Answer as accurately and helpfully as possible.`;

  // 3. Call OpenAI (streaming for speed)
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      ...chatHistory,
      { role: 'user', content: message },
    ],
    stream: true, // Enable streaming for advanced streaming (requires frontend support)
    temperature: 0.7,
  });

  let reply = '';
  if (completion && completion.choices && completion.choices[0] && completion.choices[0].message) {
    reply = completion.choices[0].message.content;
  }

  return NextResponse.json({ reply, webResults });
}
