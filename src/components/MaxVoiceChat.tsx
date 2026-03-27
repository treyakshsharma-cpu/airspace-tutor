"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Avatar images (could be URLs or base64)
const defaultAvatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
];

// Helper to get/set avatar in localStorage
function getStoredAvatar() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userAvatar");
}
function setStoredAvatar(avatar: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("userAvatar", avatar);
}

// Placeholder for TTS API integration
async function fetchTTSAudio(text: string, apiKey: string): Promise<string> {
  // Replace with real TTS API call (e.g., ElevenLabs, Google TTS)
  // Return a URL or base64 audio string
  // For now, just return an empty string
  return "";
}

interface ChatMessage {
  sender: "user" | "max";
  text: string;
  timestamp: number;
}

export default function MaxVoiceChat() {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [ttsMode, setTTSMode] = useState<"none" | "basic" | "premium">("none");
  const [ttsApiKey, setTTSApiKey] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setAvatar(getStoredAvatar() || defaultAvatars[0]);
  }, []);

  function handleSend() {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      sender: "user",
      text: input,
      timestamp: Date.now(),
    };
    setChat((prev) => [...prev, userMsg]);
    setInput("");
    // Simulate Max's response
    setTimeout(() => {
      const maxMsg: ChatMessage = {
        sender: "max",
        text: `Max says: ${userMsg.text}`,
        timestamp: Date.now(),
      };
      setChat((prev) => [...prev, maxMsg]);
      if (ttsMode === "premium" && ttsApiKey) {
        handleTTS(maxMsg.text);
      }
    }, 800);
  }

  async function handleTTS(text: string) {
    // Placeholder: fetch audio from TTS API
    const audioUrl = await fetchTTSAudio(text, ttsApiKey);
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  }

  function handleAvatarSelect(url: string) {
    setAvatar(url);
    setStoredAvatar(url);
    setShowAvatarPicker(false);
  }

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setAvatar(ev.target.result as string);
        setStoredAvatar(ev.target.result as string);
        setShowAvatarPicker(false);
      }
    };
    reader.readAsDataURL(file);
  }

  function downloadChat(format: "txt" | "json") {
    let data = "";
    let filename = "chat-history." + format;
    if (format === "json") {
      data = JSON.stringify(chat, null, 2);
    } else {
      data = chat.map((m) => `[${new Date(m.timestamp).toLocaleString()}] ${m.sender}: ${m.text}`).join("\n");
    }
    const blob = new Blob([data], { type: format === "json" ? "application/json" : "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card className="max-w-xl mx-auto mt-8 p-4 shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <img
            src={avatar || defaultAvatars[0]}
            alt="User Avatar"
            className="w-12 h-12 rounded-full border"
            onClick={() => setShowAvatarPicker((v) => !v)}
            style={{ cursor: "pointer" }}
          />
          {showAvatarPicker && (
            <div className="absolute z-10 bg-white border rounded p-2 mt-2 left-0">
              <div className="flex gap-2 mb-2">
                {defaultAvatars.map((url) => (
                  <img
                    key={url}
                    src={url}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border cursor-pointer hover:ring"
                    onClick={() => handleAvatarSelect(url)}
                  />
                ))}
              </div>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} />
              <Button variant="outline" className="mt-2 w-full" onClick={() => setShowAvatarPicker(false)}>
                Close
              </Button>
            </div>
          )}
        </div>
        <div>
          <div className="font-bold">You</div>
          <div className="text-xs text-gray-500">Click avatar to change</div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={() => downloadChat("txt")}>Download TXT</Button>
          <Button variant="outline" onClick={() => downloadChat("json")}>Download JSON</Button>
        </div>
      </div>
      <div className="h-64 overflow-y-auto bg-gray-50 rounded p-2 mb-4 border">
        {chat.length === 0 && <div className="text-gray-400 text-center mt-16">No messages yet.</div>}
        {chat.map((msg, i) => (
          <div key={i} className={`flex mb-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`rounded px-3 py-2 ${msg.sender === "user" ? "bg-blue-100" : "bg-green-100"}`}>
              <span className="block text-xs text-gray-500 mb-1">{msg.sender === "user" ? "You" : "Max"}</span>
              <span>{msg.text}</span>
            </div>
          </div>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <Button type="submit">Send</Button>
      </form>
      <div className="mt-4 flex items-center gap-4">
        <label className="font-medium">TTS Mode:</label>
        <select
          className="border rounded px-2 py-1"
          value={ttsMode}
          onChange={(e) => setTTSMode(e.target.value as any)}
        >
          <option value="none">None</option>
          <option value="basic">Basic (browser)</option>
          <option value="premium">Premium (API)</option>
        </select>
        {ttsMode === "premium" && (
          <input
            className="border rounded px-2 py-1 ml-2"
            type="password"
            placeholder="TTS API Key"
            value={ttsApiKey}
            onChange={(e) => setTTSApiKey(e.target.value)}
            style={{ width: 180 }}
          />
        )}
      </div>
      <audio ref={audioRef} hidden />
      <div className="mt-6 p-3 bg-yellow-50 border rounded text-sm">
        <b>Help & Instructions:</b>
        <ul className="list-disc ml-5 mt-2">
          <li>Click your avatar to select or upload a new one. Your choice is saved in your browser.</li>
          <li>Send messages to Max and receive responses. Download your chat as TXT or JSON.</li>
          <li>Enable "Premium TTS" and enter your API key to use advanced text-to-speech (integration placeholder).</li>
          <li>For deployment, set your TTS API key as an environment variable or secret.</li>
        </ul>
      </div>
    </Card>
  );
}
