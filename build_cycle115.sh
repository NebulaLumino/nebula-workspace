#!/bin/bash
# Build script for all 20 AI Psychology apps

WORKDIR="/Users/nebulalumino/.openclaw/workspace"
cd "$WORKDIR"

APPS=(
  "3441:ai-cognitive-distortion:#a855f7:#9333ea:purple:CBT Cognitive Distortion Tracker"
  "3442:ai-habit-loop:#14b8a6:#0d9488:teal:Habit Loop Analyzer"
  "3443:ai-implicit-bias:#6366f1:#4f46e5:indigo:Implicit Bias Awareness Tool"
  "3444:ai-mbti-deep-dive:#3b82f6:#2563eb:blue:MBTI Cognitive Function Analyzer"
  "3445:ai-enneagram:#f59e0b:#d97706:amber:Enneagram Type Analyzer"
  "3446:ai-johari-window:#06b6d4:#0891b2:cyan:Johari Window Builder"
  "3447:ai-big-five:#10b981:#059669:emerald:Big Five Personality Report"
  "3448:ai-attachment-style:#f43f5e:#e11d48:rose:Attachment Style Analyzer"
  "3449:ai-emotional-intelligence:#fb923c:#f97316:orange:EI Coach & Meter"
  "3450:ai-growth-mindset:#84cc16:#65a30d:lime:Growth Mindset Reframe Tool"
  "3451:ai-cbt-thought-record:#0ea5e9:#0284c7:sky:CBT Thought Record"
  "3452:ai-journal-prompter:#a855f7:#9333ea:violet:Journal Prompt Generator"
  "3453:ai-anger-tracker:#ef4444:#dc2626:red:Anger Trigger Tracker"
  "3454:ai-sleep-hygiene:#64748b:#475569:slate-blue:Sleep Hygiene Optimizer"
  "3455:ai-burnout-recovery:#facc15:#eab308:yellow:Burnout Recovery Planner"
  "3456:ai-grief-companion:#6366f1:#4f46e5:indigo-grief:Grief Processing Companion"
  "3457:ai-loneliness-connector:#ec4899:#db2777:pink:Loneliness Assessment"
  "3458:ai-social-anxiety:#a855f7:#9333ea:purple-social:Social Anxiety Hierarchy"
  "3459:ai-adhd-toolkit:#14b8a6:#0d9488:teal-adhd:ADHD Focus Toolkit"
  "3460:ai-meditation-breathing:#10b981:#059669:green:Meditation & Breathing Guide"
)

