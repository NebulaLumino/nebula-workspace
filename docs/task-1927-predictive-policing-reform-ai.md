# Explore AI Agents in Predictive Policing Reform & Criminal Justice AI

*Curiosity Research — Task 1927 | Cycle 64: AI x Social Impact, Nonprofits & Social Entrepreneurship*

---

## Overview

The use of AI in criminal justice — from predictive policing to risk assessment instruments to facial recognition — has become one of the most contested applications of technology in society. Predictive policing systems that claim to forecast crime before it occurs, risk assessment instruments used in bail and sentencing decisions, and facial recognition for suspect identification all raise profound questions about fairness, accountability, and the nature of justice itself. This research explores the current state of AI in criminal justice, the documented harms, the reform movement, and the emerging approaches that aim to apply AI more equitably.

---

## The Landscape of Criminal Justice AI

### Predictive Policing

Predictive policing uses AI to forecast where crimes are likely to occur or who is likely to commit or be victimized by crime. Two main approaches exist:

**Place-based prediction**: AI analyzes historical crime data, environmental factors, and real-time indicators to predict geographic "hot spots" where police should concentrate patrol resources.

**Person-based prediction**: More controversial, this approach attempts to predict which individuals are likely to commit crimes or be involved in crime — based on social network analysis, prior interactions with the justice system, demographic factors, and behavioral data.

### Risk Assessment Instruments (RAIs)

Risk assessment instruments are algorithmic tools used at various stages of the criminal justice process:
- **Pre-trial**: Predicting likelihood of reoffending or failing to appear in court to inform bail decisions
- **Sentencing**: Providing judges with recidivism risk scores to inform sentencing
- **Parole**: Informing parole board decisions about release readiness
- **Probation**: Guiding supervision intensity

The most widely debated is the **COMPAS (Correctional Offender Management Profiling for Alternative Sanctions)** system, developed by Equivant (formerly Northpointe), used in multiple US states. COMPAS generates risk scores based on 137 questionnaire items and was the subject of a landmark 2016 ProPublica investigation that found systematic racial disparities in its predictions.

### Facial Recognition

AI-powered facial recognition is used by law enforcement for:
- Suspect identification
- Real-time surveillance (watchlists in public spaces)
- Immigration enforcement
- Retail loss prevention

Facial recognition accuracy disparities across race and gender — particularly poor accuracy for dark-skinned women — have been extensively documented in studies by MIT's Joy Buolamwini and others.

### AI for Justice Reform

Not all AI in the criminal justice system is used for enforcement. AI agents are also being deployed to:
- Identify wrongful convictions through pattern analysis
- Optimize public defender caseloads
- Recommend pre-trial release based on public safety analysis
- Assess prison conditions and prisoner welfare

---

## Documented Harms & Criticisms

### Racial Disparities
The most consistent finding across criminal justice AI is racial disparity. Studies have found:
- Predictive policing systems over-target minority neighborhoods because they are over-policed — creating a feedback loop
- COMPAS risk scores are 2x more likely to falsely flag Black defendants as high-risk compared to white defendants
- Facial recognition systems have error rates up to 34% for dark-skinned women vs. <1% for light-skinned men

### False Positives and Wrongful Targeting
Person-based predictive policing systems generate large numbers of false positives — people predicted to commit crimes who never would. These false positives disproportionately affect disadvantaged communities and can become self-fulfilling prophecies: a person repeatedly stopped and searched by police who was never going to commit a crime may have their life destabilized to the point where crime becomes more likely.

### Lack of Transparency ("Black Box" Problem)
Many criminal justice AI systems are proprietary, making their inner workings opaque to defendants, courts, and oversight bodies. This creates profound due process problems: how can a defendant challenge an algorithm's conclusion if they cannot understand how it reached that conclusion?

### Feedback Loops
Criminal justice AI systems create self-reinforcing feedback loops. Areas with more policing produce more arrests → more data → AI identifies these areas as high risk → more policing. This circular logic means that initial police deployment decisions become baked into AI forecasts, regardless of whether they were justified.

---

## The Reform Movement

### Bans and Moratoriums

**US facial recognition bans**: Over 20 US cities have banned or restricted facial recognition for law enforcement, including San Francisco, Boston, and Portland. The EU's proposed AI Act would ban real-time facial recognition in public spaces in most circumstances.

**Predictive policing bans**: Several cities and countries have banned predictive policing, including Santa Cruz, CA; Freiburg, Germany; and the UK (which has no predictive policing in operation, though it was trialled).

