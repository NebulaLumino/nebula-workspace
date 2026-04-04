"use client";

import { useState, useCallback } from "react";

const WORD_LIST = [
  "apricot", "bridge", "cinnamon", "dolphin", "ember", "falcon", "glacier", "harbor",
  "ivory", "jasper", "kindle", "lantern", "marble", "nebula", "oak", "panda", "quartz",
  "river", "sunset", "thunder", "umbrella", "velvet", "willow", "xenon", "yellow",
  "zephyr", "anchor", "blossom", "coral", "dusk", "eclipse", "fern", "golden", "horizon",
  "indigo", "jungle", "karma", "lotus", "meadow", "nova", "olive", "pearl", "quest",
  "raven", "storm", "tiger", "urban", "violet", "winter", "xylem", "yarrow", "zenith",
  "aurora", "breeze", "cedar", "drift", "echo", "flame", "grove", "haven", "island"
];

function random(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePassword(length: number, options: Record<string, boolean>) {
  let chars = "";
  if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
  if (options.numbers) chars += "0123456789";
  if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  if (!chars) return "";

  const charsArr = chars.split("");
  return Array.from({ length }, () => random(charsArr)).join("");
}

function generatePassphrase(wordCount: number, includeNumber: boolean, includeSymbol: boolean) {
  const words = Array.from({ length: wordCount }, () => random(WORD_LIST));
  let phrase = words.join("-");
  if (includeNumber) {
    const pos = Math.floor(Math.random() * phrase.length);
    phrase = phrase.slice(0, pos) + Math.floor(Math.random() * 10) + phrase.slice(pos + 1);
  }
  if (includeSymbol) {
    const symbols = ["!", "@", "#", "$", "%", "&"];
    phrase += random(symbols);
  }
  return phrase;
}

function checkStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { score, label: "Weak", color: "#ef4444" };
  if (score <= 4) return { score, label: "Fair", color: "#f59e0b" };
  if (score <= 5) return { score, label: "Good", color: "#22c55e" };
  return { score, label: "Strong", color: "#15803d" };
}

export default function Home() {
  const [mode, setMode] = useState<"random" | "passphrase">("random");
  const [length, setLength] = useState(16);
  const [wordCount, setWordCount] = useState(4);
  const [opts, setOpts] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [includeNumber, setIncludeNumber] = useState(true);
  const [includeSymbol, setIncludeSymbol] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = useCallback(() => {
    const results: string[] = [];
    for (let i = 0; i < 6; i++) {
      if (mode === "random") {
        results.push(generatePassword(length, opts));
      } else {
        results.push(generatePassphrase(wordCount, includeNumber, includeSymbol));
      }
    }
    setPasswords(results);
  }, [mode, length, opts, wordCount, includeNumber, includeSymbol]);

  const copy = (pw: string, idx: number) => {
    navigator.clipboard.writeText(pw);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-900/80 backdrop-blur">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🔐</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Password Generator</h1>
            <p className="text-xs text-slate-400">Secure passwords & memorable passphrases</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Mode Toggle */}
        <div className="flex bg-white/10 rounded-xl p-1 gap-1">
          {([["random", "🔑 Random Password"], ["passphrase", "📝 Passphrase"]] as const).map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setPasswords([]); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === m ? "bg-white text-slate-900 shadow" : "text-slate-400 hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Options */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="font-semibold text-white text-sm uppercase tracking-wide">Options</h3>

          {mode === "random" ? (
            <>
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Length</span><span className="text-white font-bold text-base">{length}</span>
                </div>
                <input type="range" min={6} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full accent-emerald-400" />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>6</span><span>64</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(["uppercase", "lowercase", "numbers", "symbols"] as const).map((key) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={opts[key]} onChange={(e) => setOpts((p) => ({ ...p, [key]: e.target.checked }))}
                      className="w-4 h-4 accent-emerald-400" />
                    <span className="text-xs text-slate-300 group-hover:text-white capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Words</span><span className="text-white font-bold text-base">{wordCount}</span>
                </div>
                <input type="range" min={3} max={8} value={wordCount} onChange={(e) => setWordCount(Number(e.target.value))}
                  className="w-full accent-emerald-400" />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={includeNumber} onChange={(e) => setIncludeNumber(e.target.checked)}
                    className="w-4 h-4 accent-emerald-400" />
                  <span className="text-xs text-slate-300">Include number</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={includeSymbol} onChange={(e) => setIncludeSymbol(e.target.checked)}
                    className="w-4 h-4 accent-emerald-400" />
                  <span className="text-xs text-slate-300">Include symbol</span>
                </label>
              </div>
            </div>
          )}

          <button onClick={generate}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            <span>🔄</span> Generate 6 Options
          </button>
        </div>

        {/* Results */}
        {passwords.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Your Passwords</h3>
            {passwords.map((pw, idx) => {
              const { label, color } = checkStrength(pw);
              return (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4 group">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-mono text-sm break-all leading-relaxed">{pw}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5,6].map((s) => (
                          <div key={s} className="h-1 w-4 rounded-full transition-all"
                            style={{ background: s <= checkStrength(pw).score ? color : "#334155" }} />
                        ))}
                      </div>
                      <span className="text-xs" style={{ color }}>{label}</span>
                      <span className="text-xs text-slate-500">· {pw.length} chars</span>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => copy(pw, idx)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all">
                      {copiedIdx === idx ? "✅ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tips */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">🛡️ Password Best Practices</h3>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>✅ Use <span className="text-emerald-400 font-mono">16+ characters</span> for important accounts</li>
            <li>✅ Use a <span className="text-emerald-400 font-mono">unique password</span> for every service</li>
            <li>✅ Store passwords in a <span className="text-emerald-400 font-mono">password manager</span> (Bitwarden, 1Password)</li>
            <li>✅ Passphrases like <span className="text-emerald-400 font-mono">river-falcon-lotus-7!</span> are both memorable and strong</li>
            <li>🚫 Never reuse passwords across important accounts</li>
            <li>🚫 Avoid personal info (birthdays, pet names) in passwords</li>
          </ul>
        </div>

        <p className="text-center text-xs text-slate-600 pb-4">AI Password Generator · All generation happens locally in your browser</p>
      </div>
    </main>
  );
}
