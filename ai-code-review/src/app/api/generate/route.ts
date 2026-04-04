import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { repoName, language, prDescription, reviewComments, focusAreas } = await req.json();
    if (!repoName?.trim()) {
      return NextResponse.json({ error: "Repository name is required." }, { status: 400 });
    }

    const userContent = [
      "Analyze the following code review and generate a comprehensive review summary:",
      "",
      "**Repository:** " + (repoName || "my-project"),
      "**Language/Stack:** " + (language || "TypeScript, React, Node.js, Python, Go"),
      "**PR Description:** " + (prDescription || "What the PR is trying to accomplish"),
      "**Review Comments:**\n" + (reviewComments || "[Paste code review comments here]"),
      "**Focus Areas:** " + (focusAreas || "Code quality, security, performance, maintainability"),
      "",
      "Generate ALL of the following:",
      "",
      "## 1. Executive Summary",
      "A 3-4 sentence plain-English summary of what this PR does, the overall code quality, and the key concerns — suitable for a Slack message to the team lead.",
      "",
      "## 2. Changes Overview",
      "- What files were changed and their purpose",
      "- Lines of code added / removed / changed",
      "- Complexity assessment (simple / moderate / complex)",
      "",
      "## 3. Strengths",
      "What the code does well (specific, based on actual review comments):",
      "- Design patterns used effectively",
      "- Security considerations handled well",
      "- Performance optimizations",
      "- Readability and documentation",
      "",
      "## 4. Issues & Recommendations",
      "Organized by severity:",
      "",
      "### 🔴 Critical Issues (must fix before merge)",
      "For each: what the issue is, why it matters, recommended fix.",
      "",
      "### 🟠 Important Issues (strongly recommended to fix)",
      "For each: what the issue is, why it matters, recommended fix.",
      "",
      "### 🟡 Suggestions (nice to have improvements)",
      "For each: what could be improved, with a suggested approach.",
      "",
      "## 5. Security Assessment",
      "- Potential security vulnerabilities identified",
      "- Input validation and sanitization",
      "- Authentication/authorization concerns",
      "- Dependency security (new packages introduced)",
      "- Recommendations for hardening",
      "",
      "## 6. Performance Assessment",
      "- Potential performance bottlenecks",
      "- N+1 queries or inefficient database access",
      "- Missing caching opportunities",
      "- Unnecessary re-renders (for frontend)",
      "",
      "## 7. Testing Gaps",
      "- What is covered by existing tests",
      "- What tests are missing",
      "- Recommended additional test cases",
      "- Edge cases not considered",
      "",
      "## 8. Maintainability Review",
      "- Code organization and structure",
      "- Naming conventions and clarity",
      "- Documentation quality (README, comments, API docs)",
      "- Technical debt introduced or paid down",
      "",
      "## 9. Reviewer Decision",
      "One of the following, with rationale:",
      "- **Approve** — PR is ready to merge",
      "- **Request Changes** — PR needs revisions before approval",
      "- **Needs Discussion** — Some points need team discussion before proceeding",
      "- **Approve with Comments** — Minor suggestions, merge at reviewer's discretion",
      "",
      "## 10. Suggested Next Steps",
      "Prioritized list of what to do before merging:",
      "1. [Most urgent]",
      "2. [Second most urgent]",
      "3. [Nice to have before shipping]",
      "",
      "Be specific, constructive, and reference actual code where possible. Focus on helping the author improve, not just listing problems.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert software engineer and code reviewer with deep knowledge of software architecture, security, and best practices." },
        { role: "user", content: userContent },
      ],
      max_tokens: 1400,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Code review summary generation failed." }, { status: 500 });
  }
}
