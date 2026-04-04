#!/bin/bash
set -e

WORKSPACE="/Users/nebulalumino/.openclaw/workspace"
APPS=(
  "2171:ai-sports-performance:violet:AI Sports Performance Optimizer"
  "2172:ai-injury-recovery:red:AI Injury Recovery Planner"
  "2173:ai-sports-nutrition:green:AI Sports Nutrition Planner"
  "2174:ai-game-film:amber:AI Game Film Analyzer"
  "2175:ai-esports-coaching:cyan:AI Esports Coaching Assistant"
  "2176:ai-sports-broadcast:rose:AI Sports Broadcast Writer"
  "2177:ai-sports-betting:orange:AI Sports Betting Odds Analyzer"
  "2178:ai-youth-sports:lime:AI Youth Sports Coach"
  "2179:ai-sports-merch:blue:AI Sports Merchandise Designer"
  "2180:ai-ref-review:teal:AI Referee Review System"
  "2181:ai-roster-builder:violet:AI Roster Builder"
  "2182:ai-fantasy-sports:pink:AI Fantasy Sports Advisor"
  "2183:ai-sports-marketing:emerald:AI Sports Marketing Generator"
  "2184:ai-coaching-philosophy:yellow:AI Coaching Philosophy Designer"
  "2185:ai-sports-travel:slate:AI Sports Travel Planner"
  "2186:ai-golf-strategy:indigo:AI Golf Strategy Analyzer"
  "2187:ai-water-sports:sky:AI Water Sports Guide"
  "2188:ai-sports-podcast:zinc:AI Sports Podcast Producer"
  "2189:ai-league-admin:neutral:AI League Admin Manager"
  "2190:ai-sports-camp:fuchsia:AI Sports Camp Creator"
)

# Set git config
git config --global user.email "agent@openclaw.ai"
git config --global user.name "Nova"

for app_entry in "${APPS[@]}"; do
  IFS=':' read -r task_id app_dir accent app_name <<< "$app_entry"
  echo "========================================"
  echo "Building $task_id: $app_dir ($accent)"
  echo "========================================"
  
  app_path="$WORKSPACE/$app_dir"
  
  # Step 1: Create Next.js app if not exists
  if [ ! -d "$app_path" ]; then
    echo "[1/6] Creating Next.js app: $app_dir"
    cd "$WORKSPACE"
    npx create-next-app@latest "$app_dir" --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git --yes 2>&1 | tail -5
  else
    echo "[1/6] App $app_dir already exists, skipping creation"
  fi
  
  echo "[2/6] Implementing $app_dir"
  
  # Step 2: Write the API route
  cat > "$app_path/src/app/api/generate/route.ts" << 'ROUTE_EOF'
