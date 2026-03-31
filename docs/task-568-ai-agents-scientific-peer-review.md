# AI Agents in Scientific Peer Review

## The Peer Review Bottleneck

Scientific peer review — the process by which submitted research manuscripts are evaluated by domain experts before publication — is a cornerstone of scientific integrity. But it is also profoundly bottlenecked. The volume of scientific publications has grown exponentially; reviewer fatigue is endemic; and the process typically takes 6-18 months from submission to publication. AI agents are being deployed at nearly every stage of the review pipeline, with significant promise and considerable controversy.

## Screening for Methodological and Statistical Flaws

The most established application is AI-assisted manuscript screening. Tools like **Paperpal** (Elsevier), **Writefull**, and **Scite** use large language models to identify:

- **Statistical errors**: Underpowered studies, inappropriate statistical tests, missing corrections for multiple comparisons
- **Methodological concerns**: Flawed experimental design, missing controls, reproducibility issues
- **Logical inconsistencies**: Claims not supported by the data presented
- **Citation accuracy**: Whether cited claims actually appear in the referenced papers

These tools operate as first-pass reviewers, flagging issues before human experts review the manuscript. The goal is not to replace human reviewers but to reduce their workload by catching obvious issues upfront.

## Plagiarism and Image Manipulation Detection

**iThenticate** and **Turnitin** are well-established tools for detecting text plagiarism. More recently, AI has been applied to **image manipulation detection** — identifying spliced Western blots, duplicated microscopy images, and other photographic forgeries in scientific papers. **ImageTwin** and tools built into major publishers' submission systems now run AI image forensics on submitted figures.

The problem of AI-generated fake papers — complete with fabricated data and references — is emerging as a new frontier. AI agents must now also detect papers that were largely written by AI, raising deep questions about what scientific communication is for.

## Reviewer Matching Systems

Matching submitted manuscripts to qualified reviewers is itself a complex optimization problem. Semantic Scholar (Allen Institute for AI) and similar platforms use AI to match papers to reviewers based on publication history, topical expertise, and recent citation patterns. This addresses the common problem of manuscripts being reviewed by non-experts or researchers with conflicts of interest.

## The AI-Reviewing-AI-Papers Debate

A profound question is emerging: should AI-reviewed papers (those written with significant AI assistance) be reviewed differently or held to different standards? If a paper was 80% written by an LLM, does its contribution warrant publication? There is no consensus. Some journals require AI use disclosure; others argue that what matters is scientific validity, not writing method. The **Retraction Watch** database shows a rising tide of AI-assisted papers being retracted — suggesting that AI writing assistance can mask methodological problems.

## Open Science Implications

AI peer review tools have significant implications for open science. If AI agents can analyze the entire corpus of scientific literature continuously, they could:
- Identify contradictory findings across papers
- Detect systematic bias in published results
- Flag papers with statistical anomalies consistent with p-hacking
- Build real-time evidence maps for clinical and policy questions

This could represent a shift from periodic peer review to continuous scientific quality assessment — a profound upgrade to how science self-corrects.

## Key Tools and Platforms

- **Paperpal** (Elsevier): Language and technical editing with review capabilities
- **Writefull**: Language model for academic writing and review assistance
- **Scite**: AI that shows how papers have been cited (supporting vs. contrasting)
- **Semantic Scholar**: AI-powered academic search and reviewer matching
- **iThenticate / Turnitin**: Plagiarism and AI-generated text detection
- **ImageTwin**: Scientific image manipulation detection