PROMPTS=(
  "You are a CBT (Cognitive Behavioral Therapy) expert. Analyze the negative thought provided. Identify the specific cognitive distortion(s) at play (e.g., all-or-nothing thinking, catastrophizing, mind reading, fortune-telling, labeling, mental filter, disqualifying the positive, emotional reasoning, should statements, personalization, magnification/minimization). Then provide a structured reframed response that challenges the distortion and offers a balanced, evidence-based alternative thought."
  "You are a behavioral psychology expert specializing in habit formation. Analyze the habit description and break it down into the three components of the habit loop: Cue (trigger), Routine (behavior), and Reward. Identify what triggers the habit, what the habitual behavior looks like, and what psychological reward is reinforcing it. Then provide actionable suggestions to either replace the habit with a healthier alternative, reduce the trigger's impact, or reshape the reward."
  "You are an implicit bias researcher and IAT (Implicit Association Test) specialist. Analyze the scenario described. Identify the likely category of implicit bias present (e.g., race, gender, age, weight, disability, sexuality, beauty, nationality), the psychological mechanism driving it (automatic processing, in-group favoritism, out-group bias, stereotype threat), and provide concrete mitigation strategies grounded in intergroup contact theory, bias interruption techniques, and stereotype replacement."
  "You are a Myers-Briggs Type Indicator (MBTI) expert and cognitive function analyst. Analyze the 4-letter MBTI type provided (e.g., INFP, ENTJ, ISFJ). Provide a comprehensive breakdown including: dominant/auxiliary/tertiary/inferior cognitive function stack, type dynamics, how the type operates under stress, key strengths and growth edges, ideal career paths, relationship compatibility notes, and specific personal growth exercises for this type."
  "You are an Enneagram expert specializing in the nine personality types. Analyze the Enneagram type number provided (1-9). Detail the core motivation (what drives this type), core fear (what this type avoids), key defense mechanism, typical stress/growth arrows, dominant subtype, integration paths, and specific practices for growth and self-awareness. Include how this type relates to the other types and workplace dynamics."
  "You are a Johari Window expert and self-awareness coach. Analyze the self-described traits and categorize them into the four quadrants of the Johari Window model: Open Area (known to self & others), Blind Spot (known to others but not self), Facade (known to self but not others), and Unknown (known to neither self nor others). Provide insights on reducing blind spots through feedback solicitation, opening the facade safely, and exploring the unknown quadrant through reflection and trusted relationships."
  "You are a personality psychologist specializing in the Big Five / Five-Factor Model (OCEAN). Analyze the five self-rated trait dimensions: Openness to Experience, Conscientiousness, Extraversion, Agreeableness, and Neuroticism (with their reverse-scored stability counterpart). Provide a comprehensive personality report including trait profiles, subfacet breakdowns, predicted behavioral tendencies, relationship and career implications, growth recommendations, and how traits interact with each other in your unique personality configuration."
  "You are a relationship attachment theory expert. Analyze the relationship patterns and attachment history described. Identify the attachment style (Secure, Anxious-Preoccupied, Dismissive-Avoidant, Fearful-Avoidant) likely at play, explain how early attachment experiences shaped these patterns, and provide a tailored communication improvement guide. Include specific strategies for expressing needs, managing anxiety in relationships, building secure attachment, and evidence-based interventions for attachment injury."
  "You are an Emotional Intelligence (EI/Goleman) coach and expert in the RULER model (Recognize, Understand, Label, Express, Regulate). Analyze the situation described. Identify the emotions at play, their triggers, intensity levels, and the underlying needs. Provide specific EI strategies: emotion labeling techniques, regulation tactics (cognitive reappraisal, breathing, acceptance), empathy-building exercises, and an emotional response plan for similar future situations."
  "You are a mindset coach trained in Carol Dweck's growth mindset framework. Take the fixed mindset statement provided and reframe it in Dweck's growth mindset language. Explain why the original statement reflects a fixed mindset, reframe each element with growth-oriented language, provide specific next-step actions that embody a growth mindset, and offer mantras or mental shifts to internalize the growth orientation. Ground everything in neuroplasticity research and practical psychology."
  "You are a CBT (Cognitive Behavioral Therapy) practitioner. Complete the 5-column CBT thought record: Column 1 - Situation (who, what, when, where), Column 2 - Automatic Thought(s) (what went through your mind), Column 3 - Emotion(s) and emotion intensity (0-100%), Column 4 - Cognitive Distortion(s) identified, Column 5 - Balanced/Adaptive Response (evidence for/against, alternative thought, worst/best/most likely outcome). Guide the user through restructuring distorted thinking patterns with warmth and clinical precision."
  "You are a reflective writing coach and journal therapy practitioner. Based on the mood and theme specified, generate 5 deeply insightful guided journal prompts. Each prompt should be specific, thought-provoking, and open-ended — not yes/no questions. They should guide the user toward meaningful self-reflection, emotional processing, and personal insight. Include a brief framing note on why this theme matters psychologically at this moment."
  "You are an anger management specialist. Analyze the anger trigger described. Identify what the trigger reveals about underlying needs, values, or past wounds. Provide immediate calm-down techniques (breathing, grounding, time-out protocol, physical discharge), medium-term strategies (trigger avoidance, cognitive preparation, communication skills), and a long-term anger management plan including cognitive restructuring, assertiveness training, and when to seek professional support. Include an anger diary template."
  "You are a sleep science and sleep hygiene expert. Analyze the sleep habits described and calculate a sleep hygiene score (0-100). Rate each dimension: sleep environment, consistent bedtime routine, screen time before bed, caffeine/alcohol timing, exercise timing, bedroom temperature, stress levels, and sleep duration. Provide a prioritized, evidence-based improvement plan with specific, actionable recommendations grounded in sleep science research (REM, circadian rhythm, adenosine, cortisol)."
  "You are a burnout prevention and recovery specialist. Analyze the exhaustion signs described and assess the burnout stage (Zeier, Herbert Benson model): Early Warning, Acute Burnout, or Chronic Burnout. Provide a personalized, staged action plan including immediate crisis steps if needed, medium-term recovery strategies (boundary-setting, recovery activities, workload restructuring), and long-term prevention. Reference the Job Demands-Resources model and self-determination theory."
  "You are a grief counseling companion trained in stage-based grief models (Kübler-Ross, Continuing Bonds, Dual Process Model). Analyze the loss details provided. Identify where the person may be in the grief process, normalize their experience, and provide stage-appropriate emotional language and suggestions. Include how to honor the deceased, manage anniversary reactions, navigate ambiguous loss, support children in grief, and when to seek professional help. Be warm, validating, and non-prescriptive."
  "You are a loneliness researcher and social connection specialist. Analyze the social patterns described and calculate a loneliness/social connection score. Evaluate: network size, frequency of meaningful contact, perceived social support quality, belongingness, and social isolation markers. Provide a tiered strategy: quick wins to reduce isolation immediately, medium-term connection-building approaches, and deeper work on attachment wounds or social skill development if needed. Reference the evolutionary psychology basis of loneliness."
  "You are a social anxiety specialist trained in CBT and graded exposure therapy. Analyze the social anxiety triggers described. Build a personalized graded exposure hierarchy (0-100 SUDS ratings) from least to most anxiety-provoking. For each level, provide behavioral experiments, cognitive restructuring notes, safety behavior elimination strategies, and a coping card template. Include an overall treatment plan integrating CBT, acceptance and commitment therapy elements, and somatic approaches."
  "You are an ADHD coaching specialist. Analyze the tasks and challenges described through the ADHD lens (executive function deficits, dopamine deficiency, time-blindness, rejection sensitivity dysphoria). Provide a structured toolkit including: task breakdown strategy, priority matrix adapted for ADHD, Pomodoro timer configuration (work/break ratios), body-doubling suggestions, medication-adjacent lifestyle supports, environment design for focus, and strategies for rejection sensitivity. Reference Russell Barkley's ADHD model."
  "You are a mindfulness and meditation instructor. Based on the stress level provided (1-10), recommend a specific breathing pattern (Box Breathing for 7-10, 4-7-8 for 5-7, Physiological Sigh for 8-10, diaphragmatic breathing for 1-5) and a complete guided meditation script including: body scan, present-moment anchoring, loving-kindness or body-based focus depending on stress level. Provide the meditation in first-person present tense suitable for reading or recording. Include session duration recommendations and integration tips."
)

