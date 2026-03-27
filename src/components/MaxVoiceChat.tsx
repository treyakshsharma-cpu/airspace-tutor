"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const AVATAR_KEY = "maxvoicechat_avatar";

const defaultAvatar =
  "https://api.dicebear.com/7.x/bottts/svg?seed=Max";

export default function MaxVoiceChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [avatar, setAvatar] = useState<string>(defaultAvatar);
  const [ttsApiKey, setTtsApiKey] = useState<string>("");
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem(AVATAR_KEY);
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    };
    setMessages((msgs) => [...msgs, newMsg]);
    setInput("");
    // Simulate assistant reply
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        {
          role: "assistant",
          content: `Echo: ${input}`,
          timestamp: Date.now(),
        },
      ]);
    }, 800);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setAvatar(url);
      localStorage.setItem(AVATAR_KEY, url);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarChange = (url: string) => {
    setAvatar(url);
    localStorage.setItem(AVATAR_KEY, url);
  };

  const downloadChat = (type: "txt" | "json") => {
    let data: string;
    let filename: string;
    if (type === "txt") {
      data = messages
        .map(
          (m) =>
            `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.role}: ${m.content}`
        )
        .join("\n");
      filename = "chat.txt";
    } else {
      data = JSON.stringify(messages, null, 2);
      filename = "chat.json";
    }
    const blob = new Blob([data], { type: type === "txt" ? "text/plain" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-zinc-900 rounded-2xl shadow-xl p-6 mt-10">
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={avatar}
          alt="Avatar"
          className="w-16 h-16 rounded-full border-2 border-zinc-700 object-cover"
        />
        <div>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mr-2"
          >
            Upload Avatar
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
          <Button
            variant="secondary"
            onClick={() => handleAvatarChange(defaultAvatar)}
          >
            Use Default
          </Button>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg p-4 h-72 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <div className="text-zinc-500 text-center mt-16">No messages yet.</div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-xs break-words text-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-700 text-zinc-100"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 rounded-lg px-3 py-2 bg-zinc-800 text-white border border-zinc-700 focus:outline-none"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>

      <div className="flex space-x-2 mb-4">
        <Button variant="outline" onClick={() => downloadChat("txt")}>Download TXT</Button>
        <Button variant="outline" onClick={() => downloadChat("json")}>Download JSON</Button>
        <Button variant="ghost" onClick={() => setShowHelp((h) => !h)}>
          {showHelp ? "Hide Help" : "Show Help"}
        </Button>
      </div>

      <div className="mb-4">
        <label className="block text-zinc-400 text-sm mb-1">Advanced TTS API Key</label>
        <input
          type="password"
          value={ttsApiKey}
          onChange={(e) => setTtsApiKey(e.target.value)}
          placeholder="Paste your ElevenLabs or Google TTS API key here"
          className="w-full rounded-lg px-3 py-2 bg-zinc-800 text-white border border-zinc-700 focus:outline-none"
        />
        <div className="text-xs text-zinc-500 mt-1">
          (Not connected yet. This is a placeholder for future TTS integration.)
        </div>
      </div>

      {showHelp && (
        <div className="bg-zinc-800 rounded-lg p-4 text-zinc-300 text-sm mb-2">
          <h2 className="font-bold mb-2 text-white">How to use Airspace Tutor</h2>
          <ul className="list-disc pl-5 space-y-1 text-left">
            <li>Chat with Max about drone airspace compliance and flight planning.</li>
            <li>Upload your own avatar or use the default one.</li>
            <li>Download your chat as TXT or JSON for your records.</li>
            <li>Paste your TTS API key to enable advanced voice features (coming soon).</li>
          </ul>
        </div>
      )}
    </div>
  );
}
