# Tax Policy Automation & Open Source Tax Systems: A Research Memo

**Task:** 3524 — Tax Policy Automation & Open Source Tax Systems
**Date:** 2026-04-11
**Cycle:** 117
**Format:** Research Memo (2000+ words)

---

## Overview

Tax systems are among the most consequential and complex institutions in modern economies. They fund government operations, redistribute income, shape economic incentives, and reflect fundamental societal choices about the balance between public goods and private consumption. Yet tax compliance is a multi-hundred-billion dollar industry, and tax law has become so complex that even professional tax preparers regularly disagree on what the law requires. This complexity creates an opportunity for **automation** — and a tension with democratic accountability, since tax law encodes value judgments that should ideally be made transparently and publicly.

**Tax Policy Automation** refers to the use of technology to implement, administer, and enforce tax policy. This includes automated tax filing systems (like the IRS Free File program), algorithmic audit selection, real-time withholding and reporting systems, and emerging experiments with "smart" tax systems that adjust rates or enforcement based on economic conditions.

**Open Source Tax Systems** represent a more radical vision: making the code that implements tax law publicly available, auditable, and collaboratively developed. The premise is that tax law — like software — is a set of rules that should be precisely specified, publicly accessible, and testable. Proponents argue that open tax code would reduce errors, increase compliance, lower the cost of tax preparation, and make democratic participation in tax policy more meaningful.

The intersection of tax policy and automation also raises fundamental questions about accountability: when an AI system makes an audit determination, who is responsible? When an algorithm implements a tax policy with unintended consequences, who bears the blame?

---

## AI Applications

**Automated Tax Preparation and Filing.** The most widespread AI application in taxation is automated tax preparation. Systems like TurboTax, H&R Block, and TaxAct use AI to interview taxpayers, identify applicable deductions and credits, check for common errors, and file returns electronically. The IRS itself has experimented with "Direct File" — a government-operated free filing system that would compete with commercial preparers — which launched in pilot form in 2024 for certain simple return types. AI-powered preparation can reduce errors and increase refund accuracy, but critics argue that it normalizes a system where compliance is the taxpayer's burden rather than the government's.

**Algorithmic Audit Selection.** The IRS uses discriminant index function (DIF) scores to prioritize audit selection. Machine learning models trained on historical audit outcomes can potentially identify non-compliance more accurately than rule-based systems — but they also inherit the biases of historical audit data, which has systematically over-audited low-income and minority taxpayers. The Treasury Department's decision to restore IRS enforcement capacity after years of budget cuts has raised the political stakes around algorithmic audit selection.

**Tax Law Interpretation by LLMs.** Large language models are being experimented with for tax law research — identifying applicable authorities, analyzing grey areas, and generating draft advice. The IRS has begun using AI to help answer taxpayer inquiries. Law firms and accounting firms use AI tools to analyze tax positions and draft memoranda. The accuracy and reliability of these systems for legal analysis is an active area of research.

**Real-Time Tax Calculation.** Some countries have moved toward real-time tax withholding and reporting — where taxes are calculated and collected at the point of transaction rather than annually. This approach reduces the end-of-year reconciliation burden and can reduce non-compliance. The technology challenges include handling irregular income (self-employment, gig work) and ensuring that real-time withholding accurately reflects annual tax liability.

**Transfer Pricing and International Tax AI.** Multinational corporations' internal transactions (intercompany loans, IP licensing, service agreements) must be priced at arm's length for tax purposes. Transfer pricing rules are among the most complex in tax law, and transfer pricing disputes are among the most expensive. AI systems can help model arm's length pricing ranges, identify transfer pricing risk, and generate documentation — though the fundamental judgment calls remain with human experts.

**VAT/GST Compliance Automation.** Value-added tax systems in the EU and elsewhere require businesses to track and remit taxes on each transaction. AI-powered VAT compliance tools automate the calculation, reporting, and filing of VAT returns across jurisdictions, identify missing or incorrect VAT recoveries, and monitor changes in VAT rules across the 27 EU member states.

---

## Tools & Methods

**Open Source Tax Engines.** Several open source projects attempt to implement tax law computationally. The OpenFisca project (originated in France, now used in multiple countries) provides open source tax and benefit simulators that encode tax law as code. It is used by governments (French Ministry of Finance, UK HM Revenue & Customs for modeling), civil society organizations, and researchers. Tax-Cruncher (by policyengine us) implements US tax law for policy analysis. The Open Source Policy Center at UC Berkeley's Fisher Center for Tax Administration has developed open source tax filing tools.

**Benefits of Open Tax Code.** Open tax implementations make the law precise: unlike prose descriptions, code must be exact. They enable policy simulation — asking "what if" questions about tax changes before they are enacted. They can reduce the power of tax preparation software companies to encode their own interpretations into the preparation process. They enable civic technologists to build tax tools that serve the public interest rather than commercial interests.

**Limitations of Open Tax Code.** Tax law requires judgment calls that resist algorithmic encoding: what constitutes a "business purpose"? Is a transaction "ordinary"? Does a position have "substantial authority"? These determinations require interpretation, not just computation. Additionally, tax law changes frequently, and open source implementations require ongoing maintenance. Finally, tax law contains deliberate ambiguities — the product of legislative compromise — that are intentionally left to IRS guidance and court interpretation.