for i in "${!APPS[@]}"; do
  IFS=':' read -r num name hex1 hex2 tag desc <<< "${APPS[$i]}"
  prompt="${PROMPTS[$i]}"
  
  echo "========================================="
  echo "Building $num: $name ($tag)"
  echo "========================================="
  
  # Skip if already exists
  if [ -d "$WORKDIR/$name" ]; then
    echo "SKIP: $name already exists"
    continue
  fi
  
  # 1. Create Next.js app
  npx create-next-app@latest "$name" \
    --typescript --tailwind --eslint --app --src-dir \
    --import-alias "@/*" --no-turbopack --yes 2>&1 | tail -5
  
  cd "$WORKDIR/$name"
  
  # 2. Write page.tsx
  cat > src/app/page.tsx << 'PAGEOF'
'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput('');
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setOutput(data.result || data.response || '');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold mb-2">{APP_TITLE}</h1>
          <p className="text-gray-400 text-sm">{APP_DESC}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <textarea
            className="w-full bg-gray-800/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 text-sm"
            rows={5}
            placeholder={PLACEHOLDER_TEXT}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="mt-4 w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            style={{ backgroundColor: BUTTON_COLOR }}
          >
            {loading ? 'Generating...' : 'Generate Insight'}
          </button>
        </div>

        {(output || error) && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            {error ? (
              <p className="text-red-400 text-sm">{error}</p>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
PAGEOF

  # Replace placeholders
  sed -i '' "s|APP_TITLE|$desc|g" src/app/page.tsx
  sed -i '' "s|APP_DESC|$desc|g" src/app/page.tsx
  sed -i '' "s|PLACEHOLDER_TEXT|Enter your text here...|g" src/app/page.tsx
  sed -i '' "s|BUTTON_COLOR|$hex1|g" src/app/page.tsx

  # 3. Write API route
  mkdir -p src/app/api/generate
  cat > src/app/api/generate/route.ts << 'APIEOF'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API key missing' }, { status: 500 });

    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: `SYSTEM_PROMPT_PLACEHOLDER\n\nUser input: ${prompt}` }],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || '';
    return NextResponse.json({ result: reply });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate' }, { status: 500 });
  }
}
APIEOF

  sed -i '' "s|SYSTEM_PROMPT_PLACEHOLDER|$prompt|g" src/app/api/generate/route.ts

  # 4. Add react-markdown dependency
  npm install react-markdown 2>&1 | tail -3
  
  # 5. Build
  npm run build 2>&1 | tail -10
  BUILD_STATUS=$?
  
  # 6. Git init and push
  git init 2>/dev/null
  git add -A
  git commit -m "feat: initial commit" 2>&1 | tail -3
  
  # Create or set remote
  gh repo create NebulaLumino/$name --public --push 2>/dev/null || {
    git remote add origin https://github.com/NebulaLumino/$name.git 2>/dev/null
    git push -u origin main 2>&1 | tail -3
  }
  
  # 7. Clean up
  rm -rf node_modules .next
  
  echo "DONE: $name (build=$BUILD_STATUS)"
  echo ""

done

echo "ALL APPS BUILT"
