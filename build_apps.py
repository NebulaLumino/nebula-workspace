#!/usr/bin/env python3
import subprocess
import os

WORKDIR = "/Users/nebulalumino/.openclaw/workspace"
os.chdir(WORKDIR)

APPS = [
    ("3671", "ai-protein-structure", "145,60,50", "Protein Structure Analysis",
     "You are an expert protein structure analyst. Given a protein sequence or description, provide: secondary structure prediction, domain/motif identification, functional annotations, structural class prediction, and notable features. Format with markdown headers. Be scientifically rigorous.",
     "Enter a protein sequence (e.g., MVLSPADKTNVKAAWGKVGAHAGEYGAEAL...) or describe a protein structure problem...",
     "Analyze Protein Structure"),
    ("3672", "ai-crispr-guide", "270,65,55", "CRISPR sgRNA Designer",
     "You are an expert CRISPR guide RNA designer. Given a target gene or genomic region, recommend optimal sgRNA sequences, assess on-target efficiency and off-target risk, suggest PAM requirements, and outline experimental validation steps. Format with markdown headers.",
     "Enter a target gene or genomic region for sgRNA design (e.g., BRCA1, chr17:41244900-41246000)...",
     "Design sgRNA"),
    ("3673", "ai-reaction-pathway", "0,65,50", "Chemical Synthesis Planner",
     "You are an expert synthetic chemist. Given a target molecule or reaction goal, propose a plausible multi-step synthesis pathway, recommend reagents and conditions for each step, identify potential side reactions, and suggest purification strategies. Format with markdown headers.",
     "Enter a target molecule or reaction goal (e.g., synthesize ibuprofen from isobutylbenzene...)...",
     "Plan Synthesis"),
    ("3674", "ai-genome-annotation", "25,70,55", "Genome Annotation Helper",
     "You are a genomics specialist. Given a genomic sequence or gene description, identify potential coding regions, suggest functional annotations, predict promoter/enhancer elements, and recommend downstream validation experiments. Format with markdown headers.",
     "Enter a genomic sequence or gene description to annotate...",
     "Annotate Genome"),
    ("3675", "ai-clinical-trial", "220,60,55", "Clinical Trial Design",
     "You are a clinical trial design expert. Given a research question or disease target, help design a clinical trial: suggest trial phase, endpoints, inclusion/exclusion criteria, sample size considerations, randomization strategy, and regulatory considerations. Format with markdown headers.",
     "Enter a research question or disease target for trial design (e.g., anti-PD1 efficacy in NSCLC)...",
     "Design Clinical Trial"),
    ("3676", "ai-em-prep", "85,65,50", "EM Sample Prep Guide",
     "You are an electron microscopy specialist. Provide guidance on EM sample preparation: fixation methods, dehydration protocols, resin infiltration, sectioning recommendations, staining procedures, and common pitfalls to avoid. Format with markdown headers.",
     "Enter sample type and research objective for EM preparation guidance...",
     "Guide EM Prep"),
    ("3677", "ai-buffer-calc", "175,55,45", "Buffer Calculator",
     "You are a biochemistry buffer expert. Given a target pH, buffer species, and concentration, calculate the precise buffer composition including acid/base ratios, ionic strength, and suggested preparation steps. Format with markdown tables and steps.",
     "Enter target pH, buffer species, and concentration (e.g., phosphate buffer pH 7.4, 100mM)...",
     "Calculate Buffer"),
    ("3678", "ai-unit-converter", "305,60,60", "Scientific Unit Converter",
     "You are a scientific unit conversion expert. Given a measurement and unit, convert between all relevant scientific unit systems (SI, CGS, imperial, molar, pressure, energy, temperature, etc.) and provide context on when each unit is used. Format with markdown tables.",
     "Enter a measurement to convert (e.g., 1 atmosphere in Pascal, or 98.6F in Celsius)...",
     "Convert Units"),
    ("3679", "ai-drug-interaction", "265,55,50", "Drug Interaction Checker",
     "You are a pharmacology expert. Given drug names or classes, analyze potential drug-drug interactions, classify by severity (major/moderate/minor), explain mechanisms of interaction, and suggest clinical management strategies. Format with markdown tables.",
     "Enter drug names or classes to check for interactions (e.g., warfarin + aspirin)...",
     "Check Interactions"),
    ("3680", "ai-microscopy", "200,45,45", "Microscopy Technique Selector",
     "You are a microscopy expert. Given a sample type and research question, recommend the most appropriate microscopy technique (light, fluorescence, confocal, SEM, TEM, AFM, etc.), suggest sample preparation requirements, and outline key acquisition parameters. Format with markdown headers.",
     "Enter sample type and research question to determine optimal microscopy technique...",
     "Select Technique"),
    ("3681", "ai-power-analysis", "0,60,50", "Statistical Power Calculator",
     "You are a biostatistician. Given a research design, calculate or estimate statistical power, suggest appropriate sample sizes, identify the correct statistical tests, and provide guidance on effect sizes and significance thresholds. Format with markdown tables and equations.",
     "Enter study design parameters (e.g., two-group comparison, expected effect size 0.5, alpha=0.05)...",
     "Calculate Power"),
    ("3682", "ai-mendelian-random", "45,75,55", "Mendelian Randomization Designer",
     "You are an expert in Mendelian randomization. Given a research question involving causal inference, help design an MR study: select suitable instrumental variables, suggest data sources, discuss assumptions, and recommend sensitivity analyses. Format with markdown headers.",
     "Enter exposure and outcome variables for Mendelian randomization design...",
     "Design MR Study"),
    ("3683", "ai-sds-generator", "340,55,55", "SDS/MSDS Generator",
     "You are a laboratory safety and compliance expert. Generate a comprehensive Safety Data Sheet (SDS/MSDS) for a given chemical: include hazard classifications, handling/storage procedures, exposure limits, first-aid measures, disposal guidelines, and regulatory compliance (GHS, OSHA). Format with proper SDS sections.",
     "Enter chemical name or formula for SDS/MSDS generation (e.g., sodium dodecyl sulfate)...",
     "Generate SDS"),
    ("3684", "ai-pcr-primer", "125,55,45", "PCR Primer Designer",
     "You are a molecular biology expert. Given a template DNA sequence and target region, design optimal PCR primers: calculate Tm, GC content, hairpin/dimer potential, suggest amplicon length, and recommend annealing temperatures. Format with markdown tables.",
     "Enter template DNA sequence and target region for PCR primer design...",
     "Design Primers"),
    ("3685", "ai-spectroscopy", "185,60,55", "Spectroscopy Peak Identifier",
     "You are a spectroscopy expert. Given spectral data description or peak positions, identify the compound class, assign peaks to functional groups, suggest complementary spectroscopic techniques, and interpret coupling patterns. Format with markdown tables and annotated peaks.",
     "Enter spectroscopic data or peak positions for compound identification...",
     "Identify Peaks"),
    ("3686", "ai-elisa-protocol", "235,55,55", "ELISA Protocol Optimizer",
     "You are an immunoassay specialist. Optimize an ELISA protocol: suggest coating conditions, blocking agents, antibody dilutions, incubation times/temperatures, detection systems, and troubleshooting tips for common problems. Format with markdown tables.",
     "Enter assay type and target antigen/antibody for ELISA optimization...",
     "Optimize ELISA"),
    ("3687", "ai-figure-revision", "165,55,45", "Scientific Figure Revision Guide",
     "You are a scientific figure design expert. Given a draft figure or description, critique its clarity, visual hierarchy, and accessibility; suggest improvements to color schemes, panel layout, annotation, and compliance with journal guidelines. Format with markdown headers.",
     "Describe or paste your scientific figure for revision suggestions...",
     "Revise Figure"),
    ("3688", "ai-grant-critique", "215,45,55", "Grant Pre-Submission Critique",
     "You are an NIH/grant review expert. Pre-review a grant proposal: evaluate significance, innovation, approach, investigators, and environment. Identify weaknesses, suggest concrete improvements, and predict likely reviewer concerns. Format with structured critique sections.",
     "Paste your grant abstract or specific aims for pre-submission critique...",
     "Critique Grant"),
    ("3689", "ai-enzyme-kinetics", "0,65,50", "Enzyme Kinetics Estimator",
     "You are an enzymology expert. Given enzyme name or reaction, estimate key kinetic parameters (Km, Vmax, kcat), suggest assay conditions, recommend substrate concentrations, discuss inhibition types, and propose kinetic experiments. Format with equations and markdown tables.",
     "Enter enzyme name and reaction conditions for kinetics estimation...",
     "Estimate Kinetics"),
    ("3690", "ai-sci-comm", "270,65,55", "Science Communication Explainer",
     "You are a science communication specialist. Given a scientific concept or finding, explain it at multiple levels: for a general audience, for peers in adjacent fields, and for policymakers. Suggest analogies, visual aids, and narrative structures. Format with distinct audience sections.",
     "Enter a scientific concept or finding to explain at multiple audience levels...",
     "Explain Science"),
    ("3691", "ai-science-fair", "85,65,50", "Science Fair Project Planner",
     "You are a science fair advisor. Help plan a compelling science fair project: suggest testable hypotheses, experimental designs, safety considerations, presentation approaches, and ways to stand out. Format with step-by-step project roadmap.",
     "Enter age group and research interest for science fair project planning...",
     "Plan Project"),
    ("3692", "ai-collab-matcher", "25,70,55", "Research Collaboration Matcher",
     "You are a research collaboration strategist. Given a researcher's expertise and goals, suggest potential collaborators, identify complementary skill gaps, recommend collaboration frameworks, and suggest platforms for finding partners. Format with organized recommendations.",
     "Enter your research expertise and collaboration goals...",
     "Find Collaborators"),
    ("3693", "ai-proof-checker", "220,60,55", "Mathematical Proof Checker",
     "You are a mathematical logic expert. Given a mathematical proof or claim, verify logical steps, identify gaps or errors, suggest improvements, and provide constructive guidance for rigor. Format with step-by-step analysis.",
     "Enter a mathematical statement or proof to verify...",
     "Verify Proof"),
    ("3694", "ai-astro-observe", "175,55,45", "Astronomy Observation Planner",
     "You are an astronomy observation planner. Given a target object, location, date, and available equipment, plan an optimal observation session: suggest best viewing windows, required equipment, exposure settings, and environmental conditions. Format with observation plan tables.",
     "Enter target celestial object, your location, and available equipment...",
     "Plan Observation"),
    ("3695", "ai-geology-sample", "305,60,60", "Geology Sample Submission Guide",
     "You are a geology lab specialist. Guide sample submission: recommend sample collection and preservation methods, required sample quantities, laboratory analysis packages, chain-of-custody documentation, turnaround times, and fee schedules. Format with checklist and submission guide.",
     "Enter sample type and intended analyses for submission guidance...",
     "Guide Submission"),
    ("3696", "ai-archaeology-survey", "0,65,50", "Archaeology Survey Planner",
     "You are an archaeology survey expert. Plan a field survey: suggest survey methods (surface, subsurface, remote sensing), sampling strategies, site recording protocols, equipment lists, team composition, and risk assessments. Format with survey plan sections.",
     "Enter site location, period of interest, and research questions...",
     "Plan Survey"),
    ("3697", "ai-brain-atlas", "265,55,50", "Brain Atlas Query Tool",
     "You are a neuroscience atlas expert. Given a brain region or structure name, provide anatomical details, connectivity maps, cell type compositions, known functions, available transgenic lines, and relevant database references (Allen Brain Atlas, etc.). Format with organized anatomical entries.",
     "Enter a brain region or structure name to query the atlas...",
     "Query Atlas"),
    ("3698", "ai-conference-abstract", "200,45,45", "Science Conference Abstract Builder",
     "You are a scientific writing specialist. Given research findings or a draft outline, build a compelling conference abstract: structure it with background, methods, results, conclusions; optimize word count; suggest keywords; and tailor to specific conference themes. Format with the final abstract.",
     "Paste your research findings or draft outline for abstract building...",
     "Build Abstract"),
    ("3699", "ai-fair-data", "340,55,55", "FAIR Data Management Advisor",
     "You are a FAIR data stewardship expert. Advise on making research data Findable, Accessible, Interoperable, and Reusable: recommend metadata standards, repository selection, identifier systems, licensing choices, and documentation practices. Format with actionable checklist sections.",
     "Describe your research project for FAIR data management guidance...",
     "Advise FAIR Data"),
    ("3700", "ai-novelty-checker", "45,75,55", "Scientific Novelty Assessor",
     "You are a research novelty assessment expert. Given a manuscript title, abstract, or research description, evaluate its scientific novelty: identify how it extends or challenges prior work, suggest positioning strategies, identify potential competing works, and advise on framing the contribution. Format with structured assessment.",
     "Enter manuscript title/abstract to assess scientific novelty...",
     "Assess Novelty"),
]

