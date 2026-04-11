# Insurance Underwriting & Actuarial Science: A Research Memo

**Task:** 3527 — Insurance Underwriting & Actuarial Science
**Date:** 2026-04-11
**Cycle:** 117
**Format:** Research Memo (2000+ words)

---

## Overview

Insurance is the financial mechanism by which risk is transferred from an individual to a pool, with premiums paid by many offsetting the losses of the few. The mathematical backbone of insurance is **actuarial science** — the discipline that applies mathematical, statistical, financial, and probabilistic methods to assess and manage uncertainty in insurance and financial enterprises. **Underwriting** is the process by which insurers evaluate, select, and price risks — deciding whether to insure a particular applicant, at what premium, and under what terms.

The actuarial profession dates to the 18th century, when the Equitable Life Assurance Society in London employed mathematicians to calculate premiums for life insurance based on mortality tables. Today, actuaries work across life insurance, property and casualty insurance, health insurance, reinsurance, and pension funds. The profession is regulated, with credentialing bodies including the Society of Actuaries (SOA) in the United States, the Institute and Faculty of Actuaries (IFoA) in the UK, and equivalent bodies in virtually every major economy.

The insurance industry manages enormous sums: global insurance premiums exceeded $6 trillion in 2023, with life insurance accounting for roughly 55% and property-casualty for 45%. Insurance enables economic activity that would otherwise be too risky to undertake — from home ownership (mortgage insurance) to international trade (marine and aviation insurance) to the healthcare system (health insurance).

---

## AI Applications

**Machine Learning in Underwriting.** Traditional underwriting relies on human underwriters applying rules and judgment to applicant information. Machine learning models — trained on historical policy and claims data — are increasingly used to automate and augment underwriting decisions. These models can process far more variables than human underwriters and identify non-linear relationships between applicant characteristics and risk. However, they also inherit biases from historical data and raise regulatory concerns about explainability.

**Telematics and Usage-Based Insurance.** In auto insurance, telematics devices (or smartphone apps) collect data on driving behavior — speed, braking, acceleration, time of day, miles driven. AI analysis of this data enables pay-per-mile insurance (Metromile) and accurate risk-based pricing that rewards safe drivers. This represents a fundamental shift from collective risk pooling (where premiums reflect the average risk of a class) to individualized pricing.

**Predictive Claims Modeling.** AI systems that predict which claims are likely to be fraudulent — using natural language processing of claim descriptions, computer vision analysis of damage photos, and anomaly detection in claims patterns — can reduce losses and allow faster processing of legitimate claims. The challenge is balancing fraud detection sensitivity against the risk of denying legitimate claims.

**Life Insurance and Biomarkers.** The life insurance industry is exploring blood-based biomarkers, genetic information (with significant regulatory constraints), and continuous health monitoring data (from wearables) to refine mortality risk assessment. The rapid improvement in liquid biopsy technology for cancer screening is particularly relevant for life insurers. This raises profound ethical questions about genetic discrimination and the boundaries of insurability.

**Catastrophe Modeling.** For property insurance in high-catastrophe zones (hurricane, earthquake, flood), AI-powered catastrophe models combine climate science, building exposure data, and vulnerability functions to estimate probable maximum loss (PML). Companies like AIR Worldwide (Verisk), RMS, and Karen Clark & Company provide catastrophe modeling software used by insurers, reinsurers, and regulators.

---

## Tools & Methods

**Actuarial Mathematics.** The core actuarial tools include probability theory (especially extreme value theory for modeling catastrophes), survival analysis (for life insurance and health), credibility theory (for combining individual and collective experience), and loss reserving methods (Chain-Ladder, Bornhuetter-Ferguson) for estimating future claim liabilities.

**Mortality and Morbidity Tables.** The foundational data structure in life and health actuarial work is the life table — a demographic model showing, for each age, the probability of surviving to the next age and the expected number of survivors. These tables, derived from historical population mortality data, are adjusted by insurers for their specific insured population (select mortality) and projected into the future (projection scales).

**Pricing Methods.** Insurance premiums are calculated using the principle of equivalence: premiums should be sufficient to pay all expected claims plus expenses, with a margin for profit and contingencies. For life insurance, net premiums are calculated by equating the present value of future benefit payments to the present value of future premium payments. For property-casualty, loss cost pricing uses historical loss ratios adjusted for trend, development, and catastrophe exposure.

**Underwriting Guidelines and Classification Systems.** Insurers use underwriting guidelines that categorize risks into classes with standard, substandard, or declined status. For life insurance, key classification factors include age, sex, health history, family medical history, occupation, avocation (risky hobbies), and financial underwriting (income and net worth relative to coverage sought). For auto insurance, key factors include age, driving record, vehicle type, location, and credit-based insurance scores.

**Reinsurance.** Reinsurance — insurance that insurers buy from other insurers — is a critical risk management tool. reinsurers like Munich Re, Swiss Re, and Hannover Re provide capacity for large risks and catastrophe exposure. The actuarial analysis of reinsurance programs involves modeling the distribution of aggregate losses, determining optimal retention levels, and pricing reinsurance treaties (proportional, excess of loss, or catastrophe excess of loss).

---

## Challenges

