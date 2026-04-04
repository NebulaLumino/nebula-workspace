#!/usr/bin/env python3
"""Build Cycle 73 - Generate implementations for all 20 sports apps."""
import os

WORKSPACE = "/Users/nebulalumino/.openclaw/workspace"

APPS = [
    {
        "task_id": "2171", "dir": "ai-sports-performance", "accent": "violet",
        "title": "AI Sports Performance Optimizer",
        "desc": "Generate personalized athletic training programs and performance optimization plans",
        "system": "You are an expert athletic performance coach. Generate detailed training programs including: Strength Training, Conditioning, Sport-Specific Drills, Recovery Protocols, Timeline and Milestones, and Nutritional Guidance for athletic excellence.",
        "fields": [
            ("sport", "Sport", ["Basketball","Football","Soccer","Baseball","Tennis","Swimming","Track & Field","Volleyball","Hockey","CrossFit"]),
            ("position", "Position / Event", "input"),
            ("goal", "Primary Goal", ["Explosiveness","Endurance","Strength","Speed","Agility","Power","Flexibility","Recovery"]),
            ("trainingAge", "Training Age / Experience", ["Less than 1 year","1-2 years","3-5 years","5-10 years","Professional"]),
            ("daysPerWeek", "Training Days Per Week", ["3","4","5","6","7"]),
        ]
    },
    {
        "task_id": "2172", "dir": "ai-injury-recovery", "accent": "red",
        "title": "AI Injury Recovery Planner",
        "desc": "Structured rehabilitation programs and recovery timelines for athletes",
        "system": "You are a sports medicine specialist and athletic trainer. Generate comprehensive injury recovery plans including: Injury Assessment Summary, Rehabilitation Phases, Exercise Protocol, Timeline & Milestones, Return-to-Sport Criteria, Prevention Strategies, and Nutrition for Recovery.",
        "fields": [
            ("injury", "Injury Type", ["ACL Tear","MCL Sprain","Rotator Cuff","Ankle Sprain","Tennis Elbow","Hamstring Strain","Meniscus Tear","Achilles Tendon","Concussion","Fracture"]),
            ("stage", "Recovery Stage", ["Early Recovery","Active Rehabilitation","Strengthening Phase","Return to Sport"]),
            ("sport", "Sport", ["Basketball","Football","Soccer","Tennis","Swimming","Baseball","CrossFit","Running"]),
            ("weeksPostInjury", "Weeks Since Injury", ["1","2","3","4","6","8","12","16"]),
        ]
    },
    {
        "task_id": "2173", "dir": "ai-sports-nutrition", "accent": "green",
        "title": "AI Sports Nutrition Planner",
        "desc": "Customized meal plans and nutrition strategies for peak athletic performance",
        "system": "You are a sports nutritionist. Generate detailed nutrition plans including: Daily Caloric Targets, Macro Breakdown, Pre/Post Workout Nutrition, Meal Timing Schedule, Hydration Strategy, Supplement Recommendations, and Food Lists with portions.",
        "fields": [
            ("sport", "Sport", ["Soccer","Basketball","Football","Swimming","Running","Cycling","CrossFit","Tennis"]),
            ("goal", "Performance Goal", ["Endurance","Strength","Power","Weight Loss","Muscle Gain","Agility"]),
            ("dietary", "Dietary Restrictions", ["No Restrictions","Vegetarian","Vegan","Gluten-Free","Dairy-Free","Nut-Free","Keto"]),
            ("mealsPerDay", "Meals Per Day", ["3","4","5","6"]),
            ("weight", "Body Weight (kg)", "number"),
        ]
    },
    {
        "task_id": "2174", "dir": "ai-game-film", "accent": "amber",
        "title": "AI Game Film Analyzer",
        "desc": "Deep analysis of game footage with tactical breakdowns and performance insights",
        "system": "You are a sports analyst and tactical coach. Generate comprehensive game film analysis including: Key Plays Breakdown, Offensive/Defensive Scheme Analysis, Player Performance Ratings, Opponent Tendencies, Tactical Adjustments, and Improvement Recommendations.",
        "fields": [
            ("sport", "Sport", ["Basketball","Football","Soccer","Baseball","Hockey","Volleyball"]),
            ("analysisType", "Analysis Type", ["Offensive Plays","Defensive Schemes","Transition Game","Set Pieces","Player Matchups","Game Plan Review"]),
            ("playerFocus", "Player Focus", "input"),
        ]
    },
    {
        "task_id": "2175", "dir": "ai-esports-coaching", "accent": "cyan",
        "title": "AI Esports Coaching Assistant",
        "desc": "Personalized coaching plans and gameplay improvement strategies for esports athletes",
        "system": "You are a professional esports coach. Generate detailed coaching plans including: Mechanics Drills, Game Sense Development, Strategy & Decision Making, VOD Review Priorities, Mental Game Training, Practice Schedule, and Rank Progression Milestones.",
        "fields": [
            ("game", "Game", ["League of Legends","Valorant","CS2","Overwatch 2","Dota 2","Rocket League","Fighting Games"]),
            ("role", "Role / Character", "input"),
            ("rank", "Current Rank", ["Bronze","Silver","Gold","Platinum","Diamond","Master","Grandmaster","Professional"]),
            ("focusArea", "Focus Area", ["Mechanics","Game Sense","Strategy","Communication","Mental Game","Teamwork"]),
        ]
    },
    {
        "task_id": "2176", "dir": "ai-sports-broadcast", "accent": "rose",
        "title": "AI Sports Broadcast Writer",
        "desc": "Generate professional broadcast scripts, commentary, and sports media content",
        "system": "You are a professional sports broadcaster and commentator. Generate engaging broadcast content including: Opening Segment, Key Narrative Hooks, Play-by-Play Moments, Analytical Commentary, Human Interest Angles, Closing Segment, and Suggested B-Roll Notes.",
        "fields": [
            ("format", "Format", ["Live Commentary","Pre-Game Show","Post-Game Analysis","Halftime Report","Feature Story","Interview Script"]),
            ("sport", "Sport", ["Basketball","Football","Soccer","Baseball","Hockey","Tennis","Golf"]),
            ("angle", "Commentary Angle", ["Play-by-Play","Analytical","Human Interest","Historical","Technical"]),
        ]
    },
    {
        "task_id": "2177", "dir": "ai-sports-betting", "accent": "orange",
        "title": "AI Sports Betting Odds Analyzer",
        "desc": "Data-driven betting analysis and model training for sports betting",
        "system": "You are a sports betting analyst and data scientist. Generate comprehensive betting analysis including: Market Movement Analysis, Value Bet Identification, Statistical Model Inputs, Risk Assessment, Bankroll Management Strategy, Line Shopping Recommendations, and Historical Performance Context.",
        "fields": [
            ("sport", "Sport / League", ["NFL Football","NBA Basketball","MLB Baseball","NHL Hockey","Soccer (MLS/EPL)","College Football","College Basketball","UFC/MMA"]),
            ("market", "Betting Market", ["Spread Betting","Moneyline","Over/Under","Parlays","Player Props","Futures"]),
            ("stake", "Bankroll ($)", "number"),
        ]
    },
    {
        "task_id": "2178", "dir": "ai-youth-sports", "accent": "lime",
        "title": "AI Youth Sports Coach",
        "desc": "Age-appropriate training programs and coaching guidance for young athletes",
        "system": "You are a youth sports development specialist. Generate developmentally appropriate coaching plans including: Age-Appropriate Drills, Skill Building Games, Physical Literacy Foundation, Fun Engagement Strategies, Parent Coaching Notes, Practice Plans, and Long-Term Athlete Development Pathway.",
        "fields": [
            ("sport", "Sport", ["Soccer","Basketball","Baseball","Football","Swimming","Tennis","Gymnastics","Martial Arts","Track & Field"]),
            ("ageGroup", "Age Group", ["5-7 years","8-10 years","11-13 years","14-16 years"]),
            ("experience", "Experience Level", ["Beginner","Intermediate","Advanced"]),
            ("goal", "Primary Goal", ["Fun & Engagement","Skill Development","Team Play","Competitive Development"]),
        ]
    },
    {
        "task_id": "2179", "dir": "ai-sports-merch", "accent": "blue",
        "title": "AI Sports Merchandise Designer",
        "desc": "Creative merchandise concepts and branding for sports teams and athletes",
        "system": "You are a sports merchandise designer and branding expert. Generate creative merchandise concepts including: Product Line Ideas, Design Direction & Color Schemes, Tagline and Branding Copy, Target Audience Analysis, Pricing Strategy, Campaign Concept, and Licensed vs. Original Design Recommendations.",
        "fields": [
            ("teamType", "Team / Athlete Type", ["Professional Team","College/University","Youth League","Individual Athlete","Esports Team","Club/Semi-Pro"]),
            ("category", "Merch Category Focus", ["Apparel","Accessories","Collectibles","Digital Products","Experiential","Home Goods"]),
            ("brandVibe", "Brand Vibe", ["Classic/Traditional","Modern/Sleek","Edgy/Hip-Hop","Family-Friendly","Elite/Premium","Urban/Streetwear"]),
        ]
    },
    {
        "task_id": "2180", "dir": "ai-ref-review", "accent": "teal",
        "title": "AI Referee Review System",
        "desc": "Game footage review and referee decision analysis with improvement recommendations",
        "system": "You are a sports officiating expert and referee trainer. Generate comprehensive referee review reports including: Call Accuracy Assessment, Rule Application Analysis, Positioning Evaluation, Game Management Review, Controversial Call Breakdown, Training Recommendations, and Mechanic Improvements.",
        "fields": [
            ("sport", "Sport", ["Basketball","Football","Soccer","Baseball","Hockey","Volleyball","Tennis"]),
            ("callType", "Call Type Reviewed", ["Foul Call","Violation","Ball Handling","Technical Foul","Ejection","Goal/No Goal","Out of Bounds","Catch/Interference"]),
            ("difficulty", "Difficulty Level", ["Easy","Moderate","Difficult","Controversial"]),
        ]
    },
    {
        "task_id": "2181", "dir": "ai-roster-builder", "accent": "violet",
        "title": "AI Roster Builder",
        "desc": "Optimal player roster construction and lineup optimization for sports teams",
        "system": "You are a sports roster analyst and team builder expert. Generate optimal roster strategies including: Roster Composition Analysis, Position Depth Assessment, Player Fit Metrics, Lineup Optimization, Salary Cap Considerations, Trade/Cut Recommendations, Draft Priorities, and Chemistry Factors.",
        "fields": [
            ("league", "League", ["NBA","NFL","MLB","NHL","MLS","NWSL","College Football","College Basketball"]),
            ("rosterSize", "Roster Size", ["15-man","53-man","25-man","23-man","18-man","Unlimited"]),
            ("goal", "Team Goal", ["Win Championship","Make Playoffs","Rebuild/Retool","Competitive Balance"]),
            ("constraint", "Key Constraint", ["Salary Cap","No Constraints","Draft Picks Only","International Roster","Youth Focus"]),
        ]
    },
    {
        "task_id": "2182", "dir": "ai-fantasy-sports", "accent": "pink",
        "title": "AI Fantasy Sports Advisor",
        "desc": "Data-driven fantasy sports lineup optimization and player analysis",
        "system": "You are a fantasy sports expert and data analyst. Generate winning fantasy strategies including: Player Rankings & Projections, Waiver Wire Targets, Start/Sit Decisions, Trade Value Analysis, DFS Lineup Optimization, Sleeper Picks, Bust Alerts, and Matchup Analysis.",
        "fields": [
            ("platform", "Platform", ["ESPN","Yahoo","CBS","DraftKings","FanDuel","Sleeper","Underdog"]),
            ("sport", "Sport", ["NFL Football","NBA Basketball","MLB Baseball","NHL Hockey","Soccer","Golf","Tennis"]),
            ("format", "League Format", ["Standard","PPR","Half PPR","FanDuel","DraftKings Showdown","Best Ball","Dynasty","Keeper"]),
            ("rosterSize", "Roster Size", ["Standard (10-12)","Small (6-8)","Large (14+)"]),
        ]
    },
    {
        "task_id": "2183", "dir": "ai-sports-marketing", "accent": "emerald",
        "title": "AI Sports Marketing Generator",
        "desc": "Marketing campaigns, fan engagement strategies, and sponsorship content for sports brands",
        "system": "You are a sports marketing strategist. Generate comprehensive marketing plans including: Campaign Concept, Social Media Strategy, Fan Engagement Tactics, Sponsorship Activation Ideas, Content Calendar, Brand Positioning, Community Outreach, and Revenue Generation Strategies.",
        "fields": [
            ("entityType", "Entity Type", ["Professional Team","College Program","Youth League","Individual Athlete","Esports Organization","Sports Brand"]),
            ("goal", "Marketing Goal", ["Fan Acquisition","Engagement Boost","Revenue Generation","Sponsorship Sales","Ticket Sales","Merchandise Sales"]),
            ("platform", "Primary Platform", ["Instagram","TikTok","YouTube","Twitter/X","Facebook","Multi-Platform"]),
        ]
    },
    {
        "task_id": "2184", "dir": "ai-coaching-philosophy", "accent": "yellow",
        "title": "AI Coaching Philosophy Designer",
        "desc": "Develop and articulate your unique coaching philosophy and leadership approach",
        "system": "You are a master coach and leadership mentor. Generate a comprehensive coaching philosophy document including: Core Values & Beliefs, Leadership Style, Player Development Approach, Training Methodology, Game Strategy Philosophy, Communication Framework, Culture Building Strategy, and Legacy Goals.",
        "fields": [
            ("sport", "Sport", ["Basketball","Football","Soccer","Baseball","Swimming","Track & Field","Volleyball","CrossFit","Tennis","General"]),
            ("experience", "Coaching Experience", ["Youth/Rec","High School","College","Semi-Pro","Professional"]),
            ("philosophyStyle", "Philosophy Style", ["Player-Empowering","Disciplined/Traditional","Analytical/Data-Driven","Holistic/Wellness","Winning-Focused","Development-First"]),
            ("teamSize", "Team Size", "input"),
        ]
    },
    {
        "task_id": "2185", "dir": "ai-sports-travel", "accent": "slate",
        "title": "AI Sports Travel Planner",
        "desc": "Comprehensive travel planning for teams, tournaments, and athletic events",
        "system": "You are a sports travel coordinator and logistics expert. Generate comprehensive travel plans including: Transportation Options, Accommodation Recommendations, Meal Planning for Athletes, Training Facility Access, Recovery Protocols on the Road, Budget Breakdown, Contingency Plans, and Itinerary Optimization.",
        "fields": [
            ("tripType", "Trip Type", ["Tournament","Away Game","Training Camp","Showcase/Combine","Multi-City Tour","Road Trip Season"]),
            ("teamSize", "Team Size", "input"),
            ("duration", "Trip Duration", ["1-2 days","3-5 days","1 week","2+ weeks"]),
            ("budget", "Budget Level", ["Budget","Moderate","Premium","No Constraint"]),
        ]
    },
    {
        "task_id": "2186", "dir": "ai-golf-strategy", "accent": "indigo",
        "title": "AI Golf Strategy Analyzer",
        "desc": "Course strategy, club selection, and game improvement plans for golfers",
        "system": "You are a professional golf strategist and instructor. Generate comprehensive golf strategy plans including: Course Strategy & Shot Selection, Club Distance Profiling, Game Improvement Priorities, Practice Regiment, Mental Game Approach, Tournament Preparation, Stats Analysis (GIR, FIR, Putts), and Scoring Strategy.",
        "fields": [
            ("handicap", "Handicap Index", ["Scratch or Better","1-5","6-10","11-15","16-20","21-30","30+"]),
            ("goal", "Primary Goal", ["Lower Scores","Tournament Prep","Break 100","Break 90","Break 80","Consistency"]),
            ("courseType", "Course Type", ["Parkland","Links","Desert","Mountain","Tree-Lined","Resort"]),
            ("format", "Format", ["Stroke Play","Match Play","Scramble","Stableford","Four-Ball"]),
        ]
    },
    {
        "task_id": "2187", "dir": "ai-water-sports", "accent": "sky",
        "title": "AI Water Sports Guide",
        "desc": "Training plans, technique guides, and competitive strategies for water sports",
        "system": "You are a water sports expert and coach. Generate comprehensive guides including: Technique Breakdown, Training Programs, Equipment Recommendations, Competition Strategy, Safety Protocols, Nutrition for Water Sports, Weather Planning, and Progression Pathway.",
        "fields": [
            ("sport", "Water Sport", ["Swimming","Rowing","Kayaking","Sailing","Surfing","Diving","Water Polo","Canoeing","Windsurfing","SUP"]),
            ("level", "Experience Level", ["Beginner","Intermediate","Advanced","Competitive","Elite"]),
            ("goal", "Primary Goal", ["Technique Improvement","Endurance","Competition","Fun/Fitness","Certification Prep"]),
            ("environment", "Environment", ["Pool","Open Ocean","Lake","River","Bay"]),
        ]
    },
    {
        "task_id": "2188", "dir": "ai-sports-podcast", "accent": "zinc",
        "title": "AI Sports Podcast Producer",
        "desc": "Generate podcast content, episode outlines, and sports media show formats",
        "system": "You are a sports podcast producer and content creator. Generate podcast production content including: Episode Title & Hook, Segment Breakdown, Talking Points, Guest Suggestions, Show Notes Outline, Social Media Clips, Production Notes, and Audience Engagement Strategy.",
        "fields": [
            ("format", "Show Format", ["News & Recap","Interview Show","Debate Show","Deep Dive","Fan Q&A","Predictions Show","Historical/Legend Series"]),
            ("sport", "Primary Sport", ["Multi-Sport","NFL Football","NBA Basketball","MLB Baseball","Soccer","College Sports","Esports","Golf"]),
            ("episodeNum", "Episode Number", "input"),
            ("tone", "Tone", ["Casual & Fun","Analytical & Serious","Hot Take & Provocative","Family-Friendly","Behind-the-Scenes"]),
        ]
    },
    {
        "task_id": "2189", "dir": "ai-league-admin", "accent": "neutral",
        "title": "AI League Admin Manager",
        "desc": "League management tools, scheduling, and administrative content for sports leagues",
        "system": "You are a sports league administrator. Generate comprehensive league management resources including: Season Format Design, Schedule Generation, Rule Book Draft, Standings & Playoff Structure, Communication Templates, Registration Guidelines, Budget Planning, and Risk Management.",
        "fields": [
            ("leagueType", "League Type", ["Youth Recreational","High School","Adult Recreational","Semi-Pro","Club/Travel","Fantasy League"]),
            ("sport", "Sport", ["Basketball","Football","Soccer","Baseball","Volleyball","Hockey","Softball","Lacrosse"]),
            ("numTeams", "Number of Teams", "input"),
            ("seasonLength", "Season Length", ["6 games","8 games","10 games","12 games","Full Season"]),
        ]
    },
    {
        "task_id": "2190", "dir": "ai-sports-camp", "accent": "fuchsia",
        "title": "AI Sports Camp Creator",
        "desc": "Design and plan comprehensive youth and elite sports camps and training programs",
        "system": "You are a sports camp director and curriculum designer. Generate comprehensive sports camp plans including: Daily Curriculum Schedule, Skill Progression Framework, Drill Catalog, Camper Assessment rubrics, Safety Protocols, Staffing Plan, Equipment List, Parent Communication, and Revenue/Pricing Model.",
        "fields": [
            ("sport", "Sport", ["Basketball","Football","Soccer","Baseball","Tennis","Swimming","Volleyball","Track & Field","Multi-Sport"]),
            ("campType", "Camp Type", ["Day Camp","Overnight Camp","Elite/Advanced","Beginner Friendly","Position Specific","Team Camp"]),
            ("duration", "Camp Duration", ["1 week","2 weeks","3 weeks","4 weeks","Summer Long (8 weeks)"]),
            ("ageGroup", "Age Group", ["5-8 years","9-12 years","13-15 years","16-18 years","College/Adult"]),
        ]
    },
]


