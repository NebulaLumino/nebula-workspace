# 1810 — Explore AI Agents in Right to Be Forgotten & Digital Erasure AI

## Introduction

The "right to be forgotten" — the right of individuals to request that certain information about them be removed from public availability — represents one of the most philosophically complex and technically challenging applications of privacy law. Unlike traditional privacy rights that protect information from being collected, the right to erasure (Article 17 GDPR) and its equivalents in other jurisdictions operate on information that has already been published, processed, and distributed. When AI agents enter the picture — capable of retaining information across interactions, training on vast datasets, and generating outputs that encode that information in model weights — the right to erasure becomes genuinely difficult to operationalize.

## The Legal Foundations

### GDPR Article 17: Right to Erasure

Article 17 GDPR ("Right to erasure / 'Right to be forgotten'") establishes:

> "The data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her without undue delay and the controller shall have the obligation to erase personal data..."

This obligation applies when:
- The data is no longer necessary for the purposes it was collected
- The data subject withdraws consent and there is no other legal basis for processing
- The data subject objects to processing and there are no overriding legitimate interests
- The data has been unlawfully processed
- The data must be erased for compliance with a legal obligation

### The Practical Scope Problem

Article 17 creates an immediate practical question: who is the "controller"? The AI agent itself — the system generating outputs — may or may not be a controller depending on whether it exercises autonomous control over processing. In most AI deployments, the deploying organization is the controller, with the AI system as a processor. But as AI agents become more autonomous in deciding what to retain and generate, the boundary blurs.

### CJEU: Google Spain (2014)

The landmark *Google Spain v. AEPD and Mario Costeja González* (2014) decision by the Court of Justice of the EU established that Google, as a search engine operator, is a data controller and must delist links to information that is "inadequate, irrelevant or no longer relevant, or excessive in relation to the purposes of the processing at issue." This established the "right to delisting" — removal from search results — as distinct from deletion of the underlying data.

### Right to Delisting vs. Right to Erasure

The Google Spain ruling created a right to disappear from search results that is more expansive than Article 17 erasure of the underlying data. The information remains online — it just becomes harder to find. This distinction is critical for AI agents:

- A web search AI agent can be asked to delist certain URLs from its results
- A generative AI agent trained on that data cannot simply "delist" information encoded in its model weights — the relationship between training data and model outputs is not directly tractable

### Other Jurisdictions

**Argentina**: Recognized a right to be forgotten in the Google Spain aftermath, with Argentina's Supreme Court recognizing privacy rights in online search contexts.

**Japan**: The Act on the Protection of Personal Information (APPI) was amended to recognize erasure rights.

**California**: The CPRA (California Privacy Rights Act) creates a right to delete personal information, with exceptions for legal compliance, security, and public interest.

**Brazil**: LGPD recognizes a right to deletion of personal data.

**UK**: Post-Brexit UK GDPR retains Article 17 equivalent.

**India**: The Digital Personal Data Protection Act (2023) creates a right to erasure, though implementation rules are still being developed.

## The AI Agent Complication

AI agents create several specific complications for the right to erasure:

### Training Data Retention

LLM-based AI agents are trained on vast datasets — billions of web pages, books, articles, and conversations. When the training data includes personal information about an individual, the question of whether "erasure" can be achieved by retraining is non-trivial:

**Retraining cost**: Retraining a large language model from scratch costs millions of dollars and weeks of compute time — making individual erasure requests practically impossible to fulfill by retraining.

**Catastrophic forgetting**: If retraining is done to remove specific individuals, the model may lose important capabilities — "catastrophic forgetting" where removing one thing removes too much.

**Data provenance**: Do AI developers even know what data was used to train their models? Many training datasets are compiled from web crawls without full data provenance tracking.

### Model Editing and Machine Unlearning

The field of machine unlearning addresses the technical problem of selectively forgetting information encoded in trained models:

**Gradient-based editing**: Techniques like ROME (Rank-One Model Editing) and MEMIT can update specific facts in large language models without full retraining. These approaches show promise for targeted erasure.

**Influence functions**: Theoretical approaches to measuring how much each training example contributed to a model's output, enabling targeted forgetting.

