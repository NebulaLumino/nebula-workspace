# 1808 — Explore AI Agents in Patent Search & Prior Art Discovery AI

## Introduction

Patent law grants inventors exclusive rights to their inventions for a limited period — typically 20 years from filing — in exchange for public disclosure of the invention. This bargain only works if the disclosure is complete enough to enable other skilled practitioners in the field. The requirement that an invention be "novel" (not anticipated by prior art) and "non-obvious" (not an obvious modification of existing knowledge) means that prior art — all public knowledge before the patent filing date — is the central concept around which patentability revolves. AI agents are transforming how prior art is discovered, how patentability assessments are made, and how patent offices manage the flood of applications filed globally each year.

## The Prior Art Problem

The global patent system produces over 3 million patent applications per year. Each application must be searched against the entire corpus of global prior art — existing patents, published applications, scientific literature, technical standards, conference proceedings, product documentation, and even social media posts. Human patent examiners are overwhelmed: the EPO's patent examiners handle approximately 40-50 cases each at any given time, with targets of completing searches in a few hours per application.

This creates a fundamental quality problem: if prior art exists but isn't found during examination, a patent may be granted erroneously, creating a "bad patent" that blocks legitimate competition and innovation.

## AI-Powered Patent Search

### Semantic and Vector Search

Traditional keyword patent search is fundamentally limited: inventors and examiners must guess which terms the prior art uses to describe the same invention. An AI system for generating photovoltaic cells might use "photovoltaic," "solar cell," "PV module," or dozens of other terms — missing any one of which could mean missing relevant prior art.

AI patent search systems use transformer-based models (often fine-tuned on patent corpus) to encode patent documents as vectors in a high-dimensional semantic space. Documents with similar vectors are semantically similar even when they use different vocabulary. A search for "autonomous vehicle obstacle avoidance" can retrieve prior art that discusses "self-driving car collision prevention" without those exact words appearing.

Systems like **Google Patents** use semantic search to surface related patents beyond exact keyword matches. **PatSnap**, **Lens.org**, and **CPA Global** (now Clarivate) have invested heavily in AI search capabilities.

### AI Agents for Prior Art Discovery

AI agents take patent search beyond passive retrieval:

**Iterative search**: An AI agent can analyze search results, identify promising concepts in retrieved documents, reformulate queries based on discovered concepts, and iterate — autonomously refining the search strategy until prior art is identified or the agent determines the search space has been adequately covered.

**Claim mapping**: AI agents can analyze patent claims — the legally operative part of a patent that defines the scope of protection — and map them against prior art documents, identifying specific passages that anticipate or render obvious each claim element.

**Landscape analysis**: Beyond individual prior art searches, AI agents can provide landscape views of entire technology areas — identifying dominant patent holders, white space (areas with low patent density), emerging technology trends, and potential infringement risks.

**Freedom-to-operate**: AI agents can conduct FTO analysis by searching the patent landscape to identify patents that might read on a proposed product or process, providing risk assessments and potential licensing paths.

## The Patent Eligibility Problem: AI and Section 101

In the United States, patent claims are subject to the judicially created exclusions of patent eligibility under 35 U.S.C. Section 101: abstract ideas, natural phenomena, and laws of nature are not patentable unless tied to a particular inventive application.

The Supreme Court's *Alice Corp. v. CLS Bank* (2014) established the two-part test: first, determine whether the claim is directed to an abstract idea; second, determine whether the claim contains an inventive concept that transforms the abstract idea into patentable subject matter.

AI-generated inventions occupy an uncomfortable space in this framework. If an AI agent autonomously invents a new molecule, the question of whether this is patent-eligible chemical invention or mere chemical discovery has no clear answer. Similarly, AI-generated software inventions face the same abstract idea problem as other software patents.

The USPTO's 2024 guidance on AI-assisted inventions attempted to clarify the standard: AI assistance does not render an invention abstract, but an invention that is merely the abstract idea of "training a neural network" without specific application is not patent-eligible. The guidance is evolving and creates significant uncertainty for AI-assisted R&D.

## Inventorship and Ownership of AI-Assisted Inventions

The question of who is the "inventor" of an AI-assisted invention is legally thorny. Most patent statutes define inventor as a natural person — the human who conceived of the invention. When an AI agent proposes solutions that no human directly conceived, traditional inventorship doctrine doesn't directly apply.

Several approaches have emerged:

**Human contribution theory**: Only the human contributions — framing the problem, evaluating AI outputs, selecting among options — constitute inventorship. This is the approach the USPTO and most patent offices have tentatively adopted.

**AI-as-tool theory**: An AI agent is merely an advanced tool, analogous to a computer program, and the human directing the AI's use is the inventor. This is the current working assumption but becomes strained as AI agents become more autonomous.

**AI inventorship**: Some have argued that sufficiently sophisticated AI agents should be recognized as inventors. The UK's Intellectual Property Office initially accepted an AI agent ("DABUS") as inventor in two patent applications, but the courts rejected this approach, holding that only natural persons can be inventors under UK law.

The USPTO's requirement that AI-assisted invention disclosures identify all human contributors, and that assignment documents (transferring ownership from inventor to employer) name only human parties, currently provides the operational framework — but the underlying legal theory remains contested.

## AI in Patent Office Operations

Patent offices worldwide are deploying AI to address their backlog of pending applications:

**Automated prior art search**: The EPO's EPOQUE and ESPACENET systems, and the USPTO's Patent Examination AI, use AI to suggest prior art references to human examiners, who retain final decision-making authority.

**Automated classification**: AI systems automatically classify patent applications by technology area (International Patent Classification codes), routing applications to the appropriate examiner specialties.

**Figure suggestion**: AI systems can suggest which technical drawings best illustrate the invention, based on analysis of the claim language.

**Quality control**: AI-assisted review of granted patents can identify potential quality issues for post-grant review.

The IPO (UK), EPO, and USPTO have all published policies emphasizing that AI assists but does not replace human examiners — maintaining human accountability for patent decisions while leveraging AI efficiency.

## Prior Art in the AI Training Data Question

A new frontier in AI patent law relates to whether the use of training data in developing AI models constitutes a prior art problem. If an AI model is trained on data that includes patented inventions, and the model subsequently generates outputs that practice those inventions — is this "use" of the prior art patent?

This question has significant implications for AI development: training on copyrighted or patented data without license may create downstream liability if the model's outputs infringe. The first-inventor defense under 35 U.S.C. Section 102(g) — which credits knowledge of an invention by another in the US before the patent filing date — may also be affected by AI training on public data that includes the prior art.

## Conclusion

AI agents are transforming patent practice from the laboratory to the courtroom. In prior art search, AI's ability to process semantic meaning rather than keywords is a genuine advance over keyword search — one that will improve patent quality by reducing the probability that relevant prior art is missed. In patent examination, AI assistance is becoming standard, with human examiners retaining final authority. The harder questions — who is the inventor of an AI-assisted invention, what is the proper scope of AI-assisted claims under Section 101, and whether AI training creates prior art issues — remain genuinely unsettled, with courts and patent offices developing answers that will shape innovation incentives for decades.

**Word count: ~700**
