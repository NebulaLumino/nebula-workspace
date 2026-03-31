# 1806 — Explore AI Agents in Age Verification & Minor Protection Online

## Introduction

The internet was not designed with children in mind, but children use it extensively. Approximately 71% of children under 18 in developed countries use social media, often beginning before the minimum age of most platforms (typically 13, corresponding to COPPA's requirement for parental consent for under-13 data collection in the US). The challenge of verifying that users are who they claim to be — particularly that they are adults when platforms require adult status — has proven remarkably difficult to solve technically and legally. AI agents are increasingly central to both the age verification problem and the minor protection debate, as both the tools attempting to solve the problem and as potential vectors for circumventing it.

## The Regulatory Landscape

### COPPA (United States)

The Children's Online Privacy Protection Act (1998) requires operators of websites and online services directed to children under 13, or those with actual knowledge that they are collecting information from children under 13, to:
- Provide clear and direct notice to parents of data collection practices
- Obtain verifiable parental consent before collecting, using, or disclosing a child's personal information
- Allow parents to review and delete their child's information
- Maintain reasonable security for children's data

COPPA's enforcement by the FTC has produced significant fines: $5.7 billion against Google/YouTube (2019), $275 million against Epic Games/Fortnite (2022), and numerous others. The FTC's 2024 COPPA rulemaking proposed strengthening age-appropriate design requirements.

### Age-Appropriate Design Code / Online Safety Act (UK)

The UK's **Children's Code** (2020, fully in force 2024) applies to online services likely to be accessed by children and requires:
- High privacy settings by default for child users
- No profiling of children by default (only with necessary and justified reasons)
- Age-appropriate application of the code, with a "safety by default" principle
- Data minimization: only collect minimum personal data necessary
- No "nudge" techniques that encourage children to weaken their privacy

The **Online Safety Act 2023** creates a broader framework for protecting children online, imposing duties on service providers to prevent children from encountering "priority" harmful content (including content that encourages self-harm, suicide, or child sexual abuse material).

### EU DSA and AI Act

The **Digital Services Act (DSA)** (2023) prohibits targeting minors with advertising based on profiling and requires very large online platforms (VLOPs) to assess systemic risks, including risks to minors. The **EU AI Act** classifies AI systems used to determine access to education or employment as high-risk, and emerging interpretations suggest that certain AI systems used to moderate content accessible by minors may face additional requirements.

### Australia

Australia's **Online Safety Act 2021** establishes a complaints-based framework for harmful content, and the eSafety Commissioner has issued industry codes covering age verification and harmful content. Australia's proposed **Under-16 Social Media Ban** (2024) represents the most aggressive age restriction approach globally, prohibiting under-16s from using social media platforms, though implementation remains challenging.

## The Age Verification Problem

Verifying that a user is an adult is technically harder than it appears:

**Self-declaration**: Most platforms rely on users to truthfully input their birthdate — easily circumvented by children who enter false dates.

**ID verification**: Requiring government ID is legally complex (raises privacy concerns, excluded populations without ID), operationally expensive, and creates security risks from storing ID data.

**Biometric age estimation**: AI-based age estimation from facial features offers a non-authenticating middle ground — confirming that the person presenting appears to be an adult without storing biometric data or requiring ID documents. Services like Yoti provide age estimation APIs with documented accuracy rates.

**Payment card verification**: Using payment card ownership as an adult proxy — a technically reliable method — excludes unbanked adults and creates friction for legitimate users.

**Device-level verification**: Parental device authorization, family account systems (Apple Screen Time, Google Family Link), and carrier-based age verification are proxy methods that work at the device level but don't solve the problem for shared devices.

## AI Agents as Age Verification Tools

AI agents can be deployed to:

**Monitor behavioral signals**: Age-inappropriate content engagement patterns, language used in communications, and interaction patterns can provide probabilistic signals about user age. This approach is controversial — it constitutes profiling of minors, potentially violating children's privacy laws in multiple jurisdictions.

**Age estimation from content**: AI systems analyzing user-generated content (voice in audio, appearance in video, writing style in text) can estimate user age with varying degrees of accuracy. These systems must be carefully evaluated for bias across demographics.

**Automated content filtering**: AI agents can moderate content to prevent minors from accessing adult material — a legitimate protective use. But the same AI moderation systems can be used to suppress political speech or facilitate censorship.

## AI Agents as Minor Safety Risks

AI chatbots and agents present specific minor safety concerns:

**Manipulation risks**: AI companions and chatbots designed for adult users can be accessed by minors, potentially exposing them to inappropriate conversations. Several cases of minors engaging with AI romantic companions have raised concerns about emotional manipulation and the development of unhealthy relationships with AI systems.

**Recommendation algorithms**: AI agents that recommend content to users can create filter bubbles and rabbit holes — the documented phenomenon where YouTube and TikTok recommendation systems progressively suggest more extreme content, which can be particularly harmful to developing minds.

**Synthetic content generation**: AI agents that can generate text, images, and increasingly video create risks of non-consensual intimate imagery of minors (the most serious form of child sexual abuse material), sextortion, and the creation of synthetic identities.

**Bypass capabilities**: AI agents can potentially be used to help minors circumvent age verification systems — for example, by providing instructions for accessing age-restricted services or generating fake identification documents.

## The Age-Appropriate Design Problem

Beyond age verification, AI systems face a subtler challenge: designing AI interactions that are age-appropriate for younger users who do access services. This requires:

**Developmental stage considerations**: AI agents interacting with 13-year-olds should not provide the same responses as those interacting with adults — yet building age-appropriate AI at scale is technically demanding.

**Informed consent from minors**: Even with parental consent, children cannot meaningfully consent to complex AI data processing practices in the way adults can. UK Children's Code requires that services likely to be accessed by children be designed with children's best interests as the primary consideration.

**AI literacy**: Helping minors understand they are interacting with an AI, not a human, is a stated goal of transparency requirements, but research suggests children often anthropomorphize AI systems in ways that make this difficult.

## Technical Approaches: Age Assurance Ecosystem

The emerging technical ecosystem for age assurance includes:

**Age check vs. age estimation**: Age *check* (definitively determining age through credentials) vs. age *estimation* (probabilistic estimation from biometric or behavioral signals) represent fundamentally different approaches with different privacy implications.

**Privacy-preserving age verification**: Zero-knowledge proofs and tokenized age credentials could allow users to prove they are over a threshold age without revealing their exact age or identity — theoretically enabling age verification without creating centralized databases of user identities.

**Open standards**: The **PAbIL** (Privacy-Enhancing Age Assurance) working group and emerging W3C standards for age-appropriate content are attempting to create interoperable technical standards that balance privacy with safety.

## Conclusion

Age verification and minor protection online represent one of the most technically challenging and legally complex areas of AI governance. The problem is not just verifying age at account creation but maintaining age-appropriate experiences throughout a user's lifecycle on a platform. AI agents simultaneously offer the most promising technical solutions (biometric age estimation, behavioral analysis, content moderation) and the most concerning risks (manipulation, recommendation rabbit holes, synthetic content generation). The most durable solutions will likely combine technical age assurance with strong organizational governance — platform-level policies that treat minor safety as a design constraint, not a compliance afterthought.

**Word count: ~700**