def generate_page_tsx(app):
    accent = app["accent"]
    fields_code_lines = []
    state_keys = []
    form_data_lines = []

    for f in app["fields"]:
        name, label, extra = f
        state_keys.append('"' + name + '":"' + (extra[0] if isinstance(extra, list) else '') + '"')

        if isinstance(extra, list):
            opts = "".join('<option>' + o + '</option>' for o in extra)
            fields_code_lines.append(
                '          <div><label className="block text-sm font-medium mb-1">' + label + '</label>\n'
                '            <select\n'
                '              value={state["' + name + '"]}\n'
                '              onChange={e => setState(s => ({...s, "' + name + '": e.target.value}))}\n'
                '              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-' + accent + '-500"\n'
                '            >\n' + opts + '\n            </select>\n          </div>'
            )
            form_data_lines.append('        "' + name + '": state["' + name + '"],')
        elif extra == "input":
            fields_code_lines.append(
                '          <div><label className="block text-sm font-medium mb-1">' + label + '</label>\n'
                '            <input\n'
                '              value={state["' + name + '"]}\n'
                '              onChange={e => setState(s => ({...s, "' + name + '": e.target.value}))}\n'
                '              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-' + accent + '-500"\n'
                '            />\n          </div>'
            )
            form_data_lines.append('        "' + name + '": state["' + name + '"],')
        elif extra == "number":
            fields_code_lines.append(
                '          <div><label className="block text-sm font-medium mb-1">' + label + '</label>\n'
                '            <input type="number"\n'
                '              value={state["' + name + '"]}\n'
                '              onChange={e => setState(s => ({...s, "' + name + '": e.target.value}))}\n'
                '              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-' + accent + '-500"\n'
                '            />\n          </div>'
            )
            form_data_lines.append('        "' + name + '": state["' + name + '"],')

    fields_html = "\n".join(fields_code_lines)
    form_data = "\n".join(form_data_lines)
    initial_state = "{\n          " + ",\n          ".join(state_keys) + ",\n        }"

    code = (
        '"use client";\n'
        'import { useState } from "react";\n\n'
        'function Page() {\n'
        '  const [state, setState] = useState<Record<string, string>>(' + initial_state + ');\n'
        '  const [output, setOutput] = useState("");\n'
        '  const [loading, setLoading] = useState(false);\n'
        '  const [error, setError] = useState("");\n'
        '  const accent = "' + accent + '";\n\n'
        '  const handleGenerate = async () => {\n'
        '    setLoading(true);\n'
        '    setError("");\n'
        '    setOutput("");\n'
        '    try {\n'
        '      const res = await fetch("/api/generate", {\n'
        '        method: "POST",\n'
        '        headers: { "Content-Type": "application/json" },\n'
        '        body: JSON.stringify({\n'
        + form_data + '\n'
        '        }),\n'
        '      });\n'
        '      const data = await res.json();\n'
        '      if (!res.ok) throw new Error(data.error || "Generation failed");\n'
        '      setOutput(data.output);\n'
        '    } catch (err: any) {\n'
        '      setError(err.message);\n'
        '    } finally {\n'
        '      setLoading(false);\n'
        '    }\n'
        '  };\n\n'
        '  return (\n'
        '    <main className="max-w-5xl mx-auto px-4 py-12">\n'
        '      <div className="text-center mb-10">\n'
        '        <h1 className={"text-4xl font-bold mb-3 bg-gradient-to-r from-" + accent + "-400 to-" + accent + "-600 bg-clip-text text-transparent"}>\n'
        '          ' + app["title"] + '\n'
        '        </h1>\n'
        '        <p className="text-gray-400 text-sm">' + app["desc"] + '</p>\n'
        '      </div>\n'
        '      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">\n'
        '        <h2 className="text-lg font-semibold mb-4 text-gray-200">Parameters</h2>\n'
        '        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">\n'
        + fields_html + '\n'
        '        </div>\n'
        '        <button\n'
        '          onClick={handleGenerate}\n'
        '          disabled={loading}\n'
        '          className={"mt-5 px-8 py-3 rounded-lg font-semibold text-white transition-all " + (loading ? "bg-" + accent + "-700 cursor-not-allowed" : "bg-" + accent + "-600 hover:bg-" + accent + "-500")}\n'
        '        >\n'
        '          {loading ? "Generating..." : "Generate"}\n'
        '        </button>\n'
        '        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}\n'
        '      </div>\n'
        '      {output && (\n'
        '        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">\n'
        '          <h2 className="text-lg font-semibold mb-4 text-gray-200">Result</h2>\n'
        '          <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">{output}</pre>\n'
        '        </div>\n'
        '      )}\n'
        '    </main>\n'
        '  );\n'
        '}\n'
        'export default Page;\n'
    )
    return code