**Adverse Selection.** Insurance works best when risks are randomly distributed across the pool. Adverse selection occurs when individuals with higher-than-average risk are more likely to seek insurance (or more likely to buy comprehensive coverage) than lower-risk individuals. If insurers cannot accurately price for this selection, they attract disproportionately high-risk applicants and losses mount. This is the fundamental challenge of individual underwriting: you need to collect enough information to accurately price risk without making the process so intrusive that low-risk individuals opt out.

**Moral Hazard.** Once insured, individuals have less incentive to prevent losses — a phenomenon called moral hazard. In health insurance, this manifests as increased healthcare utilization. In auto insurance, it manifests as less cautious driving. In property insurance, it manifests as reduced investment in loss prevention. Managing moral hazard requires policy design features like deductibles, co-payments, and coverage limits that preserve incentives for loss prevention.

**Climate Change and Model Uncertainty.** Climate change is creating non-stationarity in catastrophe risk models — the historical data used to calibrate hurricane, flood, and wildfire models is no longer representative of future risk. The insurance industry faces a fundamental challenge: premiums that accurately reflect current risk may be unaffordable, while premiums that are affordable may be insufficient to cover future losses. This has led to insurer withdrawals from high-risk markets (California wildfire, Florida hurricane) and calls for government backstop mechanisms.

**Algorithmic Bias in Underwriting.** When ML models are trained on historical insurance data, they can encode and automate historical discrimination — for example, using zip code or credit score as a proxy for race. The Consumer Financial Protection Bureau and state insurance regulators have begun to scrutinize algorithmic discrimination in insurance underwriting, but the frameworks for assessing disparate impact in insurance are less developed than in credit.

**Pandemic Risk and Systemic Correlation.** Traditional actuarial models assume that risks are independent across policyholders. Pandemics, like COVID-19, create perfect positive correlation — everyone is affected simultaneously. This makes pandemic risk effectively uninsurable through standard mechanisms, requiring government involvement as a backstop (as seen in the Paycheck Protection Program and enhanced unemployment insurance in the US). The actuarial challenge of modeling correlated, systemic risks remains largely unsolved.

---

## Ethics

**Genetic Information and Pre-Existing Conditions.** The use of genetic information in underwriting raises fundamental questions about the boundaries of insurability. If insurers can charge higher premiums to individuals with genetic predispositions to disease, this effectively penalizes people for their inherited characteristics — the opposite of insurance's risk-pooling function. The Genetic Information Nondiscrimination Act (GINA) in the US restricts genetic testing use in health insurance and employment, but gaps remain for life insurance and long-term care insurance.

**The Ethics of Risk Classification.** Insurance underwriting necessarily involves classifying people into risk categories and charging different prices based on those classifications. Some risk factors (age, sex) are statistically predictive but raise fairness concerns. The question of which characteristics it is legitimate to use in risk classification — and which represent impermissible discrimination — is deeply contested. Gender pricing in auto insurance (where young men pay more than young women) has been banned in some jurisdictions but remains common in others.

**Algorithmic Opacity.** When ML models are used in underwriting, the basis for decisions can be opaque — to applicants, to regulators, and even to the insurers themselves. The right to know why a premium was set at a particular level — and the right to contest that determination — has due process implications that current practices do not adequately address.

**The Affordability of Insurance.** Insurance is most needed by those least able to afford it — low-income households who face disproportionate exposure to risks (older housing in flood zones, older vehicles without advanced safety features). The tension between actuarial fairness (pricing based on true risk) and social equity (ensuring insurance is accessible to all) is a fundamental policy challenge.

---

## Future Directions

**Embedded Insurance.** The distribution of insurance is shifting from standalone policies toward embedded coverage — insurance packaged with products and services. Car manufacturers offerGAP insurance and tire-and-wheel coverage; ride-sharing platforms offer accident coverage; retailers offer protection plans. This trend is enabled by API-based insurance platforms (InsurTech) that can issue policies in milliseconds at point of sale.

**Autonomous Vehicles and Auto Insurance.** As vehicles become more autonomous, liability shifts from drivers to manufacturers and software providers. This fundamentally changes the risk pool — individual driver behavior becomes less relevant, while software reliability, sensor performance, and cybersecurity become paramount. The insurance industry is actively modeling the transition and developing products for autonomous vehicle fleets.

**Parametric Insurance.** Rather than indemnifying actual losses (the traditional insurance model), parametric insurance pays predetermined amounts when specified trigger events occur — for example, a hurricane making landfall within 50 miles of a location with sustained winds above 100 mph. Parametric products offer faster payment and certainty, but basis risk (the payout may not match actual losses). AI and satellite data are enabling more sophisticated parametric triggers.

**AI Underwriting and Regulation.** As AI underwriting matures, regulators face the challenge of ensuring fairness, explainability, and accountability in algorithmic decision-making. The EU AI Act classifies insurance underwriting as high-risk AI, subject to transparency and human oversight requirements. Similar regulatory frameworks are emerging in the US through state insurance commissioners.

**Health and Longevity.** The integration of continuous health monitoring data (wearables, smartwatches, continuous glucose monitors) into life and health insurance underwriting is the next frontier. Insurers offering premium discounts for healthy behavior based on wearable data (Vitality, John Hancock) are early examples. The long-term trajectory may be toward fully individualized, continuously updated health risk profiles.

---

*This research memo provides a high-level overview of insurance underwriting and actuarial science.*
