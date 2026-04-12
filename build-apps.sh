#!/bin/bash
set -e

WORKDIR="/Users/nebulalumino/.openclaw/workspace"
cd "$WORKDIR"

check_disk() {
  FREE=$(df -h / | tail -1 | awk '{print $4}')
  echo "Disk free: $FREE"
}

apps=(
  "3671:ai-protein-structure:145deg,60%,50%:🧬 Protein Structure Analysis"
  "3672:ai-crispr-guide:270deg,65%,55%:🧪 CRISPR sgRNA Designer"
  "3673:ai-reaction-pathway:0deg,65%,50%:⚗️ Chemical Synthesis Planner"
  "3674:ai-genome-annotation:25deg,70%,55%:🧬 Genome Annotation Helper"
  "3675:ai-clinical-trial:220deg,60%,55%:📋 Clinical Trial Design"
  "3676:ai-em-prep:85deg,65%,50%:🔬 EM Sample Prep Guide"
  "3677:ai-buffer-calc:175deg,55%,45%:🧪 Buffer Calculator"
  "3678:ai-unit-converter:305deg,60%,60%:📐 Scientific Unit Converter"
  "3679:ai-drug-interaction:265deg,55%,50%:💊 Drug Interaction Checker"
  "3680:ai-microscopy:200deg,45%,45%:🔬 Microscopy Technique Selector"
  "3681:ai-power-analysis:0deg,60%,50%:📊 Statistical Power Calculator"
  "3682:ai-mendelian-random:45deg,75%,55%:🧬 Mendelian Randomization Designer"
  "3683:ai-sds-generator:340deg,55%,55%:📄 SDS/MSDS Generator"
  "3684:ai-pcr-primer:125deg,55%,45%:🧬 PCR Primer Designer"
  "3685:ai-spectroscopy:185deg,60%,55%:🌈 Spectroscopy Peak Identifier"
  "3686:ai-elisa-protocol:235deg,55%,55%:🧫 ELISA Protocol Optimizer"
  "3687:ai-figure-revision:165deg,55%,45%:🎨 Scientific Figure Revision Guide"
  "3688:ai-grant-critique:215deg,45%,55%:📝 Grant Pre-Submission Critique"
  "3689:ai-enzyme-kinetics:0deg,65%,50%:⚡ Enzyme Kinetics Estimator"
  "3690:ai-sci-comm:270deg,65%,55%:📢 Science Communication Explainer"
  "3691:ai-science-fair:85deg,65%,50%:🏫 Science Fair Project Planner"
  "3692:ai-collab-matcher:25deg,70%,55%:🤝 Research Collaboration Matcher"
  "3693:ai-proof-checker:220deg,60%,55%:✅ Mathematical Proof Checker"
  "3694:ai-astro-observe:175deg,55%,45%:🔭 Astronomy Observation Planner"
  "3695:ai-geology-sample:305deg,60%,60%:🪨 Geology Sample Submission Guide"
  "3696:ai-archaeology-survey:0deg,65%,50%:🏺 Archaeology Survey Planner"
  "3697:ai-brain-atlas:265deg,55%,50%:🧠 Brain Atlas Query Tool"
  "3698:ai-conference-abstract:200deg,45%,45%:📄 Science Conference Abstract Builder"
  "3699:ai-fair-data:340deg,55%,55%:♻️ FAIR Data Management Advisor"
  "3700:ai-novelty-checker:45deg,75%,55%:💡 Scientific Novelty Assessor"
)

