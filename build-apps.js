#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const APPS = [
  { name:"ai-procedural-quest",title:"⚔️ Procedural Quest Generator",accent:"hsl(145deg,60%,50%)",focusBorder:"focus:border-green-500",buttonBg:"hsl(145deg,60%,50%)",placeholder:"e.g., A haunted forest near a dwarven mining colony, involving a lost artifact...",systemPrompt:"You are a creative RPG quest designer. Generate a detailed, engaging procedural RPG quest with quest giver, objectives, NPCs involved, rewards, and lore hooks. Output in clean markdown format.",docTitle:"Quest Generated",done:true },
  { name:"ai-npc-dialogue",title:"💬 NPC Dialogue Tree Architect",accent:"hsl(270deg,65%,55%)",focusBorder:"focus:border-violet-400",buttonBg:"hsl(270deg,65%,55%)",placeholder:"e.g., A gruff dwarven blacksmith in a frontier town, weary of outsiders but secretly sentimental...",systemPrompt:"You are an expert NPC dialogue designer. Create a branching dialogue tree for an NPC with multiple conversation paths, player choices, and reactive responses. Use markdown with clear branching cues.",docTitle:"Dialogue Tree",done:false },
  { name:"ai-game-lore",title:"📖 Game Lore Codex Builder",accent:"hsl(85deg,70%,50%)",focusBorder:"focus:border-lime-400",buttonBg:"hsl(85deg,70%,50%)",placeholder:"e.g., A fallen empire that ruled via forbidden blood magic, with three surviving noble houses...",systemPrompt:"You are a game lore master. Build a comprehensive lore codex entry covering history, factions, key figures, mythology, and in-world artifacts. Output in structured markdown.",docTitle:"Lore Codex Entry",done:false },
  { name:"ai-boss-fight",title:"👹 Boss Fight Design Challenge",accent:"hsl(0deg,65%,50%)",focusBorder:"focus:border-red-400",buttonBg:"hsl(0deg,65%,50%)",placeholder:"e.g., A corrupted angel boss at level 40, phase-based, weak to holy damage in second phase...",systemPrompt:"You are a boss fight designer. Design a challenging, thematic boss encounter including phases, attack patterns, mechanics, environmental hazards, and defeat conditions. Include difficulty scaling notes.",docTitle:"Boss Fight Design",done:false },
  { name:"ai-character-backstory",title:"🎭 TTRPG Character Backstory Generator",accent:"hsl(25deg,70%,55%)",focusBorder:"focus:border-orange-400",buttonBg:"hsl(25deg,70%,55%)",placeholder:"e.g., Half-orc paladin, exiled from order, seeks redemption through a forgotten god...",systemPrompt:"You are a TTRPG backstory writer. Generate a rich character backstory with formative events, NPCs, motivations, secrets, flaws, and ties to the campaign world. Include session hooks.",docTitle:"Character Backstory",done:false },
  { name:"ai-dungeon-rooms",title:"🏰 Dungeon Room Randomizer",accent:"hsl(220deg,60%,55%)",focusBorder:"focus:border-blue-400",buttonBg:"hsl(220deg,60%,55%)",placeholder:"e.g., 10 rooms for a goblin-infested abandoned temple, CR 3-5, horror undertones...",systemPrompt:"You are a dungeon designer. Generate a list of themed, varied dungeon rooms with descriptions, encounters, traps, treasures, and connecting lore. Include difficulty ratings and tactical notes.",docTitle:"Dungeon Rooms",done:false },
  { name:"ai-game-economy",title:"💰 Game Economy Balancer",accent:"hsl(175deg,55%,45%)",focusBorder:"focus:border-teal-400",buttonBg:"hsl(175deg,55%,45%)",placeholder:"e.g., An MMORPG with 3-faction PvP, crafting economy, player-driven markets...",systemPrompt:"You are an economy designer. Analyze and propose a balanced in-game economy including currency sinks, inflation controls, item values, crafting costs, reward structures, and player earning pathways.",docTitle:"Economy Analysis",done:false },
  { name:"ai-speedrun-route",title:"⚡ Speedrun Route Optimizer",accent:"hsl(305deg,60%,60%)",focusBorder:"focus:border-pink-400",buttonBg:"hsl(305deg,60%,60%)",placeholder:"e.g., Super Metroid any% route, current PB 42:00, stuck at Ridley...",systemPrompt:"You are a speedrunning analyst. Optimize a speedrun route with frame-perfect notes, sequence breaks, backup strategies, item routing, and time save estimates. Reference known strats.",docTitle:"Optimized Route",done:false },
  { name:"ai-gacha-calculator",title:"🎰 Gacha Probability Calculator",accent:"hsl(265deg,55%,50%)",focusBorder:"focus:border-purple-400",buttonBg:"hsl(265deg,55%,50%)",placeholder:"e.g., 5-star rate 2%, pity at 90 pulls, rate-up character, 200 USD budget...",systemPrompt:"You are a gacha math analyst. Calculate expected values, pity system math, probability of getting rate-up characters within budget, and expected spending. Include worst-case and best-case scenarios.",docTitle:"Gacha Analysis",done:false },
  { name:"ai-game-music",title:"🎵 Game Soundtrack Genre Mixer",accent:"hsl(200deg,45%,45%)",focusBorder:"focus:border-slate-400",buttonBg:"hsl(200deg,45%,45%)",placeholder:"e.g., Boss theme for a cyberpunk RPG, mixing synthwave with traditional Japanese instruments...",systemPrompt:"You are a game music composer. Design a soundtrack concept blending genres, describe the mood, instrumentation, tempo, and thematic motifs for different game states.",docTitle:"Soundtrack Concept",done:false },
  { name:"ai-platformer-level",title:"🌊 Platformer Level Seed Generator",accent:"hsl(0deg,60%,50%)",focusBorder:"focus:border-red-400",buttonBg:"hsl(0deg,60%,50%)",placeholder:"e.g., Precision platformer, medium difficulty, ice physics theme, 60-second level...",systemPrompt:"You are a platformer level designer. Generate a detailed level design with room-by-room layout, platform types, enemy placements, collectibles, and difficulty curve. Include theme and art direction.",docTitle:"Level Design",done:false },
  { name:"ai-card-deck",title:"🃏 Card Game Deck Archetype Builder",accent:"hsl(45deg,75%,55%)",focusBorder:"focus:border-yellow-400",buttonBg:"hsl(45deg,75%,55%)",placeholder:"e.g., A control mage archetype in a card game with spell synergy mechanics...",systemPrompt:"You are a card game designer. Build a deck archetype with core cards, win conditions, matchup analysis, mulligan strategy, and sideboard notes. Include card count distribution and mana curve.",docTitle:"Deck Archetype",done:false },
  { name:"ai-game-accessibility",title:"♿ Game Accessibility Auditor",accent:"hsl(340deg,55%,55%)",focusBorder:"focus:border-rose-400",buttonBg:"hsl(340deg,55%,55%)",placeholder:"e.g., Audit a fast-paced FPS for colorblind players, motor accessibility, and cognitive load...",systemPrompt:"You are an accessibility auditor. Review a game's accessibility features across vision, hearing, motor, and cognitive categories. Provide specific, actionable recommendations with implementation priority.",docTitle:"Accessibility Report",done:false },
  { name:"ai-crafting-system",title:"🔨 Crafting Recipe System Designer",accent:"hsl(125deg,55%,45%)",focusBorder:"focus:border-emerald-400",buttonBg:"hsl(125deg,55%,45%)",placeholder:"e.g., Survival game with foraging, smithing, and alchemy; balanced for early/mid/late game...",systemPrompt:"You are a crafting system designer. Design a tiered crafting system with recipes, ingredient sourcing, progression gating, specializations, and balance notes. Include crafting challenges and failure states.",docTitle:"Crafting System",done:false },
  { name:"ai-weather-cycle",title:"🌦️ Weather & Day-Night Cycle Planner",accent:"hsl(185deg,60%,55%)",focusBorder:"focus:border-cyan-400",buttonBg:"hsl(185deg,60%,55%)",placeholder:"e.g., Open world RPG with 4 seasons, each affecting gameplay, NPC schedules, and combat...",systemPrompt:"You are an environmental systems designer. Plan a weather and day-night cycle with gameplay impact, NPC behavior changes, combat modifiers, travel effects, and visual/aesthetic notes.",docTitle:"Weather System Plan",done:false },
  { name:"ai-patch-notes",title:"📝 Game Patch Notes Writer",accent:"hsl(235deg,55%,55%)",focusBorder:"focus:border-indigo-400",buttonBg:"hsl(235deg,55%,55%)",placeholder:"e.g., Patch notes for a battle royale game: buffer fix, new map, OP sniper nerfed, ranked mode added...",systemPrompt:"You are a game patch notes writer. Draft professional, player-friendly patch notes covering balance changes, bug fixes, new content, quality of life improvements, and known issues.",docTitle:"Patch Notes",done:false },
  { name:"ai-esports-bracket",title:"🏆 Esports Bracket Analyzer",accent:"hsl(165deg,55%,45%)",focusBorder:"focus:border-cyan-400",buttonBg:"hsl(165deg,55%,45%)",placeholder:"e.g., 16-team LoL tournament, teams are evenly matched, analyze bracket pools and upset potential...",systemPrompt:"You are an esports analyst. Analyze a tournament bracket for matchup dynamics, upset potential, favored paths, sleeper teams, and predicted outcomes with reasoning.",docTitle:"Bracket Analysis",done:false },
  { name:"ai-game-achievements",title:"🏅 Game Achievement Designer",accent:"hsl(215deg,45%,55%)",focusBorder:"focus:border-gray-400",buttonBg:"hsl(215deg,45%,55%)",placeholder:"e.g., Design 10 achievements for an indie metroidvania covering exploration, combat, and secrets...",systemPrompt:"You are an achievement designer. Create a set of achievements with names, descriptions, unlock conditions, rarity tiers, and design rationale. Balance difficulty and engagement.",docTitle:"Achievement Set",done:false },
  { name:"ai-game-lobby",title:"🎮 Multiplayer Lobby Configurator",accent:"hsl(0deg,65%,50%)",focusBorder:"focus:border-red-400",buttonBg:"hsl(0deg,65%,50%)",placeholder:"e.g., 4v4 competitive shooter lobby with custom rules, no mic requirement, ranked placement...",systemPrompt:"You are a multiplayer systems designer. Configure a game lobby with game mode settings, team balance rules, vote/kick systems, chat/mic settings, and match workflow.",docTitle:"Lobby Config",done:false },
  { name:"ai-world-geography",title:"🗺️ World-Building Geography Generator",accent:"hsl(270deg,65%,55%)",focusBorder:"focus:border-violet-400",buttonBg:"hsl(270deg,65%,55%)",placeholder:"e.g., A continent with 5 distinct biomes, ancient rival kingdoms, and a forbidden magical wasteland...",systemPrompt:"You are a world-building cartographer. Generate a detailed geography with regions, biomes, natural resources, trade routes, climate patterns, and how geography shapes culture and conflict.",docTitle:"World Geography",done:false },
  { name:"ai-npc-schedule",title:"📅 NPC Schedule Generator",accent:"hsl(85deg,65%,50%)",focusBorder:"focus:border-lime-400",buttonBg:"hsl(85deg,65%,50%)",placeholder:"e.g., A merchant, guard captain, and mysterious cloaked figure in a medieval town of 500 people...",systemPrompt:"You are an NPC schedule designer. Generate detailed daily, weekly, and seasonal schedules for NPCs including locations, activities, dialogue triggers, and event-driven variations.",docTitle:"NPC Schedules",done:false },
  { name:"ai-retro-rom",title:"🕹️ Retro ROM Analysis Report",accent:"hsl(25deg,70%,55%)",focusBorder:"focus:border-orange-400",buttonBg:"hsl(25deg,70%,55%)",placeholder:"e.g., Analyze a ROM hack of Mega Man 2 with new boss order and revised enemy placements...",systemPrompt:"You are a retro gaming analyst. Produce a detailed technical and design analysis of a retro game or ROM hack covering level design, difficulty, mechanic exploitation, and hidden content.",docTitle:"ROM Analysis",done:false },
  { name:"ai-alternate-history",title:"⚡ Alternate History Scenario Builder",accent:"hsl(175deg,55%,45%)",focusBorder:"focus:border-teal-400",buttonBg:"hsl(175deg,55%,45%)",placeholder:"e.g., The Roman Empire never fell at 476 AD — what does year 1500 look like globally?",systemPrompt:"You are an alternate history worldbuilder. Construct a plausible alternate history scenario with diverging events, ripple effects on politics, technology, culture, and geography over a specified time span.",docTitle:"Alternate History",done:false },
  { name:"ai-magic-items",title:"✨ D&D Magic Item Generator",accent:"hsl(305deg,60%,60%)",focusBorder:"focus:border-pink-400",buttonBg:"hsl(305deg,60%,60%)",placeholder:"e.g., A legendary cursed weapon for a level 15 party, tied to a dead god's vengeance...",systemPrompt:"You are a D&D magic item designer. Generate detailed magic items with name, rarity, attunement requirements, mechanical effects, flavor text, and quest hooks for acquisition.",docTitle:"Magic Items",done:false },
  { name:"ai-conlang-builder",title:"🗣️ Fictional Language & Culture Builder",accent:"hsl(340deg,55%,55%)",focusBorder:"focus:border-rose-400",buttonBg:"hsl(340deg,55%,55%)",placeholder:"e.g., An isolationist elven culture that communicates through color-coded song and sign language...",systemPrompt:"You are a conlang and culture designer. Build a fictional language with phonology, grammar, sample vocabulary, writing system concept, and companion cultural practices, rituals, and social structures.",docTitle:"Conlang & Culture",done:false },
  { name:"ai-creature-design",title:"🐉 Creature Ecology Architect",accent:"hsl(125deg,55%,45%)",focusBorder:"focus:border-emerald-400",buttonBg:"hsl(125deg,55%,45%)",placeholder:"e.g., A pack-hunting amphibious predator for a swamp biome, mid-fantasy setting...",systemPrompt:"You are a creature designer. Design a creature with ecology, appearance, behavior, abilities, role in food chain, interactions with other species, and how it impacts the game world.",docTitle:"Creature Design",done:false },
  { name:"ai-skill-tree",title:"🌲 RPG Skill Tree Optimizer",accent:"hsl(200deg,45%,45%)",focusBorder:"focus:border-slate-400",buttonBg:"hsl(200deg,45%,45%)",placeholder:"e.g., A summoner class in a dark fantasy ARPG with 3 archetypes: necromancer, demonologist, beastmaster...",systemPrompt:"You are an RPG systems designer. Design and optimize a skill tree with branches, synergies, must-have nodes, dead ends, build-enabling choices, and balance notes for a specific class archetype.",docTitle:"Skill Tree",done:false },
  { name:"ai-faction-matrix",title:"⚔️ Faction Relationship Matrix Builder",accent:"hsl(0deg,60%,50%)",focusBorder:"focus:border-red-400",buttonBg:"hsl(0deg,60%,50%)",placeholder:"e.g., 6 factions in a post-apocalyptic world: raiders, traders, scientists, cultists, militia, synths...",systemPrompt:"You are a faction systems designer. Build a faction relationship matrix with ally/enemy/neutral dynamics, how relationships change based on player actions, faction goals, and war/peace triggers.",docTitle:"Faction Matrix",done:false },
  { name:"ai-game-pacing",title:"📈 Game Pacing & Tension Arc Designer",accent:"hsl(165deg,55%,45%)",focusBorder:"focus:border-cyan-400",buttonBg:"hsl(165deg,55%,45%)",placeholder:"e.g., Design the pacing arc for a 15-hour single-player sci-fi RPG with 5 major story acts...",systemPrompt:"You are a game pacing designer. Design a narrative and gameplay pacing arc with peaks, valleys, tension curves, setpiece placement, rest beats, and difficulty pacing over the full game length.",docTitle:"Pacing Arc",done:false },
  { name:"ai-lore-fragment",title:"📜 Lore Fragment & Relic Historian",accent:"hsl(45deg,75%,55%)",focusBorder:"focus:border-yellow-400",buttonBg:"hsl(45deg,75%,55%)",placeholder:"e.g., A shattered war horn from a forgotten dragon-slaying army, found in a ruined temple...",systemPrompt:"You are a lore historian. Write detailed lore fragments and artifact descriptions with history, previous owners, mysteries, contradictions, and how they connect to broader world lore.",docTitle:"Lore Fragment",done:false },
];

