import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { productName, targetAudience, demoType, salesTeamSize, followUpMedium } = await req.json();
    if (!productName?.trim()) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert B2B sales strategist and demo conversion specialist.`,
        },
        {
          role: "user",
          content: `Generate a comprehensive demo request follow-up sequence for:

**Product Name:** ${productName}
**Target Audience:** ${targetAudience || "B2B buyers, VP/Director level, SaaS companies"}
**Demo Type:** ${demoType || "Live product demo (30-60 min), recorded demo, interactive sandbox, or pilot"}
**Sales Team Size:** ${salesTeamSize || "Small team (1-3 SDRs/AEs), need scalable sequences"}
**Primary Follow-up Medium:** ${followUpMedium || "Email + phone, email only, LinkedIn + email, SMS + email"}

Generate ALL of the following:

## 1. Demo Request Follow-Up Sequence Overview

### The Opportunity
- What happens after someone requests a demo (ideal state)
- Why most demo requests go cold (top 3 reasons)
- What a high-converting demo follow-up sequence looks like

### Sequence Architecture
- How many touches in the sequence
- Over what timeframe
- Which channels (email, phone, LinkedIn, SMS)
- When to escalate to a sales rep vs stay in SDR cadence

## 2. Full Follow-Up Email Sequence (6 Emails)

For each email provide: subject line (5 options), preview text, email body (full copy, 100-150 words), CTA, and timing.

### Email 1: Immediate Confirmation (Send within 5 minutes)
- Acknowledge the demo request
- Confirm what they signed up for
- Set expectations (when they'll hear back, who will reach out)
- CTA: Confirm their calendar link or ask to book time

### Email 2: Social Proof + Value (Send 2-4 hours later)
- Why ${productName} is trusted by companies like theirs
- 1-2 specific results or outcomes achieved
- CTA: Book demo time if not yet booked

### Email 3: Educational / Thought Leadership (Send day 2)
- Relevant insight or case study relevant to their likely pain point
- Not selling — providing value first
- CTA: Read case study / Watch 2-min video

### Email 4: Demo Teaser (Send day 4)
- Give them a preview of what the demo will cover
- Specific things they'll see that solve their problem
- CTA: "Here's exactly what you'll see in the demo" + link to book

### Email 5: Breaking Through Silence (Send day 7)
- Acknowledge they may be busy
- Offer to send a recorded demo instead
- Lower the friction — shorter meeting, async option
- CTA: Reply "SEND VIDEO" for a 5-min recorded walkthrough

### Email 6: Final Attempt / Exit (Send day 10-14)
- Warm close — no pressure
- Keep the door open for the future
- Offer to reconnect in 3 months
- CTA: Simple reply or link to newsletter/community

## 3. Phone/Voicemail Scripts

### Script 1: Day 1 — Initial Call (After demo request)
- Who to ask for
- What to say in 30 seconds
- How to leave a voicemail
- Best time to call (morning vs afternoon)

### Script 2: Day 3 — Follow-up Call
- How to re-engage
- What to say if they say they're busy
- How to push to a specific demo time

### Script 3: Breakup Email Alternative (Day 6)
- Send if phone calls go unanswered
- How to reframe from "chasing" to "offering value"

## 4. LinkedIn Outreach Sequence

### Connection Request (Day 1)
- Connection note (short, personalized — reference the demo request)
- Keep under 300 characters

### LinkedIn Message 1 (Day 2)
- Follow up after they accept
- 3-5 sentence message
- CTA

### LinkedIn Message 2 (Day 6)
- If no response to Message 1
- Softer, value-add approach

## 5. SMS Sequence (if applicable)

### SMS 1: Day 1 (after demo request)
- "Hi [Name], thanks for requesting a demo of [Product]. I'll reach out shortly to schedule — what's the best time to connect?"

### SMS 2: Day 3 (if no reply)
- "Hi [Name], just following up on your [Product] demo request. Still interested? Happy to work around your schedule."

### SMS 3: Day 7 (final)
- "Last note from me on the demo — happy to send over a quick video overview if timing isn't right. Let me know!"

## 6. Objection Handling

For common demo-related objections, provide specific responses:
- "We're not ready to buy right now"
- "We've already seen a competitor's demo"
- "I need to check with my team/boss"
- "Send me some information and I'll get back to you"
- "The timing isn't right"
- "Your pricing is too high"

## 7. Demo Booking Optimization

### Confirmation Page Best Practices
- What to show on the demo booking confirmation page
- How to upsell/cross-sell at confirmation

### Calendar Invite Best Practices
- What to include in the calendar invite
- Pre-demo homework to send

### Pre-Demo Email (Send 24hr before)
- What to include (agenda, who will be there, how to prepare)
- How to set the tone for a high-converting demo

## 8. Demo-to-Close Playbook

### During the Demo
- Key moments to hit (discovery, product, ROI, social proof)
- How to handle "I need to think about it" in the moment
- When to offer a pilot or trial

### Post-Demo Follow-Up (5 Emails)
The critical post-demo sequence that actually closes deals:

### Post-Demo Email 1: Same Day — Thank You + Next Steps (Send 1hr after)
### Post-Demo Email 2: Day 2 — Deliver What You Promised (Send next business day)
### Post-Demo Email 3: Day 4 — Address Top Objections (Send if no reply)
### Post-Demo Email 4: Day 7 — Offer a Pilot / Proof of Concept
### Post-Demo Email 5: Day 14 — Final Close Attempt

## 9. Metrics to Track

| Metric | What to Measure | Target |
|--------|----------------|--------|
- Demo show rate
- Demo-to-pipeline rate
- Average time to close
- Post-demo follow-up response rate

Be specific with names, company types, and pain points. Make every email feel personalized and human — not templated.`,
        },
      ],
      max_tokens: 1600,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Demo follow-up sequence generation failed." }, { status: 500 });
  }
}
