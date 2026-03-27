"use client";
import * as React from "react";
// import { Configuration, OpenAIApi } from "openai"; // Uncomment when API key is set

export default function AITutor() {
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Placeholder for OpenAI integration
  async function handleAskAI(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAnswer("");
    // Uncomment and configure when ready:
    // const configuration = new Configuration({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });
    // const openai = new OpenAIApi(configuration);
    // const res = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "user", content: question }],
    // });
    // setAnswer(res.data.choices[0].message.content);
    setTimeout(() => {
      setAnswer("[AI Tutor] This is a placeholder answer. Connect your OpenAI API key to enable real explanations!");
      setLoading(false);
    }, 1200);
  }

  return (
    <div className="w-full bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/10 text-white">
      <h3 className="font-bold mb-2">AI Tutor</h3>
      <form onSubmit={handleAskAI} className="flex flex-col gap-2">
        <input
          className="rounded px-3 py-2 bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ask the AI Tutor anything about airspace..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          required
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </form>
      {answer && (
        <div className="mt-4 p-3 bg-zinc-900 rounded text-blue-200 border border-blue-700 animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
}
