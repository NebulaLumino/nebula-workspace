# Prediction Markets & Information Markets: A Research Memo

**Task:** 3525 — Prediction Markets & Information Markets
**Date:** 2026-04-11
**Cycle:** 117
**Format:** Research Memo (2000+ words)

---

## Overview

**Prediction markets** are exchanges where participants trade contracts whose payoffs depend on the outcome of uncertain future events — elections, economic indicators, product launches, disease outbreaks, or geopolitical developments. The core insight of prediction markets is that prices convey information: if a contract paying $1 if Candidate A wins the election is trading at $0.65, the market is implying roughly a 65% probability of that outcome. This price-discovery mechanism aggregates dispersed private information more efficiently than surveys, expert panels, or polls.

**Information markets** is a broader category encompassing prediction markets but also including systems where information itself is the commodity being traded — markets for data, forecasts, and assessments. The distinction between prediction markets and information markets parallels the distinction between bets on outcomes and contracts paying for accurate information.

The academic foundations of prediction markets trace to Friedrich Hayek's 1945 argument that prices aggregate dispersed knowledge, and to the work of economists Martin Shubik, Justin Wolfers, and Robert Hanson at the intersections of information economics and experimental markets. The most famous prediction market in practice was the Iowa Electronic Markets (IEM), operated by the University of Chicago since 1988, which has consistently outperformed polls in predicting election outcomes.

The modern era has seen the rise of platforms like Kalshi (regulated by the CFTC and offering event contracts on economic indicators and sports), Polymarket (crypto-based, offering markets on a wide range of topics), and Metaculus (a forecasting platform using a prediction market-like scoring system). These platforms have generated increasingly credible evidence about the forecasting power of prediction markets.

---

## AI Applications

**Market Design and Mechanism Design.** AI is used to design the rules of prediction markets themselves — optimizing contract structures, settlement mechanisms, and market maker algorithms to maximize information revelation while maintaining liquidity. Research on automated market makers for prediction markets uses machine learning to set pricing curves that balance informativeness against manipulation risk.

**Forecasting Infrastructure.** Platforms like Metaculus, INFER, and Good Judgment Open have developed sophisticated forecasting infrastructure that uses AI to synthesize predictions from human forecasters, generate baseline predictions, and weight forecaster contributions. The "superforecasting" research of Tetlock and Mellers demonstrated that some humans are consistently better forecasters than others, and that AI systems can identify these superforecasters and weight their contributions accordingly.

**Real-Time Information Integration.** Advanced prediction market platforms use NLP to continuously ingest news, social media, and other data streams, identifying information relevant to market prices and potentially triggering automated responses. The integration of real-time data feeds with market pricing creates a system that updates beliefs in response to new information — the core function of a well-designed prediction market.

**Manipulation Detection.** Prediction markets are vulnerable to manipulation — actors who place trades not based on genuine beliefs but to move prices for strategic communication effects. AI systems are being developed to detect manipulation patterns, distinguish informed from uninformed trading, and design markets that are more robust to manipulation attempts.

**AI-Generated Predictions.** Large language models are increasingly being evaluated as predictors. Research has found that LLM predictions often outperform naive baselines but underperform well-calibrated human forecasters on questions requiring specific knowledge or recent information. The integration of AI-generated probabilities into prediction market frameworks — as market maker signals, as input to forecasting tournaments, or as forecaster baselines — is an active research area.

---

## Tools & Methods

**Market Scoring Rules (MSRs).** The theoretical foundation for prediction markets rests on proper scoring rules — mechanisms that incentivize truthful probability reporting. Hanson's logarithmic scoring rule and related mechanisms provide the theoretical basis for how prediction markets aggregate information. The key insight: a market maker who sets prices to be neutral (neither gaining nor losing from trade) creates incentives for traders to reveal their true beliefs.

**Automated Market Makers (AMMs).** Unlike traditional limit-order-book markets, many prediction markets (particularly blockchain-based ones) use AMM mechanisms borrowed from DeFi: a mathematical function determines the price of a contract as a function of the volume of trades. The most common is the log market scoring rule (LMSR), which guarantees liquidity but may be vulnerable to manipulation if trading volumes are low.

**Augur and Omen (Prediction Market Protocols).** These decentralized prediction market protocols running on Ethereum enable anyone to create markets on any topic, with settlement determined by outcome adjudicated by token-holder voting. They represent the most decentralized form of prediction market infrastructure, though they have suffered from low liquidity and occasional governance disputes.

**CFTC-Regulated Platforms.** Since 2022, the CFTC has authorized several prediction market platforms for retail trading, including Kalshi (which trades on economic data releases, sporting events, and policy questions) and Hyperline. These platforms operate under regulatory frameworks that require market integrity protections, customer fund segregation, and disclosure.

**Forecast Verification and Calibration.** Prediction accuracy is evaluated using scoring rules: Brier scores (mean squared error of probability forecasts), log scores (logarithmic scoring rule), and calibration plots (comparing predicted probabilities to observed frequencies). Long-term data from IEM, Metaculus, and other platforms shows that aggregate prediction market forecasts are reasonably well-calibrated but exhibit systematic biases around low-probability events.