PROMPTS=(
  "You are an expert protein structure analyst. Given a protein sequence or description, provide: putative secondary structure prediction (alpha-helices, beta-strands, coils), domain and motif identification, potential functional annotations, structural class prediction, and any notable features. Format with markdown headers. Be scientifically rigorous."
  "You are an expert CRISPR guide RNA designer. Given a target gene or genomic region, recommend optimal sgRNA sequences, assess on-target efficiency and off-target risk, suggest PAM requirements, and outline experimental validation steps. Format with markdown headers."
  "You are an expert synthetic chemist. Given a target molecule or reaction goal, propose a plausible multi-step synthesis pathway, recommend reagents and conditions for each step, identify potential side reactions, and suggest purification strategies. Format with markdown headers."
  "You are a genomics specialist. Given a genomic sequence or gene description, identify potential coding regions, suggest functional annotations, predict promoter/enhancer elements, and recommend downstream validation experiments. Format with markdown headers."
  "You are a clinical trial design expert. Given a research question or disease target, help design a clinical trial: suggest trial phase, endpoints, inclusion/exclusion criteria, sample size considerations, randomization strategy, and regulatory considerations. Format with markdown headers."
  "You are an electron microscopy specialist. Provide guidance on EM sample preparation: fixation methods, dehydration protocols, resin infiltration, sectioning recommendations, staining procedures, and common pitfalls to avoid. Format with markdown headers."
  "You are a biochemistry buffer expert. Given a target pH, buffer species, and concentration, calculate the precise buffer composition including acid/base ratios, ionic strength, and suggested preparation steps. Also recommend suitable buffer for specific applications. Format with markdown tables and steps."
  "You are a scientific unit conversion expert. Given a measurement and unit, convert between all relevant scientific unit systems (SI, CGS, imperial, molar, pressure, energy, temperature, etc.) and provide context on when each unit is used. Format with markdown tables."
  "You are a pharmacology expert. Given drug names or classes, analyze potential drug-drug interactions, classify by severity (major/moderate/minor), explain mechanisms of interaction, and suggest clinical management strategies. Format with markdown tables."
  "You are a microscopy expert. Given a sample type and research question, recommend the most appropriate microscopy technique (light, fluorescence, confocal, SEM, TEM, AFM, etc.), suggest sample preparation requirements, and outline key acquisition parameters. Format with markdown headers."
  "You are a biostatistician. Given a research design, calculate or estimate statistical power, suggest appropriate sample sizes, identify the correct statistical tests, and provide guidance on effect sizes and significance thresholds. Format with markdown tables and equations."
  "You are an expert in Mendelian randomization. Given a research question involving causal inference, help design an MR study: select suitable instrumental variables, suggest data sources, discuss assumptions, and recommend sensitivity analyses. Format with markdown headers."
  "You are a laboratory safety and compliance expert. Generate a comprehensive Safety Data Sheet (SDS/MSDS) for a given chemical: include hazard classifications, handling/storage procedures, exposure limits, first-aid measures, disposal guidelines, and regulatory compliance (GHS, OSHA). Format with proper SDS sections."
  "You are a molecular biology expert. Given a template DNA sequence and target region, design optimal PCR primers: calculate Tm, GC content, hairpin/dimer potential, suggest amplicon length, and recommend annealing temperatures. Also suggest hot-start conditions. Format with markdown tables."
  "You are a spectroscopy expert. Given spectral data description or peak positions, identify the compound class, assign peaks to functional groups, suggest complementary spectroscopic techniques, and interpret coupling patterns. Format with markdown tables and annotated peaks."
  "You are an immunoassay specialist. Optimize an ELISA protocol: suggest coating conditions, blocking agents, antibody dilutions, incubation times/temperatures, detection systems, and troubleshooting tips for common problems like high background or low signal. Format with markdown tables."
  "You are a scientific figure design expert. Given a draft figure or description, critique its clarity, visual hierarchy, and accessibility; suggest improvements to color schemes, panel layout, annotation, and compliance with journal guidelines. Recommend tools for revision. Format with markdown headers."
  "You are an NIH/grant review expert. Pre-review a grant proposal: evaluate significance, innovation, approach, investigators, and environment. Identify weaknesses, suggest concrete improvements, and predict likely reviewer concerns before submission. Format with structured critique sections."
  "You are an enzymology expert. Given enzyme name or reaction, estimate key kinetic parameters (Km, Vmax, kcat), suggest assay conditions, recommend substrate concentrations, discuss inhibition types, and propose kinetic experiments. Format with equations and markdown tables."
  "You are a science communication specialist. Given a scientific concept or finding, explain it at multiple levels: for a general audience, for peers in adjacent fields, and for policymakers. Suggest analogies, visual aids, and narrative structures. Format with distinct audience sections."
  "You are a science fair advisor. Help plan a compelling science fair project: suggest testable hypotheses, experimental designs, safety considerations, presentation approaches, and ways to stand out. Also suggest age-appropriate complexity levels. Format with step-by-step project roadmap."
  "You are a research collaboration strategist. Given a researcher's expertise and goals, suggest potential collaborators (by field/institution type), identify complementary skill gaps, recommend collaboration frameworks, and suggest platforms for finding partners. Format with organized recommendations."
  "You are a mathematical logic expert. Given a mathematical proof or claim, verify logical steps, identify gaps or errors, suggest improvements, and provide constructive guidance for rigor. When a step cannot be verified, clearly state the uncertainty. Format with step-by-step analysis."
  "You are an astronomy observation planner. Given a target object, location, date, and available equipment, plan an optimal observation session: suggest best viewing windows, required equipment, exposure settings, and environmental conditions. Include constellation context and alternative targets. Format with observation plan tables."
  "You are a geology lab specialist. Guide sample submission: recommend sample collection and preservation methods, required sample quantities, laboratory analysis packages, chain-of-custody documentation, turnaround times, and fee schedules. Format with checklist and submission guide."
  "You are an archaeology survey expert. Plan a field survey: suggest survey methods (surface, subsurface, remote sensing), sampling strategies, site recording protocols, equipment lists, team composition, and risk assessments. Also recommend post-survey documentation standards. Format with survey plan sections."
  "You are a neuroscience atlas expert. Given a brain region or structure name, provide anatomical details, connectivity maps, cell type compositions, known functions, available transgenic lines, and relevant database references (Allen Brain Atlas, etc.). Format with organized anatomical entries."
  "You are a scientific writing specialist. Given research findings or a draft outline, build a compelling conference abstract: structure it with background, methods, results, conclusions; optimize word count; suggest keywords; and tailor to specific conference themes. Format with the final abstract."
  "You are a FAIR data stewardship expert. Advise on making research data Findable, Accessible, Interoperable, and Reusable: recommend metadata standards, repository selection, identifier systems, licensing choices, and documentation practices. Format with actionable checklist sections."
  "You are a research novelty assessment expert. Given a manuscript title, abstract, or research description, evaluate its scientific novelty: identify how it extends or challenges prior work, suggest positioning strategies, identify potential competing works, and advise on framing the contribution. Format with structured assessment."
)

