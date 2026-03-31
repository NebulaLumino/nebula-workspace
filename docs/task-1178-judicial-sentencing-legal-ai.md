# Task 1178 — Explore AI Agents in Judicial Sentencing & Legal Reasoning AI

## Status: ✅ ✅ Complete

## AI Agents in Judicial Sentencing & Legal Reasoning AI

Courts across the United States and globally are experimenting with — and in some cases actively deploying — AI systems that assist in sentencing decisions. This is perhaps the most consequential and contested application of AI in the legal system: determining human liberty based on algorithmic risk scores.

### Risk Assessment Tools in Sentencing

Several U.S. states use **Risk Assessment Instruments (RAIs)** as sentencing aids:

**COMPAS (Correctional Offender Management Profiling for Alternative Sanctions)** — The most well-known, used in Wisconsin, New York, and other states. COMPAS generates risk scores (1-10) for recidivism based on 137 questionnaire items. ProPublica's 2016 investigation found COMPAS had significant racial disparities — Black defendants were far more likely to be flagged as high-risk incorrectly.

**PSA (Public Safety Assessment)** — Used in thousands of U.S. courts. Generates risk scores for violence, new criminal activity, and failure to appear. Less controversial than COMPAS but still algorithmically opaque.

**LS/CMI (Level of Service/Case Management Inventory)** — Used in federal courts and many states. Assesses criminogenic needs across 8 domains.

### How AI Risk Assessment Works

These tools use statistical models trained on historical sentencing and re-offense data:

```
Training Data: 100,000 past defendants + 5-year recidivism outcomes
     ↓
Model: Logistic regression / Random forest trained on ~100 features
     ↓
Output: Risk score (1-10) + risk factors flagged
```

The problem: if historical policing and sentencing data encoded racial bias, the AI trained on that data will encode and perpetuate that bias.

### Large Language Models as Legal Reasoning Assistants

A newer frontier: LLM-based AI agents that can:

- **Generate case summaries** from millions of legal documents
- **Identify relevant precedents** from case law databases
- **Draft judicial opinions** (currently used as drafts for judges to revise, not as final decisions)
- **Explain legal reasoning** — Translating opaque risk scores into natural language explanations

The 2023-2024 U.S. federal courts have been exploring (and in some cases restricted from using) AI tools for case management, research, and opinion drafting.

### Sentencing Guidelines AI Assistants

The U.S. Federal Sentencing Guidelines provide formulas for calculating sentencing ranges. AI agents are now:
- Analyzing PSR (Presentence Reports) to identify guideline application issues
- Modeling sentencing outcomes under different guideline interpretations
- Flagging potential Brady violations (exculpatory evidence not disclosed)
- Predicting appellate success probability for sentencing appeals

### The Explainability Problem

A core constitutional challenge: **Can a judge sentence based on a risk score they cannot explain?**

The 2016 *State v. Loomis* case in Wisconsin held that using COMPAS at sentencing was constitutional as long as it was one factor among many — but the majority acknowledged the difficulty of explaining algorithmic risk scores to defendants.

### Global Perspectives

| Country | Status |
|---------|--------|
| UK | Used in bail decisions; banned from sole sentencing basis |
| EU | GDPR Article 22 restricts automated decision-making in criminal proceedings |
| Australia | Used in some states for parole decisions |
| China | Social credit + criminal risk assessment integrated |
| Estonia | AI judges for small claims up to €7,000 |

### The Attorney AI Challenge

Meanwhile, defendants' attorneys are deploying AI to:
- **Challenge risk assessments** by identifying biased features in the model
- **Simulate counterfactual outcomes** (what if the defendant had grown up in a different zip code?)
- **Generate sentencing mitigation briefs** using LLM analysis of defendant's life history

The result is an AI arms race within the courtroom itself — prosecution AI vs. defense AI — with the judge serving as the arbitrator between two algorithmic narratives.
