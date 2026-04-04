import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { apiName, apiType, baseUrl, endpoints, authentication, codeExamples } = await req.json();
    if (!apiName?.trim()) {
      return NextResponse.json({ error: "API name is required." }, { status: 400 });
    }

    const userContent = [
      "Generate comprehensive API reference documentation for:",
      "",
      "**API Name:** " + (apiName || "My API"),
      "**API Type:** " + (apiType || "REST API"),
      "**Base URL:** " + (baseUrl || "https://api.example.com/v1"),
      "**Authentication:** " + (authentication || "API key / Bearer token / OAuth 2.0"),
      "**Endpoints to Document:** " + (endpoints || "List the key endpoints the user wants documented"),
      "**Programming Languages for Examples:** " + (codeExamples || "JavaScript/TypeScript, Python"),
      "",
      "Generate ALL of the following sections:",
      "",
      "## 1. API Overview",
      "- Introduction: What this API does, core capabilities",
      "- Authentication: How to authenticate, rate limits, error codes overview",
      "- Quick Start: 3 steps to make your first request with code examples in JavaScript and Python",
      "",
      "## 2. Endpoints Reference",
      "For each endpoint provide: method, path, description, path params, query params, request body, response format, error codes, and code examples.",
      "Include at least 4 example endpoints: GET (list), GET/:id (retrieve), POST (create), DELETE (delete).",
      "Use markdown code blocks with language tags for request/response examples.",
      "",
      "## 3. Error Handling Guide",
      "- Error response format with code, message, and details fields",
      "- Common error codes table (400, 401, 404, 429, 500)",
      "- Retry strategy with exponential backoff recommendation",
      "",
      "## 4. Rate Limits & Best Practices",
      "- Rate limit tiers with requests/minute and requests/day",
      "- Pagination for large datasets",
      "- Caching strategies and request batching tips",
      "",
      "## 5. SDKs & Libraries",
      "- Official SDKs for JavaScript/Node.js and Python",
      "- Install commands and quick-start examples",
      "",
      "## 6. Testing Your Integration",
      "- Sandbox/test environment base URL",
      "- Test credentials and test data available",
      "- Postman collection instructions",
      "",
      "Make the documentation thorough and developer-friendly. Use realistic, working-feeling code examples. The markdown should be ready to publish in a developer docs site.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert technical writer and API documentation specialist." },
        { role: "user", content: userContent },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "API documentation generation failed." }, { status: 500 });
  }
}