**International Tax Data.** The OECD's BEPS (Base Erosion and Profit Shifting) project has generated new transparency requirements: Country-by-Country Reporting (CbCR) requires large multinationals to report revenue, profit, and tax paid in each country where they operate. The OECD Pillar Two rules (global minimum tax of 15%) represent the most significant overhaul of international tax rules in a century, with significant implementation challenges.

---

## Challenges

**The Complexity Problem.** The US tax code is approximately 7,000 pages of statutory text, plus tens of thousands of pages of Treasury regulations, IRS guidance, and case law. Much of this complexity reflects decades of special interest provisions, political compromises, and efforts to close loopholes that were themselves created by prior legislation. Simplification is politically difficult because every simplification also eliminates some benefits that powerful constituencies have come to rely on.

**Compliance Costs.** The IRS estimates that taxpayers spend approximately 6.1 billion hours complying with tax requirements annually, with an associated compliance cost of over $400 billion. This burden falls disproportionately on small businesses and self-employed individuals who lack the accounting infrastructure of large corporations. Tax simplification and automation could substantially reduce this burden, but political obstacles are formidable.

**The Tax Preparation Industry's Political Power.** Intuit, H&R Block, and other tax preparation companies have successfully lobbied against the IRS offering free direct filing to taxpayers — the "Free File" program was a compromise where the IRS agreed not to compete with private preparers in exchange for preparers offering free filing to low-income taxpayers. The repeated failures to pass legislation creating a government-run "return-free" filing system reflect the political power of the tax preparation industry.

**International Tax Competition.** Nations compete for mobile corporate tax bases by lowering rates and offering preferential regimes. This "race to the bottom" in corporate taxation has reduced the effective tax burden on multinational corporations while increasing it on less-mobile factors like labor and consumption. The OECD Pillar Two global minimum tax represents a multilateral attempt to arrest this competition, but its implementation across 140+ countries with varying administrative capacities remains highly challenging.

**Tax Avoidance vs. Evasion.** The line between legal tax avoidance and illegal evasion is contested and shifts over time. Aggressive tax planning — using the complexity of tax law to minimize tax in ways not contemplated by policymakers — creates economic distortions and erodes the tax base. Detecting and counteracting aggressive tax planning requires continuous investment in IRS enforcement capacity and regulatory guidance.

---

## Ethics

**Who Bears the Tax Burden?** Tax systems embody distributional choices: progressive taxes (higher rates on higher incomes) transfer burden from the wealthy to lower-income groups; regressive taxes (sales taxes, payroll taxes) have the opposite effect. These choices are fundamentally political. Automation of tax policy should not obscure these value judgments — when an algorithm determines audit priorities or calculates withholding, it is implementing a distributional judgment that was made by policymakers.

**The Democratic Deficit in Algorithmic Tax Decisions.** When an AI system makes a determination that affects a taxpayer's liability — audit selection, penalty assessment, refund timing — the taxpayer has limited ability to understand or contest the decision. This "black box" quality of algorithmic tax administration raises due process concerns. The right to know why a tax authority is taking action against you is a fundamental principle of rule of law.

**International Tax Justice.** The ability of multinational corporations to shift profits to low-tax jurisdictions means that the benefits of globalization accrue disproportionately to capital owners and highly skilled workers in rich countries, while the costs — reduced government revenue — fall on public services in the countries losing tax base. This is a global justice issue that tax policy automation cannot solve without fundamental changes to international tax rules.

**The Ethics of Tax Simplicity.** If tax law is simplified — reducing deductions, credits, and special provisions — the simplification itself has distributional effects. Many tax expenditures disproportionately benefit higher-income taxpayers. Eliminating them would increase revenue and could fund public services or reduce other taxes. But it would also eliminate benefits that some middle-class taxpayers depend on. The ethics of simplification require attention to what replaces complexity.

---

## Future Directions

**Government Direct Filing.** The political trajectory toward government-operated direct tax filing systems is likely to continue as the Direct File pilot expands and other countries' systems (like the UK's Making Tax Digital) demonstrate feasibility. AI can help improve the usability of these systems, making them competitive with commercial preparers for increasingly complex returns.

**Open Source Tax Policy Modeling.** As open source tax engines mature, they are likely to become standard tools for policy analysis. The ability to precisely simulate the effects of tax changes before enactment — for distributional analysis, revenue estimation, and behavioral response modeling — will improve democratic deliberation about tax policy.

**The OECD Pillar Two Implementation.** The global minimum tax (15% for large multinationals) is being implemented across participating countries. This is the most significant change in international tax rules in a generation, and its implementation will require sophisticated technology for compliance, reporting, and dispute resolution. Countries are building new administrative infrastructure to implement the rules.

**AI-Assisted Tax Research and Planning.** LLMs and specialized tax AI tools will increasingly assist tax professionals in identifying planning opportunities, analyzing risk, and drafting advice. The quality and reliability of these tools will depend heavily on training data quality and the ability to distinguish settled law from contested positions.

**Blockchain and Real-Time Taxation.** Some advocates propose blockchain-based tax systems where transactions are automatically taxed at the point of execution, eliminating the annual filing requirement. While technically intriguing, the implementation challenges — handling barter, services, cross-border transactions, and tax treatment of losses — are substantial. More immediately, real-time reporting requirements (as in the EU's ViDA proposals for e-invoicing) will begin to shift tax administration toward continuous rather than annual cycles.

---

*This research memo provides a high-level overview of tax policy automation and open source tax systems. Tax decisions should be made in consultation with qualified tax professionals.*