PLACEHOLDER_EXAMPLES=(
  "Enter a protein sequence (e.g., MVLSPADKTNVKAAWGKVGAHAGEYGAEAL...) or describe a protein structure problem..."
  "Enter a target gene or genomic region for sgRNA design (e.g., BRCA1, chr17:41244900-41246000)..."
  "Enter a target molecule or reaction goal (e.g., synthesize ibuprofen from isobutylbenzene...)..."
  "Enter a genomic sequence or gene description to annotate..."
  "Enter a research question or disease target for trial design (e.g., anti-PD1 efficacy in NSCLC)..."
  "Enter sample type and research objective for EM preparation guidance..."
  "Enter target pH, buffer species, and concentration (e.g., phosphate buffer pH 7.4, 100mM)..."
  "Enter a measurement to convert (e.g., 1 atmosphere in Pascal, or 98.6°F in Celsius)..."
  "Enter drug names or classes to check for interactions (e.g., warfarin + aspirin)..."
  "Enter sample type and research question to determine optimal microscopy technique..."
  "Enter study design parameters (e.g., two-group comparison, expected effect size 0.5, alpha=0.05)..."
  "Enter exposure and outcome variables for Mendelian randomization design..."
  "Enter chemical name or formula for SDS/MSDS generation (e.g., sodium dodecyl sulfate)..."
  "Enter template DNA sequence and target region for PCR primer design..."
  "Enter spectroscopic data or peak positions for compound identification..."
  "Enter assay type and target antigen/antibody for ELISA optimization..."
  "Describe or paste your scientific figure for revision suggestions..."
  "Paste your grant abstract or specific aims for pre-submission critique..."
  "Enter enzyme name and reaction conditions for kinetics estimation..."
  "Enter a scientific concept or finding to explain at multiple audience levels..."
  "Enter age group and research interest for science fair project planning..."
  "Enter your research expertise and collaboration goals..."
  "Enter a mathematical statement or proof to verify..."
  "Enter target celestial object, your location, and available equipment..."
  "Enter sample type and intended analyses for submission guidance..."
  "Enter site location, period of interest, and research questions..."
  "Enter a brain region or structure name to query the atlas..."
  "Paste your research findings or draft outline for abstract building..."
  "Describe your research project for FAIR data management guidance..."
  "Enter manuscript title/abstract to assess scientific novelty..."
)