def generate_route_ts(system_prompt):
    return (
        '"use server";\n'
        'import { NextRequest, NextResponse } from "next/server";\n'
        'import OpenAI from "openai";\n\n'
        'export async function POST(req: NextRequest) {\n'
        '  try {\n'
        '    const body = await req.json();\n'
        '    const openai = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: process.env.OPENAI_API_KEY });\n'
        '    const completion = await openai.chat.completions.create({\n'
        '      model: "deepseek-chat",\n'
        '      messages: [\n'
        '        { role: "system", content: "' + system_prompt.replace('"', '\\"') + '" },\n'
        '        { role: "user", content: JSON.stringify(body) },\n'
        '      ],\n'
        '      temperature: 0.7,\n'
        '      max_tokens: 2048,\n'
        '    });\n'
        '    return NextResponse.json({ output: completion.choices[0].message.content });\n'
        '  } catch (error: any) {\n'
        '    return NextResponse.json({ error: error.message }, { status: 500 });\n'
        '  }\n'
        '}\n'
    )


def generate_layout_tsx(title, desc):
    return (
        'import type { Metadata } from "next";\n'
        'import "./globals.css";\n\n'
        'export const metadata: Metadata = {\n'
        '  title: "' + title + '",\n'
        '  description: "' + desc + '",\n'
        '};\n\n'
        'export default function RootLayout({ children }: { children: React.ReactNode }) {\n'
        '  return (\n'
        '    <html lang="en">\n'
        '      <body className="bg-gray-900 text-white min-h-screen">{children}</body>\n'
        '    </html>\n'
        '  );\n'
        '}\n'
    )


for app in APPS:
    app_path = os.path.join(WORKSPACE, app["dir"])
    if not os.path.exists(os.path.join(app_path, "src/app")):
        print(f"SKIP (no src/app): {app['dir']}")
        continue

    # Write page.tsx
    page_code = generate_page_tsx(app)
    page_path = os.path.join(app_path, "src/app/page.tsx")
    with open(page_path, "w") as f:
        f.write(page_code)

    # Write API route
    api_dir = os.path.join(app_path, "src/app/api/generate")
    os.makedirs(api_dir, exist_ok=True)
    route_code = generate_route_ts(app["system"])
    with open(os.path.join(api_dir, "route.ts"), "w") as f:
        f.write(route_code)

    # Write layout.tsx (only if needed, it may already exist)
    layout_path = os.path.join(app_path, "src/app/layout.tsx")
    layout_code = generate_layout_tsx(app["title"], app["desc"])
    with open(layout_path, "w") as f:
        f.write(layout_code)

    print(f"Implemented: {app['dir']}")

print("All implementations generated!")
