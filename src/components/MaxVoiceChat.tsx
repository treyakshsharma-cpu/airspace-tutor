import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Placeholder for speech-to-text and text-to-speech logic
// You can replace with more advanced libraries/services for better voices

const DEFAULT_AVATARS = {
  user: 'https://api.dicebear.com/7.x/personas/svg?seed=user',
  max: 'https://api.dicebear.com/7.x/bottts/svg?seed=max',
};

const MaxVoiceChat: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'max'; text: string }[]>([]);
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [ttsEngine, setTtsEngine] = useState<'browser' | 'premium'>('browser');
  const [userAvatar, setUserAvatar] = useState<string>(DEFAULT_AVATARS.user);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Session management
  useEffect(() => {
    let sid = localStorage.getItem('max_session_id');
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem('max_session_id', sid);
    }
    setSessionId(sid);
    // Load user avatar from localStorage
    const storedAvatar = localStorage.getItem('max_user_avatar');
    if (storedAvatar) setUserAvatar(storedAvatar);
  }, []);

  const resetSession = () => {
    const sid = uuidv4();
    localStorage.setItem('max_session_id', sid);
    setSessionId(sid);
    setMessages([]);
  };

  // Avatar upload/selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setUserAvatar(url);
        localStorage.setItem('max_user_avatar', url);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  // Basic browser speech recognition
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  // Premium TTS integration (ElevenLabs/Google TTS)
  const premiumSpeak = async (text: string) => {
    // Example for ElevenLabs API (replace with your API key and voice ID):
    // const apiKey = 'YOUR_ELEVENLABS_API_KEY';
    // const voiceId = 'YOUR_ELEVENLABS_VOICE_ID';
    // const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    //   method: 'POST',
    //   headers: {
    //     'xi-api-key': apiKey,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ text }),
    // });
    // const audioBlob = await response.blob();
    // const audioUrl = URL.createObjectURL(audioBlob);
    // const audio = new Audio(audioUrl);
    // audio.play();
    // For now, fallback to browser TTS
    browserSpeak(text);
  };

  const browserSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = speechSynthesis.getVoices().find(v => v.name.toLowerCase().includes('english')) || null;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speak = (text: string) => {
    if (ttsEngine === 'premium') {
      premiumSpeak(text);
    } else {
      browserSpeak(text);
    }
  };

  // Streaming support
  const sendMessage = async (msg: string) => {
    setMessages(prev => [...prev, { sender: 'user', text: msg }]);
    setInput('');
    setIsStreaming(true);
    let maxMsg = '';
    let webResults: any[] = [];
    // Streaming fetch
    const res = await fetch('/api/max-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, history: messages, sessionId }),
    });
    if (res.body && window.ReadableStream) {
      const reader = res.body.getReader();
      let decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          try {
            const parsed = JSON.parse(chunk);
            if (parsed.reply !== undefined) {
              maxMsg += parsed.reply;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last && last.sender === 'max') {
                  return [...prev.slice(0, -1), { sender: 'max', text: maxMsg }];
                } else {
                  return [...prev, { sender: 'max', text: maxMsg }];
                }
              });
            }
            if (parsed.webResults) {
              webResults = parsed.webResults;
            }
          } catch {
            // Not a full JSON chunk yet
          }
        }
      }
      speak(maxMsg);
      if (webResults && webResults.length > 0) {
        setMessages(prev => [
          ...prev,
          { sender: 'max', text: `Sources: ` + webResults.map((r: any) => `[${r.title}](${r.link})`).join(', ') }
        ]);
      }
    } else {
      // Fallback for non-streaming
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'max', text: data.reply }]);
      speak(data.reply);
      if (data.webResults && data.webResults.length > 0) {
        setMessages(prev => [
          ...prev,
          { sender: 'max', text: `Sources: ` + data.webResults.map((r: any) => `[${r.title}](${r.link})`).join(', ') }
        ]);
      }
    }
    setIsStreaming(false);
  };

  // Stop speech synthesis
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-2">Talk to Max (AI Voice Assistant)</h2>
      <div className="flex items-center gap-4 mb-2">
        <img src={userAvatar} alt="User avatar" className="w-10 h-10 rounded-full border" />
        <button onClick={triggerAvatarUpload} className="px-2 py-1 bg-gray-200 rounded text-xs">Change Avatar</button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleAvatarChange}
        />
        <button
          onClick={() => downloadChat('txt')}
          className="px-2 py-1 bg-gray-200 rounded text-xs ml-2"
        >
          Download Chat
        </button>
      </div>
      <div className="h-64 overflow-y-auto bg-gray-50 p-2 mb-2 rounded">
        {messages.map((m, i) => (
          <div key={i} className={"flex items-start gap-2 mb-1 " + (m.sender === 'user' ? 'justify-end' : 'justify-start')}>
            {m.sender === 'max' && (
              <img src={DEFAULT_AVATARS.max} alt="Max avatar" className="w-8 h-8 rounded-full border" />
            )}
            <div className={"inline-block px-3 py-2 rounded-lg " + (m.sender === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-green-100 text-green-900')}
                 style={{maxWidth: '70%'}}>
              <span className="block text-xs font-semibold mb-1">{m.sender === 'user' ? 'You' : 'Max'}</span>
              <span dangerouslySetInnerHTML={{ __html: m.text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href=\"$2\" target=\"_blank\" rel=\"noopener noreferrer\">$1</a>') }} />
            </div>
            {m.sender === 'user' && (
              <img src={userAvatar} alt="User avatar" className="w-8 h-8 rounded-full border" />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-2">
        <button onClick={listening ? stopListening : startListening} className="px-4 py-2 bg-blue-500 text-white rounded">
          {listening ? 'Stop' : 'Speak'}
        </button>
        <input
          className="flex-1 border rounded px-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type or speak your message..."
          onKeyDown={e => { if (e.key === 'Enter' && input.trim()) sendMessage(input); }}
        />
        <button
          onClick={() => sendMessage(input)}
          className="px-4 py-2 bg-green-500 text-white rounded"
          disabled={!input.trim() || isStreaming}
        >
          {isStreaming ? '...' : 'Send'}
        </button>
        <button
          onClick={stopSpeaking}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Stop Voice
        </button>
        <button
          onClick={resetSession}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Reset
        </button>
        <select value={ttsEngine} onChange={e => setTtsEngine(e.target.value as any)} className="px-2 py-1 rounded border">
          <option value="browser">Browser TTS</option>
          <option value="premium">Premium TTS</option>
        </select>
      </div>
      <div className="text-xs text-gray-400 mb-2">Powered by OpenAI GPT-4 + Web Search (SerpAPI). For best voice, integrate ElevenLabs/Google TTS in production.</div>
      <div className="text-xs text-gray-500 border-t pt-2 mt-2">
        <b>Deployment & API Keys:</b><br />
        1. Add your OpenAI and SerpAPI keys to <code>.env.local</code>.<br />
        2. For ElevenLabs/Google TTS, add your API key in the code where marked.<br />
        3. Deploy to Vercel/Netlify or your preferred platform.<br />
        <b>Features:</b> Download chat, custom avatars, advanced TTS, session management, streaming, citations.
      </div>
    </div>
  );

  // Download chat as txt or json
  function downloadChat(type: 'txt' | 'json') {
    let content = '';
    let filename = 'max-chat.' + type;
    if (type === 'txt') {
      content = messages.map(m => `${m.sender === 'user' ? 'You' : 'Max'}: ${m.text.replace(/<[^>]+>/g, '')}`).join('\n');
    } else {
      content = JSON.stringify(messages, null, 2);
    }
    const blob = new Blob([content], { type: type === 'txt' ? 'text/plain' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
};

export default MaxVoiceChat;