SYSTEM_PROMPTS=(
  "You are an expert protein structure analyst. Given a protein sequence or description, provide: putative secondary structure prediction (alpha-helices, beta-strands, coils), domain and motif identification, potential functional annotations, structural class prediction, and any notable features. Format with markdown headers. Be scientifically rigorous."
  "You are an expert CRISPR guide RNA designer. Given a target gene or genomic region, recommend optimal sgRNA sequences, assess on-target efficiency and off-target risk, suggest PAM requirements, and outline experimental validation steps. Format with markdown headers."
  "You are an expert synthetic chemist. Given a target molecule or reaction goal, propose a plausible multi-step synthesis pathway, recommend reagents and conditions for each step, identify potential side reactions, and suggest purification strategies. Format with markdown headers."
  "You are a genomics specialist. Given a genomic sequence or gene description, identify potential coding regions, suggest functional annotations, predict promoter/enhancer elements, and recommend downstream validation experiments. Format with markdown headers."
  "You are a clinical trial design expert. Given a research question or disease target, help design a clinical trial: suggest trial phase, endpoints, inclusion/exclusion criteria, sample size considerations, randomization strategy, and regulatory considerations. Format with markdown headers."
  "You are an electron microscopy specialist. Provide guidance on EM sample preparation: fixation methods, dehydration protocols, resin infiltration, sectioning recommendations, staining procedures, and common pitfalls to avoid. Format with markdown headers."
  "You are a biochemistry buffer expert. Given a target pH, buffer species, and concentration, calculate the precise buffer composition including acid/base ratios, ionic strength, and suggested preparation steps. Also recommend suitable buffer for specific applications. Format with markdown tables and steps."
  "You are a scientific unit conversion expert. Given a measurement and unit, convert between all relevant scientific unit systems (SI, CGS, imperial, molar, pressure, energy, temperature, etc.) and provide context on when each unit is used. Format with markdown tables."
  "You are a pharmacology expert. Given drug names or classes, analyze potential drug-drug interactions, classify by severity (major/moderate/minor), explain mechanisms of interaction, and suggest clinical management strategies. Format with markdown tables."
  "You are a microscopy expert. Given a sample type and research question, recommend the most appropriate microscopy technique (light, fluorescence, confocal, SEM, TEM, AFM, etc.), suggest sample preparation requirements, and outline key acquisition parameters. Format with markdown headers."
  "You are a biostatistician. Given a research design, calculate or estimate statistical power, suggest appropriate sample sizes, identify the correct statistical tests, and provide guidance on effect sizes and significance thresholds. Format with markdown tables and equations."
  "You are an expert in Mendelian randomization. Given a research question involving causal inference, help design an MR study: select suitable instrumental variables, suggest data sources, discuss assumptions, and recommend sensitivity analyses. Format with markdown headers."
  "You are a laboratory safety and compliance expert. Generate a comprehensive Safety Data Sheet (SDS/MSDS) for a given chemical: include hazard classifications, handling/storage procedures, exposure limits, first-aid measures, disposal guidelines, and regulatory compliance (GHS, OSHA). Format with proper SDS sections."
  "You are a molecular biology expert. Given a template DNA sequence and target region, design optimal PCR primers: calculate Tm, GC content, hairpin/dimer potential, suggest amplicon length, and recommend annealing temperatures. Also suggest hot-start conditions. Format with markdown tables."
  "You are a spectroscopy expert. Given spectral data description or peak positions, identify the compound class, assign peaks to functional groups, suggest complementary spectroscopic techniques, and interpret coupling patterns. Format with markdown tables and annotated peaks."
  "You are an immunoassay specialist. Optimize an ELISA protocol: suggest coating conditions, blocking agents, antibody dilutions, incubation times/temperatures, detection systems, and troubleshooting tips for common problems like high background or low signal. Format with markdown tables."
  "You are a scientific figure design expert. Given a draft figure or description, critique its clarity, visual hierarchy, and accessibility; suggest improvements to color schemes, panel layout, annotation, and compliance with journal guidelines. Recommend tools for revision. Format with markdown headers."
  "You are an NIH/grant review expert. Pre-review a grant proposal: evaluate significance, innovation, approach, investigators, and environment. Identify weaknesses, suggest concrete improvements, and predict likely reviewer concerns before submission. Format with structured critique sections."
  "You are an enzymology expert. Given enzyme name or reaction, estimate key kinetic parameters (Km, Vmax, kcat), suggest assay conditions, recommend substrate concentrations, discuss inhibition types, and propose kinetic experiments. Format with equations and markdown tables."
  "You are a science communication specialist. Given a scientific concept or finding, explain it at multiple levels: for a general audience, for peers in adjacent fields, and for policymakers. Suggest analogies, visual aids, and narrative structures. Format with distinct audience sections."
  "You are a science fair advisor. Help plan a compelling science fair project: suggest testable hypotheses, experimental designs, safety considerations, presentation approaches, and ways to stand out. Also suggest age-appropriate complexity levels. Format with step-by-step project roadmap."
  "You are a research collaboration strategist. Given a researcher's expertise and goals, suggest potential collaborators (by field/institution type), identify complementary skill gaps, recommend collaboration frameworks, and suggest platforms for finding partners. Format with organized recommendations."
  "You are a mathematical logic expert. Given a mathematical proof or claim, verify logical steps, identify gaps or errors, suggest improvements, and provide constructive guidance for rigor. When a step cannot be verified, clearly state the uncertainty. Format with step-by-step analysis."
  "You are an astronomy observation planner. Given a target object, location, date, and available equipment, plan an optimal observation session: suggest best viewing windows, required equipment, exposure settings, and environmental conditions. Include constellation context and alternative targets. Format with observation plan tables."
  "You are a geology lab specialist. Guide sample submission: recommend sample collection and preservation methods, required sample quantities, laboratory analysis packages, chain-of-custody documentation, turnaround times, and fee schedules. Format with checklist and submission guide."
  "You are an archaeology survey expert. Plan a field survey: suggest survey methods (surface, subsurface, remote sensing), sampling strategies, site recording protocols, equipment lists, team composition, and risk assessments. Also recommend post-survey documentation standards. Format with survey plan sections."
  "You are a neuroscience atlas expert. Given a brain region or structure name, provide anatomical details, connectivity maps, cell type compositions, known functions, available transgenic lines, and relevant database references (Allen Brain Atlas, etc.). Format with organized anatomical entries."
  "You are a scientific writing specialist. Given research findings or a draft outline, build a compelling conference abstract: structure it with background, methods, results, conclusions; optimize word count; suggest keywords; and tailor to specific conference themes. Format with the final abstract."
  "You are a FAIR data stewardship expert. Advise on making research data Findable, Accessible, Interoperable, and Reusable: recommend metadata standards, repository selection, identifier systems, licensing choices, and documentation practices. Format with actionable checklist sections."
  "You are a research novelty assessment expert. Given a manuscript title, abstract, or research description, evaluate its scientific novelty: identify how it extends or challenges prior work, suggest positioning strategies, identify potential competing works, and advise on framing the contribution. Format with structured assessment."
)