"use server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const openai = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert assistant. Provide detailed, well-structured, practical output." },
        { role: "user", content: JSON.stringify(body) },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });
    return NextResponse.json({ output: completion.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
ROUTE_EOF
  
  # Step 3: Write the main page - SPECIFIC per app
  case $task_id in
    2171)
      cat > "$app_path/src/app/page.tsx" << 'PAGE_EOF'
"use client";
import { useState } from "react";
function Page() {
  const [sport, setSport] = useState("Basketball");
  const [position, setPosition] = useState("Guard");
  const [goal, setGoal] = useState("Explosiveness");
  const [trainingAge, setTrainingAge] = useState("3-5 years");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const accent = "violet";
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleGenerate = async () => {
    setLoading(true); setError(""); setOutput("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sport, position, goal, trainingAge, daysPerWeek }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOutput(data.output);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className={"text-4xl font-bold mb-3 bg-gradient-to-r from-"+accent+"-400 to-"+accent+"-600 bg-clip-text text-transparent"}>AI Sports Performance Optimizer</h1>
        <p className="text-gray-400 text-sm">Generate personalized athletic training programs and performance optimization plans</p>
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Training Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Sport</label><select value={sport} onChange={e=>setSport(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-violet-500"><option>Basketball</option><option>Football</option><option>Soccer</option><option>Baseball</option><option>Tennis</option><option>Swimming</option><option>Track & Field</option><option>Volleyball</option><option>Hockey</option><option>CrossFit</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Position / Event</label><input value={position} onChange={e=>setPosition(e.target.value)} placeholder="e.g. Point Guard, Sprinter" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-violet-500" /></div>
          <div><label className="block text-sm font-medium mb-1">Primary Goal</label><select value={goal} onChange={e=>setGoal(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-violet-500"><option>Explosiveness</option><option>Endurance</option><option>Strength</option><option>Speed</option><option>Agility</option><option>Power</option><option>Flexibility</option><option>Recovery</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Training Age / Experience</label><select value={trainingAge} onChange={e=>setTrainingAge(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-violet-500"><option>Less than 1 year</option><option>1-2 years</option><option>3-5 years</option><option>5-10 years</option><option>Professional</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Training Days Per Week</label><select value={daysPerWeek} onChange={e=>setDaysPerWeek(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-violet-500"><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option></select></div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className={"mt-5 px-8 py-3 rounded-lg font-semibold text-white transition-all " + (loading ? "bg-violet-700 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-500")}> {loading ? "Generating..." : "Generate Performance Plan"} </button>
        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      </div>
      {output && <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"><h2 className="text-lg font-semibold mb-4 text-gray-200">Your Performance Plan</h2><pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">{output}</pre></div>}
    </main>
  );
}
export default Page;
PAGE_EOF
      ;;
    2172)
      cat > "$app_path/src/app/page.tsx" << 'PAGE_EOF'
"use client";
import { useState } from "react";
function Page() {
  const [injury, setInjury] = useState("ACL Tear");
  const [stage, setStage] = useState("Early Recovery");
  const [sport, setSport] = useState("Basketball");
  const [weeksPostInjury, setWeeksPostInjury] = useState("4");
  const accent = "red";
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleGenerate = async () => {
    setLoading(true); setError(""); setOutput("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ injury, stage, sport, weeksPostInjury }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOutput(data.output);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className={"text-4xl font-bold mb-3 bg-gradient-to-r from-"+accent+"-400 to-"+accent+"-600 bg-clip-text text-transparent"}>AI Injury Recovery Planner</h1>
        <p className="text-gray-400 text-sm">Structured rehabilitation programs and recovery timelines for athletes</p>
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Recovery Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Injury Type</label><select value={injury} onChange={e=>setInjury(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500"><option>ACL Tear</option><option>MCL Sprain</option><option>Rotator Cuff</option><option>Ankle Sprain</option><option>Tennis Elbow</option><option>Hamstring Strain</option><option>Meniscus Tear</option><option>Achilles Tendon</option><option>Concussion</option><option>Fracture</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Recovery Stage</label><select value={stage} onChange={e=>setStage(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500"><option>Early Recovery</option><option>Active Rehabilitation</option><option>Strengthening Phase</option><option>Return to Sport</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Sport</label><select value={sport} onChange={e=>setSport(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500"><option>Basketball</option><option>Football</option><option>Soccer</option><option>Tennis</option><option>Swimming</option><option>Baseball</option><option>CrossFit</option><option>Running</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Weeks Since Injury</label><select value={weeksPostInjury} onChange={e=>setWeeksPostInjury(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500"><option>1</option><option>2</option><option>3</option><option>4</option><option>6</option><option>8</option><option>12</option><option>16</option></select></div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className={"mt-5 px-8 py-3 rounded-lg font-semibold text-white transition-all " + (loading ? "bg-red-700 cursor-not-allowed" : "bg-red-600 hover:bg-red-500")}> {loading ? "Generating..." : "Generate Recovery Plan"} </button>
        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      </div>
      {output && <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"><h2 className="text-lg font-semibold mb-4 text-gray-200">Your Recovery Plan</h2><pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">{output}</pre></div>}
    </main>
  );
}
export default Page;
PAGE_EOF
      ;;
    2173)
      cat > "$app_path/src/app/page.tsx" << 'PAGE_EOF'
"use client";
import { useState } from "react";
function Page() {
  const [sport, setSport] = useState("Soccer");
  const [goal, setGoal] = useState("Endurance");
  const [dietary, setDietary] = useState("No Restrictions");
  const [mealsPerDay, setMealsPerDay] = useState("3");
  const [weight, setWeight] = useState("70");
  const accent = "green";
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleGenerate = async () => {
    setLoading(true); setError(""); setOutput("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sport, goal, dietary, mealsPerDay, weight }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOutput(data.output);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className={"text-4xl font-bold mb-3 bg-gradient-to-r from-"+accent+"-400 to-"+accent+"-600 bg-clip-text text-transparent"}>AI Sports Nutrition Planner</h1>
        <p className="text-gray-400 text-sm">Customized meal plans and nutrition strategies for peak athletic performance</p>
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Nutrition Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Sport</label><select value={sport} onChange={e=>setSport(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500"><option>Soccer</option><option>Basketball</option><option>Football</option><option>Swimming</option><option>Running</option><option>Cycling</option><option>CrossFit</option><option>Tennis</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Performance Goal</label><select value={goal} onChange={e=>setGoal(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500"><option>Endurance</option><option>Strength</option><option>Power</option><option>Weight Loss</option><option>Muscle Gain</option><option>Agility</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Dietary Restrictions</label><select value={dietary} onChange={e=>setDietary(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500"><option>No Restrictions</option><option>Vegetarian</option><option>Vegan</option><option>Gluten-Free</option><option>Dairy-Free</option><option>Nut-Free</option><option>Keto</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Meals Per Day</label><select value={mealsPerDay} onChange={e=>setMealsPerDay(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500"><option>3</option><option>4</option><option>5</option><option>6</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Body Weight (kg)</label><input type="number" value={weight} onChange={e=>setWeight(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500" /></div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className={"mt-5 px-8 py-3 rounded-lg font-semibold text-white transition-all " + (loading ? "bg-green-700 cursor-not-allowed" : "bg-green-600 hover:bg-green-500")}> {loading ? "Generating..." : "Generate Nutrition Plan"} </button>
        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      </div>
      {output && <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"><h2 className="text-lg font-semibold mb-4 text-gray-200">Your Nutrition Plan</h2><pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">{output}</pre></div>}
    </main>
  );
}
export default Page;
PAGE_EOF
      ;;
    2174)
      cat > "$app_path/src/app/page.tsx" << 'PAGE_EOF'
"use client";
import { useState } from "react";
function Page() {
  const [sport, setSport] = useState("Basketball");
  const [analysisType, setAnalysisType] = useState("Offensive Plays");
  const [playerFocus, setPlayerFocus] = useState("All Players");
  const accent = "amber";
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleGenerate = async () => {
    setLoading(true); setError(""); setOutput("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sport, analysisType, playerFocus }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOutput(data.output);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className={"text-4xl font-bold mb-3 bg-gradient-to-r from-"+accent+"-400 to-"+accent+"-600 bg-clip-text text-transparent"}>AI Game Film Analyzer</h1>
        <p className="text-gray-400 text-sm">Deep analysis of game footage with tactical breakdowns and performance insights</p>
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Film Analysis Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Sport</label><select value={sport} onChange={e=>setSport(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"><option>Basketball</option><option>Football</option><option>Soccer</option><option>Baseball</option><option>Hockey</option><option>Volleyball</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Analysis Type</label><select value={analysisType} onChange={e=>setAnalysisType(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"><option>Offensive Plays</option><option>Defensive Schemes</option><option>Transition Game</option><option>Set Pieces</option><option>Player Matchups</option><option>Game Plan Review</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Player Focus</label><input value={playerFocus} onChange={e=>setPlayerFocus(e.target.value)} placeholder="e.g. Point Guard, QB, Striker" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" /></div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className={"mt-5 px-8 py-3 rounded-lg font-semibold text-white transition-all " + (loading ? "bg-amber-700 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-500")}> {loading ? "Analyzing..." : "Analyze Game Film"} </button>
        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      </div>
      {output && <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"><h2 className="text-lg font-semibold mb-4 text-gray-200">Film Analysis Report</h2><pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">{output}</pre></div>}
    </main>
  );
}
export default Page;
PAGE_EOF
      ;;
    2175)
      cat > "$app_path/src/app/page.tsx" << 'PAGE_EOF'
"use client";
import { useState } from "react";
function Page() {
  const [game, setGame] = useState("League of Legends");
  const [role, setRole] = useState("Mid Laner");
  const [rank, setRank] = useState("Diamond");
  const [focusArea, setFocusArea] = useState("Mechanics");
  const accent = "cyan";
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleGenerate = async () => {
    setLoading(true); setError(""); setOutput("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ game, role, rank, focusArea }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOutput(data.output);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className={"text-4xl font-bold mb-3 bg-gradient-to-r from-"+accent+"-400 to-"+accent+"-600 bg-clip-text text-transparent"}>AI Esports Coaching Assistant</h1>
        <p className="text-gray-400 text-sm">Personalized coaching plans and gameplay improvement strategies for esports athletes</p>
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Coaching Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Game</label><select value={game} onChange={e=>setGame(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"><option>League of Legends</option><option>Valorant</option><option>CS2</option><option>Overwatch 2</option><option>Dota 2</option><option>Rocket League</option><option>Fighting Games</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Role / Character</label><input value={role} onChange={e=>setRole(e.target.value)} placeholder="e.g. Mid Laner, Entry Fragger" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" /></div>
          <div><label className="block text-sm font-medium mb-1">Current Rank</label><select value={rank} onChange={e=>setRank(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"><option>Bronze</option><option>Silver</option><option>Gold</option><option>Platinum</option><option>Diamond</option><option>Master</option><option>Grandmaster</option><option>Professional</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Focus Area</label><select value={focusArea} onChange={e=>setFocusArea(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"><option>Mechanics</option><option>Game Sense</option><option>Strategy</option><option>Communication</option><option>Mental Game</option><option>Teamwork</option></select></div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className={"mt-5 px-8 py-3 rounded-lg font-semibold text-white transition-all " + (loading ? "bg-cyan-700 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-500")}> {loading ? "Coaching..." : "Generate Coaching Plan"} </button>
        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      </div>
      {output && <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"><h2 className="text-lg font-semibold mb-4 text-gray-200">Your Coaching Plan</h2><pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">{output}</pre></div>}
    </main>
  );
}
export default Page;
PAGE_EOF
      ;;
    2176)
      cat > "$app_path/src/app/page.tsx" << 'PAGE_EOF'
"use client";
import { useState } from "react";
function Page() {
  const [format, setFormat] = useState("Live Commentary");
  const [sport, setSport] = useState("Basketball");
  const [angle, setAngle] = useState("Play-by-Play");
  const accent = "rose";
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleGenerate = async () => {
    setLoading(true); setError(""); setOutput("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ format, sport, angle }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOutput(data.output);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className={"text-4xl font-bold mb-3 bg-gradient-to-r from-"+accent+"-400 to-"+accent+"-600 bg-clip-text text-transparent"}>AI Sports Broadcast Writer</h1>
        <p className="text-gray-400 text-sm">Generate professional broadcast scripts, commentary, and sports commentary content</p>
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Broadcast Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Format</label><select value={format} onChange={e=>setFormat(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-rose-500"><option>Live Commentary</option><option>Pre-Game Show</option><option>Post-Game Analysis</option><option>Halftime Report</option><option>Feature Story</option><option>Interview Script</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Sport</label><select value={sport} onChange={e=>setSport(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-rose-500"><option>Basketball</option><option>Football</option><option>Soccer</option><option>Baseball</option><option>Hockey</option><option>Tennis</option><option>Golf</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Commentary Angle</label><select value={angle} onChange={e=>setAngle(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-rose-500"><option>Play-by-Play</option><option>Analytical</option><option>Human Interest</option><option>Historical</option><option>Technical</option></select></div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className={"mt-5 px-8 py-3 rounded-lg font-semibold text-white transition-all " + (loading ? "bg-rose-700 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-500")}> {loading ? "Writing..." : "Generate Broadcast Script"} </button>
        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      </div>
      {output && <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"><h2 className="text-lg font-semibold mb-4 text-gray-200">Broadcast Script</h2><pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">{output}</pre></div>}
    </main>
  );
}
export default Page;
PAGE_EOF
      ;;
    2177)
      cat > "$app_path/src/app/page.tsx" << 'PAGE_EOF'
"use client";
import { useState } from "react";
function Page() {
  const [sport, setSport] = useState("NFL Football");
  const [market, setMarket] = useState("Spread Betting");
  const [stake, setStake] = useState("100");
  const accent = "orange";
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,