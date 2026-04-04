"use client";

import { useState } from "react";

const ACCENT = "hsl(105, 70%, 40%)";

export default function Home() {
  const [project, setProject] = useState("");
  const [interviewee, setInterviewee] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project.trim()) return;
    setLoading(true);
    setOutput("");
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, interviewee }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOutput(data.output);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #111827 0%, #0f172a 50%, #020617 100%)", color: "#f9fafb", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "2rem 2rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: ACCENT, boxShadow: `0 0 12px ${ACCENT}` }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: ACCENT, opacity: 0.9 }}>AI × Oral History</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2, background: "linear-gradient(to right, #f9fafb, #d1d5db)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Oral History Questionnaire Builder
          </h1>
          <p style={{ color: "#9ca3af", marginTop: "0.5rem", fontSize: "0.95rem" }}>
            Describe your oral history project goal and interviewee background to receive a structured questionnaire with probing questions, ethical guidelines, and recording tips.
          </p>
        </div>
      </div>
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label htmlFor="project" style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#d1d5db", marginBottom: "0.5rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Oral History Project Goal</label>
            <textarea id="project" value={project} onChange={(e) => setProject(e.target.value)} placeholder="Describe the goal — e.g. Documenting the lived experience of Japanese American internment survivors, or preserving knowledge of traditional farming practices in rural Appalachia..." rows={4} style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.75rem", color: "#f9fafb", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", resize: "vertical", transition: "border-color 0.2s" }} onFocus={(e) => (e.target.style.borderColor = ACCENT)} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
          </div>
          <div>
            <label htmlFor="interviewee" style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#d1d5db", marginBottom: "0.5rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Interviewee Background (Optional)</label>
            <input id="interviewee" type="text" value={interviewee} onChange={(e) => setInterviewee(e.target.value)} placeholder="e.g. 92-year-old former steelworker from Pittsburgh, born 1932, union organizer..." style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.75rem", color: "#f9fafb", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }} onFocus={(e) => (e.target.style.borderColor = ACCENT)} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
          </div>
          <button type="submit" disabled={loading || !project.trim()} style={{ padding: "0.85rem 1.5rem", background: loading ? "rgba(16,185,129,0.3)" : `linear-gradient(135deg, ${ACCENT}, color-mix(in srgb, ${ACCENT} 70%, #047857))`, border: "none", borderRadius: "0.75rem", color: "#fff", fontSize: "0.95rem", fontWeight: 700, cursor: loading || !project.trim() ? "not-allowed" : "pointer", letterSpacing: "0.02em", boxShadow: `0 0 20px color-mix(in srgb, ${ACCENT} 30%, transparent)`, opacity: loading ? 0.7 : 1 }} onMouseEnter={(e) => { if (!loading && project.trim()) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.opacity = "0.9"; } }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = "1"; }}>
            {loading ? "Building Questionnaire..." : "Build Questionnaire"}
          </button>
        </form>
        {error && <div style={{ marginTop: "1.5rem", padding: "1rem 1.25rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "0.75rem", color: "#fca5a5", fontSize: "0.875rem" }}>{error}</div>}
        {output && (
          <div style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: ACCENT }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9ca3af" }}>Questionnaire</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.75rem", color: "#e5e7eb", lineHeight: 1.8, fontSize: "0.95rem", overflow: "auto" }}>
              <div style={{ whiteSpace: "pre-wrap", fontFamily: "Georgia, serif" }} dangerouslySetInnerHTML={{ __html: output }} />
            </div>
          </div>
        )}
      </main>
      <footer style={{ textAlign: "center", padding: "2rem", color: "#4b5563", fontSize: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: "2rem" }}>AI × History &amp; Archaeology &amp; Cultural Heritage</footer>
    </div>
  );
}