**Differential privacy**: Training with differential privacy guarantees that no individual training example's influence can be determined — but this is a statistical guarantee, not a guaranteed deletion of specific facts.

As of 2026, machine unlearning remains an active research area. No deployed AI system can reliably guarantee that specific personal information has been completely removed from a trained model.

### Generative Output Erasure

Even if an AI agent's training data doesn't contain specific personal information, it may generate outputs that infringe the right to erasure — for example, reproducing defamatory statements or personal information that was legitimately removed from the web.

**Output filtering**: AI agents can be configured to refuse to generate outputs containing specific information — but this is filtering, not erasure of the underlying knowledge.

**Real-time inference controls**: AI agents can be configured to apply erasure requests at inference time — refusing to provide certain outputs — without modifying the underlying model. This is functionally similar to Google Spain delisting: the information is still "known" but not generated.

## The "Echo Chamber" Problem

When a piece of information has been widely published and has entered the training data of multiple AI systems, no single erasure request fully addresses the harm. The information may still appear in outputs from other AI systems, other search engines, and the original sources that have not been removed. This creates an asymmetry: a defamatory statement that was once online may never be fully erased from all AI systems that were trained before the erasure request.

## Regulatory Guidance on AI and Erasure

### EDPB Opinion 05/2024

The European Data Protection Board issued guidance on the application of GDPR to LLMs, noting that:
- Processing personal data during LLM training constitutes data processing under GDPR
- Data subjects retain rights regarding their data in training sets
- However, the practical implementation of Article 17 in the LLM context presents "technical and practical challenges"

The EDPB has not issued definitive guidance on how Article 17 applies to model weights — this remains an open question.

### CNIL and French Enforcement

The French CNIL has investigated AI companies for GDPR compliance in the training data context. In 2024, the CNIL issued guidance distinguishing between:
- Training data that is publicly available online (with which individuals had no opportunity to object)
- Training data from sources where individuals had some expectation of consent or control

### ICO (UK) Guidance

The UK ICO has similarly noted the challenges of applying erasure rights to AI training data, noting that "technical solutions" are being developed but not yet mature enough for definitive regulatory guidance.

## The Consent and Legitimate Interest Problem

Even when erasure requests are technically feasible, they raise competing interests:

**Freedom of expression**: An erasure request for information that is factually accurate and matters to public discourse (e.g., information about a public figure's conduct in office) may conflict with freedom of expression. GDPR Article 17 explicitly does not apply where processing is necessary for exercising the right of freedom of expression and information.

**Journalistic and academic exemptions**: Most GDPR erasure exemptions apply to processing "for journalistic purposes or the purpose of academic, artistic or literary expression" — creating a complex framework for AI systems used in journalism or research.

**Public interest**: Erasure is not required where processing is "necessary for archiving purposes in the public interest, scientific or historical research purposes, or statistical purposes."

## Technical Solutions Being Developed

**Watermarking of training data**: Techniques for marking training data so that its influence on the model can be identified and potentially removed — currently research-stage.

**Selective training**: Training models with erasure guarantees from the start, using techniques like machine unlearning during training rather than as a post-hoc fix.

**Inference-time filtering**: Configuring AI agents to apply erasure requests at output time — the most practical current approach, though it addresses outputs rather than model knowledge.

**Federated learning with local erasure**: Training AI models without centralizing personal data, so erasure means simply not including data in future training rounds — applicable to certain use cases but not the dominant LLM training paradigm.

## Conclusion

The right to be forgotten, applied to AI agents, reveals a fundamental tension between the immutability of trained model weights and the fluidity of human reputation and privacy. Information that was legitimately published in one context may become harmful in another — and AI systems trained on that information carry it forward indefinitely. Current legal doctrine recognizes the right but lacks enforcement mechanisms for AI systems. Technical solutions (machine unlearning, inference-time filtering) are promising but immature. The most likely near-term outcome is a regulatory framework that requires AI deployers to implement reasonable erasure mechanisms — including inference-time filtering and documented data provenance — while acknowledging that complete erasure from trained models is not currently technically feasible. As AI systems become more capable and more consequential, resolving this tension will become increasingly urgent.

**Word count: ~700**