---

## Challenges

**Low Liquidity and Thin Markets.** Most prediction markets outside major elections and economic releases have low trading volume, which means prices may not reflect genuine information aggregation but instead the views of a few large traders. The cold-start problem — new markets need liquidity to attract traders, but liquidity needs traders to form — is difficult to solve without subsidies or compelling incentives.

**Manipulation and Information Asymmetry.** Prediction markets on political and policy questions are particularly vulnerable to manipulation by actors with the ability to influence outcomes (e.g., a company that can affect the probability of a regulatory decision it has inside knowledge of). The concern about "insider trading" in prediction markets is not hypothetical: several documented cases exist of trading on non-public information in prediction markets.

**Regulatory Uncertainty.** The CFTC has regulatory authority over prediction markets involving commodities (including economic indicators and many other topics) in the United States. The legal status of various prediction market activities has been unclear, leading some platforms to limit their offerings or operate in legal grey zones. The Kraken-backed prediction market was shut down by the CFTC in 2022, illustrating the regulatory risks.

**The Problem of Complementarity.** Many important questions are not independent — whether a company launches a product successfully depends partly on whether the economy is strong, which depends on Fed policy, which depends on inflation data. Markets on correlated questions can create arbitrage that complicates price interpretation. Designing markets that handle conditional probabilities — "if X happens, what's the probability of Y?" — is technically challenging.

**Superforecaster Overconfidence in Aggregates.** While individual superforecasters exist, aggregate prediction market forecasts can exhibit overconfidence — pricing probabilities that are too extreme — particularly when trading is dominated by a small number of confident participants. This is the "wisdom of crowds" failure mode where the crowd is not diverse enough.

---

## Ethics

**Exploiting Ignorance for Profit.** Prediction markets allow participants to profit from others' misestimation of probability — which requires someone to be on the losing side of a bet. Critics argue that this creates perverse incentives to spread misinformation to move prices in one's favor, or to suppress information that would help others make accurate predictions. The ethics of profiting from others' information disadvantages is not straightforward.

**Markets on Sensitive Questions.** Prediction markets on topics like terrorist attacks, assassination outcomes, or disease mortality raise ethical concerns about incentivizing attention to harmful events and potentially providing platforms for fringe views. While advocates argue that the information in such markets is valuable regardless of topic, the social cost of the attention and potential harm requires careful consideration.

**The Democratic Legitimacy of Prediction Markets.** When prediction markets are used to forecast political events or policy outcomes, they can be seen as undemocratic: a market mechanism gives disproportionate weight to the views of those with capital to bet, rather than to democratic deliberation. This critique is particularly relevant when prediction markets are used by governments or media to characterize public sentiment or the likely effects of policy.

**Accessibility and Fair Access.** Prediction markets can only aggregate the views of those who participate. If participation is skewed toward certain demographics, ideologies, or levels of wealth, the information produced may be systematically biased. The design of prediction markets — who can trade, at what cost, with what information — has significant distributional implications.

**AI and the Future of Information Markets.** As AI agents begin participating in prediction markets (whether as traders, market makers, or orchestrators of markets), new ethical questions arise about the accountability of AI-driven information aggregation. If an AI system produces a market signal that influences policy, who is responsible for the accuracy of that signal?

---

## Future Directions

**Regulatory Clarity and Expansion.** The CFTC's authorization of Kalshi for retail trading and the broader trend toward regulated event-based contracts suggests a trajectory toward greater regulatory clarity. More topics are likely to become available for trading as regulators gain comfort with the social value of prediction markets.

**Integration with AI Forecasting Systems.** The next generation of prediction markets is likely to feature deep integration with AI forecasting tools — LLMs providing baseline forecasts, AI agents participating as traders, and sophisticated market maker algorithms that incorporate diverse information sources. Projects at the intersection of prediction markets and AI are attracting significant venture investment.

**Decentralized Prediction Market Infrastructure.** Continued development of decentralized prediction market protocols — with improved UX, faster settlement, and better liquidity mechanisms — could eventually produce prediction markets that are as accessible and liquid as sports betting markets, with the social value of information aggregation that entails.

**Corporate and Government Adoption.** Forward-thinking organizations are beginning to use internal prediction markets for forecasting — internal markets where employees can bet on project outcomes, product launches, or organizational metrics. The US intelligence community's use of prediction markets (through the Policy Analysis Market and related programs) has been controversial but continues to generate interest.

**Information Markets Beyond Predictions.** The broader concept of information markets — trading not just on outcomes but on the accuracy of analyses, expert opinions, and data — points toward future systems where the value of information is continuously priced. If realized, this would represent a fundamental change in how knowledge is valued and produced.

---

*This research memo provides a high-level overview of prediction markets and information markets. Participation in prediction markets involves financial risk and is subject to applicable regulations.*
