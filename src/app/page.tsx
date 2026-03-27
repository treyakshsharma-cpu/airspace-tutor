"use client";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("../components/InteractiveMap"), { ssr: false });
const AITutor = dynamic(() => import("../components/AITutor"), { ssr: false });

const QUESTION_CATEGORIES = {
  Airspace: [
    {
      question: "Which class of airspace typically surrounds major airports and requires ATC clearance to enter?",
      options: ["Class A", "Class B", "Class C", "Class D"],
      answer: 1,
    },
    {
      question: "Which airspace class is generally found at smaller regional airports?",
      options: ["Class B", "Class C", "Class D", "Class E"],
      answer: 2,
    },
    {
      question: "What is required before flying a drone in controlled airspace?",
      options: ["ATC Authorization", "Nothing", "Insurance", "Night Waiver"],
      answer: 0,
    },
  ],
  Regulations: [
    {
      question: "Which document must you always have when flying a drone commercially in the US?",
      options: ["Part 107 Certificate", "Driver's License", "Passport", "Aircraft Registration"],
      answer: 0,
    },
    {
      question: "What is the maximum legal altitude for drone flight in uncontrolled airspace in the US?",
      options: ["200 feet", "400 feet", "600 feet", "1000 feet"],
      answer: 1,
    },
  ],
  Weather: [
    {
      question: "What is the minimum visibility required for drone operations in Class G airspace?",
      options: ["1 mile", "3 miles", "5 miles", "10 miles"],
      answer: 1,
    },
    {
      question: "What weather condition is most dangerous for drone flight?",
      options: ["Clear skies", "Light wind", "Thunderstorms", "Overcast"],
      answer: 2,
    },
  ],
};

const CATEGORY_LIST = Object.keys(QUESTION_CATEGORIES);

function getRandomQuestion(category) {
  const questions = QUESTION_CATEGORIES[category];
  return questions[Math.floor(Math.random() * questions.length)];
}