**Illinois RIPA**: Illinois' AI Video Interview Act requires employers using AI analysis of video interviews to notify applicants and obtain consent — the first law regulating AI in hiring.

### Algorithmic Accountability Legislation

**New York City's Local Law 144**: Requires annual bias audits of AI tools used in hiring and promotion, with results posted publicly. While focused on employment AI, it is being watched as a model for other domains.

**Colorado AI Act**: Colorado passed legislation requiring insurance companies to be transparent about AI used in coverage decisions and to audit for discriminatory outcomes.

**EU AI Act**: The EU's comprehensive AI regulation categorizes criminal justice AI as "unacceptable risk" (prohibited) in many applications — setting a high standard that other jurisdictions may follow.

### Technical Reform Efforts

**Bias auditing**: Third-party algorithmic auditing organizations (e.g., Orkan, Algorithm Justice League) are developing methodologies for independently evaluating criminal justice AI systems for fairness and accuracy.

**Open-source alternatives**: Reform-oriented organizations are developing open-source, auditable alternatives to proprietary criminal justice AI — including the Arnold Foundation's research on pre-trial risk assessment.

**Differential impact analysis**: Requiring that criminal justice AI systems demonstrate equal accuracy across demographic groups before deployment — akin to employment discrimination's "disparate impact" standard.

---

## AI Agents for Justice Reform

Perhaps the most hopeful application of AI in this domain is using AI to advance justice rather than just efficiency:

### Wrongful Conviction Detection

AI agents are being used to analyze:
- Witness testimony patterns (identifying impossible witness sequences)
- Forensic evidence quality (flagging unreliable forensic methods like hair microscopy or bite mark analysis)
- Prosecutorial charging patterns (identifying cases where charges were filed with insufficient evidence)
- Public defender resource allocation (ensuring adequate representation)

**Case Study — The Innocence Project:**
The Innocence Project uses AI-assisted review of cases involving inmates claiming wrongful conviction. Pattern analysis helps prioritize cases with the strongest evidence of innocence.

### Prosecutorial Accountability

AI agents that analyze prosecutorial decision-making to identify:
- Racial disparities in charging decisions
- Cases where evidence thresholds for charges were not met
- Patterns of Brady violations (withholding exculpatory evidence)

### Bail Reform

AI systems designed to promote pre-trial liberty — recommending release in cases where detention is not necessary for public safety, rather than defaulting to detention. These systems face the same technical challenges as risk assessment instruments but are designed with different goals.

---

## Key Organizations

| Organization | Focus | AI Application |
|---|---|---|
| AI Now Institute | Research & advocacy | Algorithmic accountability research |
| Algorithm Justice League | Civil rights | Algorithmic audits, legal advocacy |
| Upturn | Policy research | Criminal justice AI reform |
| The Innocence Project | Wrongful conviction | AI-assisted case review |
| Electronic Frontier Foundation | Digital rights | Surveillance AI opposition |
| Partnership on AI | Multi-stakeholder | Responsible AI development |

---

## The Path Forward: 3-5 Year Horizon

1. **Mandatory algorithmic impact assessments**: Before deploying criminal justice AI, jurisdictions will require formal assessments of potential disparate impact — similar to environmental impact assessments.

2. **Real-time bias monitoring**: AI systems that continuously monitor deployed systems for disparate impact, rather than point-in-time audits — enabling course correction before widespread harm occurs.

3. **Explainability requirements**: Courts and regulators will increasingly require that criminal justice AI systems provide meaningful explanations for their outputs — not just scores but the reasoning behind them.

4. **Community oversight bodies**: New forms of community governance over criminal justice AI — including community representation in procurement decisions and ongoing oversight committees with real authority.

5. **Rehabilitation-focused AI**: AI agents designed around rehabilitation and reentry success rather than risk prediction — focused on how to help people succeed in communities rather than how to predict their failure.

---

## Key Questions for Future Research

- Can AI systems designed with community input and accountability structures actually reduce racial disparities in criminal justice, or will they always encode existing biases?
- What due process rights should defendants have regarding the AI systems used against them?
- Is it possible to build AI systems that are accurate, fair, and transparent simultaneously, or do these goals inherently conflict in practice?
- How do we balance public safety benefits of AI-assisted policing with civil liberties concerns?

---

*This research document was generated as part of Cycle 64 of the AI App Fleet — AI x Social Impact, Nonprofits & Social Entrepreneurship.*