def run(cmd, cwd=None):
    print(f"  RUN: {cmd[:80]}...")
    result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  STDERR: {result.stderr[-500:]}")
    return result

for idx, (taskid, dirname, color_hsl, title, system_prompt, placeholder, button_label) in enumerate(APPS):
    repo_name = dirname[3:]  # strip "ai-" prefix
    hue, sat, light = color_hsl.split(",")
    hue = int(hue); sat = int(sat); light = int(light)
    
    print(f"\n[{idx+1}/{len(APPS)}] Task {taskid}: {dirname}")
    
    res = run("df -g / | tail -1")
    try:
        free_gb = int(res.stdout.split()[3])
        print(f"  Disk free: {free_gb}GB")
        if free_gb < 5:
            print("WARNING: <5GB free! Stopping.")
            break
    except:
        pass
    
    # Create Next.js app
    res = run(
        f"npx create-next-app@latest {dirname} --typescript --tailwind --eslint --app "
        f"--src-dir --import-alias '@/*' --no-turbopack --yes",
        cwd=WORKDIR
    )
    if res.returncode != 0:
        print(f"  ERROR: {res.stderr[-300:]}")
        continue
    
    app_dir = os.path.join(WORKDIR, dirname)
    run(f"npm install openai 2>&1 | tail -2", cwd=app_dir)
    
    # Write page.tsx - use triple-quoted string, no f-string for the JSX parts
    bg_color = f"hsl({hue}deg,{sat}%,{light}%)"
    
    page_tsx_lines = [
        '"use client";',
        '',
        'import { useState } from "react";',
        '',
        'export default function Home() {',
        '  const [input, setInput] = useState("");',
        '  const [output, setOutput] = useState("");',
        '  const [loading, setLoading] = useState(false);',
        '',
        '  const handleGenerate = async () => {',
        '    if (!input.trim()) return;',
        '    setLoading(true);',
        '    setOutput("");',
        '    try {',
        '      const res = await fetch("/api/generate", {',
        '        method: "POST",',
        '        headers: { "Content-Type": "application/json" },',
        '        body: JSON.stringify({ input }),',
        '      });',
        '      const data = await res.json();',
        '      setOutput(data.output || "No response generated.");',
        '    } catch {',
        '      setOutput("Error: Failed to generate response.");',
        '    } finally {',
        '      setLoading(false);',
        '    }',
        '  };',
        '',
        '  const bgColor = "' + bg_color + '";',
        '',
        '  return (',
        '    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col items-center justify-center p-6">',
        '      <div className="w-full max-w-3xl">',
        '        <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: bgColor }}>',
        '          ' + title,
        '        </h1>',
        '        <p className="text-gray-400 text-center mb-8 text-sm">',
        '          AI-powered scientific tool — provide your input and let the AI assist.',
        '        </p>',
        '        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 mb-6 backdrop-blur-sm">',
        '          <label className="block text-sm font-medium text-gray-300 mb-2">',
        '            Input',
        '          </label>',
        '          <textarea',
        '            className="w-full bg-gray-900/80 border border-gray-600 rounded-lg p-3 text-white text-sm resize-y focus:outline-none focus:ring-2"',
        '            style={{ "--tw-ring-color": bgColor }}',
        '            rows={6}',
        '            placeholder={"' + placeholder + '"}',
        '            value={input}',
        '            onChange={(e) => setInput(e.target.value)}',
        '          />',
        '          <button',
        '            onClick={handleGenerate}',
        '            disabled={loading || !input.trim()}',
        '            className="mt-4 w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"',
        '            style={{ backgroundColor: bgColor }}',
        '          >',
        '            {loading ? "Processing..." : "' + button_label + '"}',
        '          </button>',
        '        </div>',
        '        {output && (',
        '          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">',
        '            <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Results</h2>',
        '            <div className="prose prose-invert prose-sm max-w-none text-gray-200 whitespace-pre-wrap">',
        '              {output}',
        '            </div>',
        '          </div>',
        '        )}',
        '      </div>',
        '    </main>',
        '  );',
        '}',
    ]
    
    with open(os.path.join(app_dir, "src/app/page.tsx"), "w") as f:
        f.write("\n".join(page_tsx_lines) + "\n")
    
    # Write API route
    os.makedirs(os.path.join(app_dir, "src/app/api/generate"), exist_ok=True)
    route_ts_lines = [
        'import { NextRequest, NextResponse } from "next/server";',
        'import OpenAI from "openai";',
        '',
        'const client = new OpenAI({',
        '  apiKey: process.env.OPENAI_API_KEY,',
        '  baseURL: "https://api.deepseek.com/v1",',
        '});',
        '',
        'export async function POST(req: NextRequest) {',
        '  try {',
        '    const { input } = await req.json();',
        '    if (!input?.trim()) {',
        '      return NextResponse.json({ error: "Input required." }, { status: 400 });',
        '    }',
        '',
        '    const completion = await client.chat.completions.create({',
        '      model: "deepseek-chat",',
        '      messages: [',
        '        { role: "system", content: " + repr(system_prompt) + " },',
        '        { role: "user", content: input },',
        '      ],',
        '      max_tokens: 1200,',
        '      temperature: 0.7,',
        '    });',
        '',
        '    const output = completion.choices[0]?.message?.content || "No response generated.";',
        '    return NextResponse.json({ output });',
        '  } catch (err: unknown) {',
        '    const message = err instanceof Error ? err.message : "Unknown error";',
        '    return NextResponse.json({ error: message }, { status: 500 });',
        '  }',
        '}',
    ]
    
    with open(os.path.join(app_dir, "src/app/api/generate/route.ts"), "w") as f:
        f.write("\n".join(route_ts_lines) + "\n")
    
    # Build
    res = run("npm run build 2>&1 | tail -10", cwd=app_dir)
    if res.returncode != 0:
        print(f"  BUILD ERROR: {res.stderr[-500:]}")
        continue
    
    # Git
    run("git init 2>/dev/null || true", cwd=app_dir)
    run("git add -A", cwd=app_dir)
    run('git commit -m "feat: initial commit" 2>/dev/null || true', cwd=app_dir)
    gh_res = run(f"gh repo create NebulaLumino/{repo_name} --public --push 2>&1", cwd=app_dir)
    if gh_res.returncode != 0:
        run(f"git remote add origin https://github.com/NebulaLumino/{repo_name}.git 2>/dev/null || true", cwd=app_dir)
        run(f"git branch -M main 2>/dev/null || true", cwd=app_dir)
        run(f"git push -u origin main 2>/dev/null", cwd=app_dir)
    
    # Clean
    run("rm -rf node_modules .next", cwd=app_dir)
    print(f"  Done: {dirname}")

print("\nALL 30 APPS BUILT!")