BUTTON_LABELS=(
  "Analyze Protein Structure"
  "Design sgRNA"
  "Plan Synthesis"
  "Annotate Genome"
  "Design Clinical Trial"
  "Guide EM Prep"
  "Calculate Buffer"
  "Convert Units"
  "Check Interactions"
  "Select Technique"
  "Calculate Power"
  "Design MR Study"
  "Generate SDS"
  "Design Primers"
  "Identify Peaks"
  "Optimize ELISA"
  "Revise Figure"
  "Critique Grant"
  "Estimate Kinetics"
  "Explain Science"
  "Plan Project"
  "Find Collaborators"
  "Verify Proof"
  "Plan Observation"
  "Guide Submission"
  "Plan Survey"
  "Query Atlas"
  "Build Abstract"
  "Advise FAIR Data"
  "Assess Novelty"
)

total=${#apps[@]}
for i in "${!apps[@]}"; do
  IFS=':' read -r taskid dirname color desc <<< "${apps[$i]}"
  system_prompt="${SYSTEM_PROMPTS[$i]}"
  placeholder="${PLACEHOLDER_EXAMPLES[$i]}"
  button_label="${BUTTON_LABELS[$i]}"
  hue=$(echo "$color" | sed 's/deg.*//')
  sat=$(echo "$color" | sed 's/.*deg,\([^,]*\)%.*/\1/')
  lightness=$(echo "$color" | sed 's/.*%, *\([^)]*\)%.*/\1/')
  
  echo "=== [$((i+1))/$total] Task $taskid: $dirname ==="
  
  # Check disk space
  FREE=$(df -g / | tail -1 | awk '{print $4}')
  if [ "$FREE" -lt 5 ]; then
    echo "WARNING: Less than 5GB free! Stopping."
    exit 1
  fi
  
  # Create Next.js app
  npx create-next-app@latest "$dirname" --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack --yes 2>&1 | tail -3
  
  # Install openai
  cd "$WORKDIR/$dirname"
  npm install openai 2>&1 | tail -2
  
  # Write page.tsx
  cat > src/app/page.tsx << PAGEOF
"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setOutput(data.output || "No response generated.");
    } catch {
      setOutput("Error: Failed to generate response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: "hsl(${hue}deg,${sat}%,${lightness}%)" }}>
          ${desc}
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          AI-powered scientific tool — provide your input and let the AI assist.
        </p>
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 mb-6 backdrop-blur-sm">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Input
          </label>
          <textarea
            className="w-full bg-gray-900/80 border border-gray-600 rounded-lg p-3 text-white text-sm resize-y focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": "hsl(${hue}deg,${sat}%,${lightness}%)" } as React.CSSProperties}
            rows={6}
            placeholder="${placeholder}"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="mt-4 w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "hsl(${hue}deg,${sat}%,${lightness}%)" }}
          >
            {loading ? "Processing..." : "${button_label}"}
          </button>
        </div>
        {output && (
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Results</h2>
            <div className="prose prose-invert prose-sm max-w-none text-gray-200 whitespace-pre-wrap">
              {output}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
PAGEOF

  # Write API route
  mkdir -p src/app/api/generate
  cat > src/app/api/generate/route.ts << ROUEOF
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input?.trim()) {
      return NextResponse.json({ error: "Input required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: \`${system_prompt}\` },
        { role: "user", content: input },
      ],
      max_tokens: 1200,
      temperature: 0.7,
    });

    const output = completion.choices[0]?.message?.content || "No response generated.";
    return NextResponse.json({ output });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
ROUEOF

  # Build
  npm run build 2>&1 | tail -5
  
  # Git
  git init 2>/dev/null || true
  git add -A 2>/dev/null
  git commit -m "feat: initial commit" 2>/dev/null
  gh repo create NebulaLumino/\${dirname#*-} --public --push 2>/dev/null || {
    git remote add origin "https://github.com/NebulaLumino/\${dirname#*-}.git" 2>/dev/null || true
    git push -u origin main 2>/dev/null || true
  }
  
  # Clean
  rm -rf node_modules .next
  
  echo "Done: $dirname"
  cd "$WORKDIR"
done

echo "ALL 30 APPS BUILT"
