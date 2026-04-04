"use client";

import { useState } from "react";

const TOPICS = [
  "General Knowledge",
  "Science & Nature",
  "History",
  "Geography",
  "Pop Culture",
  "Sports",
  "Technology",
  "Movies & TV",
  "Music",
  "Food & Drink",
];

const DIFFICULTIES = [
  { value: "easy", label: "😊 Easy", desc: "Fun for all ages" },
  { value: "medium", label: "🤔 Medium", desc: "Average trivia fans" },
  { value: "hard", label: "🧠 Hard", desc: "True trivia nerds" },
];

interface Question {
  q: string;
  options: string[];
  answer: string;
}

export default function Home() {
  const [topic, setTopic] = useState("General Knowledge");
  const [customTopic, setCustomTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState(false);
  const [started, setStarted] = useState(false);

  const generate = async () => {
    const effectiveTopic = customTopic.trim() || topic;
    if (!effectiveTopic) {
      setError("Please select or enter a topic.");
      return;
    }

    setLoading(true);
    setError(null);
    setQuestions([]);
    setSelected({});
    setRevealed(false);
    setStarted(false);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: effectiveTopic, difficulty, count }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      const parsed: Question[] = [];
      const lines = data.quiz.split("\n");

      let currentQ = "";
      let currentOptions: string[] = [];
      let currentAnswer = "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("Q") && trimmed.includes(":")) {
          if (currentQ) {
            parsed.push({ q: currentQ, options: currentOptions, answer: currentAnswer });
          }
          currentQ = trimmed.replace(/^Q\d+:\s*/, "");
          currentOptions = [];
          currentAnswer = "";
        } else if (/^[A-D]\)/.test(trimmed)) {
          currentOptions.push(trimmed);
        } else if (trimmed.startsWith("ANSWER:")) {
          currentAnswer = trimmed.replace("ANSWER:", "").trim();
        }
      }
      if (currentQ) {
        parsed.push({ q: currentQ, options: currentOptions, answer: currentAnswer });
      }

      setQuestions(parsed);
      setStarted(true);
    } catch {
      setError("Failed to connect to the quiz service.");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (i: number, option: string) => {
    if (revealed) return;
    setSelected((prev) => ({ ...prev, [i]: option }));
  };

  const revealAll = () => setRevealed(true);

  const score = questions.reduce((acc, q, i) => {
    const chosen = selected[i]?.[0];
    return acc + (chosen === q.answer ? 1 : 0);
  }, 0);

  const getOptionClass = (q: Question, i: number, option: string) => {
    const letter = option[0];
    const isSelected = selected[i]?.[0] === letter;
    const isCorrect = letter === q.answer;
    if (revealed) {
      if (isCorrect) return "border-green-500 bg-green-50 text-green-800";
      if (isSelected && !isCorrect) return "border-red-400 bg-red-50 text-red-700";
      return "border-gray-200 bg-gray-50 text-gray-400";
    }
    return isSelected
      ? "border-blue-400 bg-blue-50 ring-1 ring-blue-400"
      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🧠</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Trivia Quiz Generator</h1>
            <p className="text-xs text-gray-400">Test your knowledge · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-gray-900">How much do you actually know? 🧠</h2>
          <p className="text-gray-500 text-sm">Generate an AI-powered trivia quiz on any topic.</p>
        </div>

        {!started ? (
          <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 space-y-5">
            {/* Topic */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📚 Topic</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTopic(t); setCustomTopic(""); }}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      topic === t && !customTopic.trim()
                        ? "bg-indigo-500 border-indigo-500 text-white"
                        : "border-gray-200 text-gray-600 hover:border-indigo-300 bg-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="...or enter a custom topic"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">⚡ Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value)}
                    className={`rounded-xl border px-3 py-2.5 text-center transition-all ${
                      difficulty === d.value
                        ? "border-indigo-400 bg-indigo-50 ring-1 ring-indigo-400"
                        : "border-gray-200 hover:border-indigo-300 bg-gray-50"
                    }`}
                  >
                    <div className={`text-xs font-bold ${difficulty === d.value ? "text-indigo-700" : "text-gray-700"}`}>{d.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">📊 Questions ({count})</label>
              <input
                type="range"
                min={5}
                max={20}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⚙️</span>
                  Generating quiz...
                </>
              ) : (
                <>🧠 Start Quiz</>
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
            )}
          </div>
        ) : (
          <>
            {/* Score bar */}
            {revealed && (
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-5 text-center">
                <p className="text-sm text-gray-500 mb-1">Your Score</p>
                <p className="text-4xl font-extrabold text-indigo-600">
                  {score} / {questions.length}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {score === questions.length ? "🏆 Perfect score!" : score >= questions.length * 0.7 ? "✅ Great job!" : "📚 Keep learning!"}
                </p>
              </div>
            )}

            {/* Questions */}
            <div className="space-y-4">
              {questions.map((q, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
                  <div className="bg-indigo-50 px-5 py-3 border-b border-indigo-100">
                    <p className="text-sm font-bold text-indigo-800">
                      Question {i + 1}
                    </p>
                    <p className="text-sm text-gray-800 mt-1">{q.q}</p>
                  </div>
                  <div className="p-4 space-y-2">
                    {q.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => selectAnswer(i, option)}
                        className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all ${getOptionClass(q, i, option)}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={revealAll}
                disabled={revealed}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-40"
              >
                {revealed ? `✅ Score: ${score}/${questions.length}` : "📊 Reveal Answers"}
              </button>
              <button
                onClick={() => { setStarted(false); setQuestions([]); }}
                className="px-5 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
              >
                🔄 New Quiz
              </button>
            </div>
          </>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          AI Trivia Quiz Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