const WORKSPACE = "/Users/nebulalumino/.openclaw/workspace";

for (const app of APPS) {
  const appDir = path.join(WORKSPACE, app.name);
  const apiDir = path.join(appDir, "src/app/api/generate");
  fs.mkdirSync(apiDir, { recursive: true });

  const routeContent = `import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt) return NextResponse.json({ error: "No prompt" }, { status: 400 });

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.deepseek.com/v1",
  });

  const completion = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: "${app.systemPrompt.replace(/"/g, '\\"')}" },
      { role: "user", content: prompt },
    ],
    max_tokens: 1200,
    temperature: 0.82,
  });

  return NextResponse.json({ result: completion.choices[0].message.content });
}
`;

  const pageContent = `"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResult(data.result || "No result returned.");
    } catch {
      setResult("Error generating content.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col items-center justify-center p-6 gap-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-2" style={{ color: "${app.accent}" }}>
          ${app.title}
        </h1>
        <p className="text-gray-400 text-center mb-6 text-sm">
          Describe your game context and constraints — AI generates the content.
        </p>
        <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
          <textarea
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none ${app.focusBorder} transition-colors"
            rows={5}
            placeholder="${app.placeholder}"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="mt-4 w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "${app.buttonBg}" }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
        {result && (
          <div className="mt-6 bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-inner">
            <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
              ${app.docTitle}
            </h2>
            <div className="text-gray-100 whitespace-pre-wrap text-sm leading-relaxed">
              {result}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
`;

  fs.writeFileSync(path.join(apiDir, "route.ts"), routeContent);
  fs.writeFileSync(path.join(appDir, "src/app/page.tsx"), pageContent);
  console.log(`✓ ${app.name} (done=${app.done})`);
}

console.log("\nAll files written!");