export default function Home() {
  const { data: session } = useSession();
  const [category, setCategory] = useState(CATEGORY_LIST[0]);
  const [quiz, setQuiz] = useState(getRandomQuestion(CATEGORY_LIST[0]));
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(() => Number(localStorage.getItem('score') || 0));
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('streak') || 0));
  const [timer, setTimer] = useState(20);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history') || '[]'));
  const [intervalId, setIntervalId] = useState(null);

  // Timer effect
  React.useEffect(() => {
    if (feedback) return;
    if (timer === 0) {
      setFeedback(`⏰ Time's up! The correct answer is ${quiz.options[quiz.answer]}.`);
      setStreak(0);
      localStorage.setItem('streak', '0');
      return;
    }
    const id = setTimeout(() => setTimer(timer - 1), 1000);
    setIntervalId(id);
    return () => clearTimeout(id);
  }, [timer, feedback]);

  // Save progress
  React.useEffect(() => {
    localStorage.setItem('score', String(score));
    localStorage.setItem('streak', String(streak));
    localStorage.setItem('history', JSON.stringify(history));
  }, [score, streak, history]);

  // Change category handler
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setQuiz(getRandomQuestion(cat));
    setSelected(null);
    setFeedback(null);
    setTimer(20);
  };

  // Leaderboard logic
  const leaderboard = React.useMemo(() => {
    const hist = Array.isArray(history) ? history : [];
    return hist
      .filter(h => h.score !== undefined)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [history]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] flex flex-col items-center justify-center px-4 py-10 font-sans">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {/* Futuristic glassmorphism/neon background elements */}
        <div className="absolute left-1/2 top-1/4 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-green-400/30 via-blue-500/20 to-purple-600/20 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute right-10 bottom-10 w-72 h-72 bg-gradient-to-br from-pink-500/30 to-yellow-400/20 rounded-full blur-2xl opacity-50 animate-pulse-slow" />
      </div>
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center space-y-10">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className="max-w-2xl">

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Airspace Tutor
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Duolingo for drone airspace compliance and flight planning.
            </p>
          </div>

          <div className="mt-10 w-full max-w-lg flex flex-col items-center space-y-6">
  <button
    className="w-full rounded-lg bg-green-600 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-green-700 transition"
    onClick={() => {
      const quiz = document.getElementById('quiz-section');
      if (quiz) quiz.scrollIntoView({ behavior: 'smooth' });
    }}
  >
    Start Quiz
  </button>
  {session ? (
    <button
      className="w-full rounded-lg border border-zinc-400 px-6 py-3 text-lg font-semibold text-zinc-200 hover:bg-zinc-800 transition"
      onClick={() => signOut()}
    >
      Logout ({session.user?.name || session.user?.email})
    </button>
  ) : (
    <button
      className="w-full rounded-lg border border-zinc-400 px-6 py-3 text-lg font-semibold text-zinc-200 hover:bg-zinc-800 transition"
      onClick={() => signIn("google")}
    >
      Login with Google
    </button>
  )}
  <button
    className="w-full rounded-lg border border-blue-400 px-6 py-3 text-lg font-semibold text-blue-200 hover:bg-blue-900 transition"
    onClick={() => setShowLeaderboard(!showLeaderboard)}
  >
    {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
  </button>
</div>

{/* Dashboard Section */}
{session && (
  <div className="mt-10 w-full max-w-xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl ring-1 ring-white/20 p-6 border border-white/10 text-white">
    <h2 className="text-xl font-bold mb-2">Dashboard</h2>
    <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0">
      <div>Score: <span className="font-bold text-green-300">{score}</span></div>
      <div>Streak: <span className="font-bold text-blue-300">{streak}</span></div>
      <div>Quizzes Taken: <span className="font-bold text-yellow-300">{history.length}</span></div>
    </div>
    <div className="mt-4">Welcome, <span className="font-semibold">{session.user?.name || session.user?.email}</span>!</div>
    <div className="mt-2 text-sm text-zinc-300">(More personalized stats and recommendations coming soon!)</div>
  </div>
)}

{/* Leaderboard Section */}
{showLeaderboard && (
  <div className="mt-10 w-full max-w-xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl ring-1 ring-white/20 p-6 border border-white/10 text-white">
    <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
    <ol className="list-decimal ml-6">
      {leaderboard.length === 0 && <li>No scores yet.</li>}
      {leaderboard.map((entry, idx) => (
        <li key={idx} className="mb-1">{entry.name || 'Anonymous'} — <span className="font-bold text-green-300">{entry.score}</span></li>
      ))}
    </ol>
  </div>
)}

{/* Interactive Quiz Section */}
<div id="quiz-section" className="mt-16 w-full max-w-xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-white/20 p-8 border border-white/10">
  <h2 className="text-2xl font-bold text-white mb-4 tracking-wide drop-shadow-lg">Quick Airspace Quiz</h2>
  {/* Category Selector */}
  <div className="mb-6 flex flex-wrap gap-2 justify-center">
    {CATEGORY_LIST.map(cat => (
      <button
        key={cat}
        className={`px-4 py-2 rounded-lg border ${category === cat ? 'bg-blue-600 text-white border-blue-400' : 'bg-zinc-800 text-zinc-200 border-zinc-600'} transition`}
        onClick={() => handleCategoryChange(cat)}
      >
        {cat}
      </button>
    ))}
  </div>
  <div className="flex items-center justify-between mb-2">
    <span className="text-zinc-300 text-sm">Time left: <span className="font-bold text-yellow-300">{timer}s</span></span>
    <span className="text-zinc-300 text-sm">Streak: <span className="font-bold text-blue-300">{streak}</span></span>
    <span className="text-zinc-300 text-sm">Score: <span className="font-bold text-green-300">{score}</span></span>
  </div>
  <p className="text-zinc-200 mb-6 text-lg font-medium">{quiz.question}</p>
  <form
    onSubmit={e => {
      e.preventDefault();
      if (selected === null || feedback) return;
      clearTimeout(intervalId);
      let correct = false;
      if (selected === quiz.answer) {
        setFeedback("✅ Correct!");
        setScore(s => s + 1);
        setStreak(s => s + 1);
        setHistory(h => [...h, { category, question: quiz.question, correct: true, score: score + 1, date: new Date().toISOString(), name: session?.user?.name || session?.user?.email || 'Anonymous' }]);
        correct = true;
      } else {
        setFeedback(`❌ Incorrect. The correct answer is ${quiz.options[quiz.answer]}.`);
        setStreak(0);
        setHistory(h => [...h, { category, question: quiz.question, correct: false, score, date: new Date().toISOString(), name: session?.user?.name || session?.user?.email || 'Anonymous' }]);
      }
      localStorage.setItem('score', String(correct ? score + 1 : score));
      localStorage.setItem('streak', String(correct ? streak + 1 : 0));
      localStorage.setItem('history', JSON.stringify([...history, { category, question: quiz.question, correct, score: correct ? score + 1 : score, date: new Date().toISOString(), name: session?.user?.name || session?.user?.email || 'Anonymous' }]));
    }}
  >
    <div className="flex flex-col space-y-3 mb-6">
      {quiz.options.map((opt, idx) => (
        <label key={opt} className={`flex items-center space-x-2 text-zinc-100 transition ${selected === idx ? 'font-bold text-green-300 scale-105' : ''}`}>
          <input
            type="radio"
            name="quiz"
            value={idx}
            checked={selected === idx}
            onChange={() => setSelected(idx)}
            className="accent-green-400 scale-125"
            required
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
    <button
      type="submit"
      className="w-full rounded-lg bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:from-green-500 hover:to-purple-600 transition-all duration-200"
      disabled={selected === null || feedback}
    >
      Submit Answer
    </button>
    {feedback && (
      <div className="mt-6 text-xl font-semibold text-white drop-shadow-lg animate-pulse">
        {feedback}
        <button
          type="button"
          className="ml-4 px-4 py-1 rounded bg-white/20 hover:bg-white/30 text-green-200 border border-white/10 transition"
          onClick={() => {
            setQuiz(getRandomQuestion(category));
            setSelected(null);
            setFeedback(null);
            setTimer(20);
          }}
        >
          New Question
        </button>
      </div>
    )}
  </form>
</div>

{/* Placeholders for future features */}
<div className="mt-16 w-full max-w-3xl mx-auto flex flex-wrap gap-6 justify-center">
  <div className="w-full md:w-[48%] mb-6">
    <InteractiveMap />
  </div>
  <div className="w-full md:w-[48%] mb-6">
    <AITutor />
  </div>
  <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/10 text-white w-72 text-center">
    <h3 className="font-bold mb-2">Scenario Simulations</h3>
    <p className="text-zinc-300 text-sm">(Coming soon: Real-world flight planning challenges!)</p>
  </div>
  <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/10 text-white w-72 text-center">
    <h3 className="font-bold mb-2">Glossary/Reference</h3>
    <p className="text-zinc-300 text-sm">(Coming soon: Aviation terms and regulations!)</p>
  </div>
  <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/10 text-white w-72 text-center">
    <h3 className="font-bold mb-2">Forum & Social</h3>
    <p className="text-zinc-300 text-sm">(Coming soon: Discuss and share with the community!)</p>
  </div>
</div>

        </div>
      </div>
    </div>
  </div>
  );
}
