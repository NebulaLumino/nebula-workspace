import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { serviceProvider, clientName, serviceType, monthlyRetainer, contractLength, startDate, scope } = await req.json();
    if (!serviceProvider?.trim() || !clientName?.trim()) {
      return NextResponse.json({ error: "Service provider and client name are required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert freelance business consultant and legal document specialist for professional services contracts.`,
        },
        {
          role: "user",
          content: `Generate a comprehensive retainer agreement / professional services contract for:

**Service Provider / Consultant:** ${serviceProvider}
**Client Name:** ${clientName}
**Type of Service:** ${serviceType || "Digital marketing, consulting, creative services, or software development"}
**Monthly Retainer Amount:** ${monthlyRetainer || "$5,000 - $15,000/month"}
**Contract Length:** ${contractLength || "6 months (renewable)"}
**Start Date:** ${startDate || "Upon signing"}
**Scope of Work:** ${scope || "Strategic consulting, campaign management, reporting, and optimization"}

Generate a complete, legally-structured retainer agreement covering ALL of the following sections:

## 1. Retainer Agreement — Full Contract

Generate a formal, professional contract with the following numbered sections:

---

**RETAINER AGREEMENT**

This Retainer Agreement ("Agreement") is entered into as of ${startDate || "[DATE]"} by and between:

**SERVICE PROVIDER:** ${serviceProvider}
**CLIENT:** ${clientName}

### RECITALS
(2-3 sentences on why both parties are entering this agreement)

### 1. SERVICES PROVIDED
Detailed description of all services included in the retainer:
- [Specific service 1]
- [Specific service 2]
- [Specific service 3]
- [Specific service 4]

### 2. TERM AND TERMINATION
- **Initial Term:** ${contractLength || "6 months"} from the Effective Date
- **Renewal:** This Agreement shall automatically renew for successive [X]-month periods unless either party provides written notice of non-renewal at least 30 days prior to the end of the then-current term
- **Termination for Cause:** Either party may terminate this Agreement immediately upon written notice if the other party materially breaches any provision and fails to cure such breach within 15 days of receiving written notice
- **Termination for Convenience:** Either party may terminate this Agreement upon [30/60] days' written notice without cause

### 3. RETAINER FEE AND PAYMENT TERMS
- **Monthly Retainer Fee:** ${monthlyRetainer || "[$X,XXX] per month"}
- **Payment Schedule:** Due on the 1st of each month, payable within 15 days of invoice
- **Late Payment:** Any amounts unpaid after [15] days of the due date shall bear interest at [1.5% per month] or the maximum rate permitted by law
- **Invoice Frequency:** [Monthly in advance / Monthly in arrears]
- **Payment Method:** [Wire transfer, ACH, check]

### 4. SCOPE OF WORK AND DELIVERABLES
Define what the retainer covers — be specific:

**Included in Retainer:**
- [Deliverable / service description]
- Monthly hours included: [X] hours
- Response time: [X] business hours

**Not Included (Billable Separately):**
- Additional services beyond scope
- Out-of-scope projects
- Rush turnarounds

### 5. HOURS, CAPACITY, AND AVAILABILITY
- **Dedicated Hours per Month:** [X] hours
- **Rollover Policy:** Unused hours [do / do not] roll over to the following month
- **Excess Usage:** Additional hours beyond the monthly allocation shall be billed at [hourly rate]
- **Scheduling:** Client shall provide [minimum notice] for dedicated blocks of time

### 6. INTELLECTUAL PROPERTY
- **Pre-Existing IP:** Each party retains ownership of their pre-existing intellectual property
- **Work Product:** Upon full payment, all deliverables created specifically for Client under this Agreement shall be owned by [Client / Provider — choose model]
- **Provider Portfolio Rights:** Provider may display completed work in their portfolio and marketing materials (with Client's prior written consent for confidential projects)

### 7. CONFIDENTIALITY
- Both parties agree to maintain strict confidentiality of proprietary information
- Confidential information shall not include publicly available information
- Confidentiality obligations survive termination of this Agreement for [2] years

### 8. NON-SOLICITATION
- During the term and for [12] months following termination, neither party shall directly solicit employees or contractors of the other party

### 9. REPRESENTATIONS AND WARRANTIES
- Provider represents they have the skills and resources to perform the Services
- Client represents they have the authority to enter into this Agreement
- Disclaimer of warranties for outcomes (unless guaranteed results are explicitly stated)

### 10. LIMITATION OF LIABILITY
- Total liability under this Agreement shall not exceed the total fees paid in the [3 months preceding the claim / 12 months preceding the claim]
- Neither party shall be liable for indirect, incidental, consequential, or punitive damages

### 11. INDEPENDENT CONTRACTOR
- Provider is an independent contractor, not an employee
- Provider shall be solely responsible for all taxes, benefits, and insurance
- Client shall not withhold any taxes from payments to Provider

### 12. DISPUTE RESOLUTION
- **Governing Law:** [State/Country]
- **Negotiation:** Parties agree to attempt good-faith negotiation before any other action
- **Arbitration/Mediation:** [Optional — specify if applicable]
- **Attorneys' Fees:** The prevailing party in any dispute shall be entitled to recover reasonable attorneys' fees

### 13. FORCE MAJEURE
- Neither party shall be liable for delays caused by circumstances beyond their reasonable control (natural disasters, pandemics, etc.)
- The affected party must notify the other party within [5] business days

### 14. ENTIRE AGREEMENT AND AMENDMENTS
- This Agreement constitutes the entire agreement between the parties
- Any amendments must be in writing and signed by both parties
- This Agreement supersedes all prior discussions and agreements

---

**SIGNATURES:**

| | |
|---|---|
| **SERVICE PROVIDER:** | **CLIENT:** |
| ${serviceProvider} | ${clientName} |
| Signature: _______________ | Signature: _______________ |
| Name: | Name: |
| Title: | Title: |
| Date: | Date: |

## 2. Statement of Work (SOW) Template

A separate, attachable Statement of Work document for each project or phase:

**Statement of Work #1 — [Project Name]**

| Field | Details |
|-------|---------|
| SOW Number | SOW-001 |
| Client | ${clientName} |
| Provider | ${serviceProvider} |
| Effective Date | ${startDate || "[DATE]"} |
| Estimated Duration | [X weeks/months] |
| Estimated Hours | [X hours] |
| Fee | $[X] |

**Objectives:** [What success looks like]

**Scope:**
- [In scope item 1]
- [In scope item 2]

**Deliverables:**
1. [Deliverable 1 — due date]
2. [Deliverable 2 — due date]

**Assumptions:**
- [Client will provide X by Y date]
- [Any other assumptions]

## 3. Retainer Modifiers / Addendum

For common add-on clauses:
- **Hourly Rate Card** (for overage billing)
- **Exclusivity Clause** (if retainer includes exclusive access)
- **Volume Discount Schedule** (if committing to higher monthly spend)
- **Minimum Commitment Guarantee** (client commits to minimum term)

## 4. Client Onboarding Checklist

What to collect from the client at contract signing:
- [ ] Signed agreement
- [ ] Payment method / billing details
- [ ] Primary contact information
- [ ] Brand guidelines / assets
- [ ] Access credentials (if applicable)
- [ ] Kickoff meeting scheduled

## 5. Retainer Management Best Practices

- How to track hours and deliverables
- How to communicate scope clearly each month
- How to handle scope creep
- How to present monthly reports / value summaries
- When and how to propose retainer increases

Make this comprehensive and professional. Use actual legal language where appropriate. Include specific dollar amounts and timelines based on the inputs provided.`,
        },
      ],
      max_tokens: 1600,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Contract generation failed." }, { status: 500 });
  }
}
