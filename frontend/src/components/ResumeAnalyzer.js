import React, { useState } from "react";

export default function ResumeAnalyzer() {
  const BACKEND_URL = "https://educonnect-platform-backend.onrender.com/api/ask";

  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  // -----------------------------------
  // Analyze Resume (AI via backend)
  // -----------------------------------
  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume text.");
      return;
    }

    setError(null);
    setLoading(true);
    setAnalysis(null);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "general",
          messages: [
            {
              role: "system",
              content: `You are a resume analysis AI. 
              Strictly return valid JSON using this exact format:

              {
                "skills": [{"name": "JavaScript", "level": 80, "recommendation": "Improve React"}],
                "strengths": ["Strong logic"],
                "weaknesses": ["Low cloud exposure"],
                "recommendations": ["Learn AWS"],
                "jobFit": [{"title": "Frontend Developer", "match": 85, "reason": "Strong JS"}]
              }

              Do NOT add explanations or text outside JSON.
              `
            },
            {
              role: "user",
              content: `Analyze this resume:\n${resumeText}`
            }
          ]
        })
      });

      const data = await res.json();
      const raw = data?.choices?.[0]?.message?.content?.trim() || "";

      // Extract JSON securely
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid AI response format.");

      const parsed = JSON.parse(jsonMatch[0]);
      setAnalysis(parsed);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>AI Resume Analyzer</h2>

      {/* Textarea */}
      <textarea
        placeholder="Paste your resume text here..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        style={styles.textarea}
      />

      {error && <div style={styles.error}>{error}</div>}

      {/* Analyze Button */}
      <button onClick={analyzeResume} disabled={loading} style={styles.button}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {/* Results */}
      {analysis && (
        <div style={styles.card}>
          <h3 style={styles.title}>Analysis Report</h3>

          {/* Skills */}
          <h4 style={styles.sectionTitle}>🛠 Skills</h4>
          <ul>
            {analysis.skills?.map((s, i) => (
              <li key={i}>
                <strong>{s.name}</strong> – {s.level}%  
                <br />
                <span style={{ color: "#6a0dad" }}>
                  Recommendation: {s.recommendation}
                </span>
              </li>
            ))}
          </ul>

          {/* Strengths */}
          <h4 style={styles.sectionTitle}>💪 Strengths</h4>
          <ul>
            {analysis.strengths?.map((str, i) => (
              <li key={i}>{str}</li>
            ))}
          </ul>

          {/* Weaknesses */}
          <h4 style={styles.sectionTitle}>⚠ Areas for Improvement</h4>
          <ul>
            {analysis.weaknesses?.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>

          {/* Recommendations */}
          <h4 style={styles.sectionTitle}>📌 Recommendations</h4>
          <ul>
            {analysis.recommendations?.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>

          {/* Job Fit */}
          <h4 style={styles.sectionTitle}>💼 Job Fit Suggestions</h4>
          <ul>
            {analysis.jobFit?.map((job, i) => (
              <li key={i}>
                <strong>{job.title}</strong>  
                <br />
                Match: {job.match}%  
                <br />
                Reason: {job.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// -----------------------------------
// Internal CSS (AiAssistance.js Style)
// -----------------------------------
const styles = {
  wrapper: {
    maxWidth: "800px",
    margin: "30px auto",
    padding: "20px",
    background: "#f5f0ff",
    borderRadius: "12px"
  },
  heading: {
    color: "#6a0dad",
    textAlign: "center",
    fontSize: "26px",
    marginBottom: "20px"
  },
  textarea: {
    width: "100%",
    minHeight: "200px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "10px"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#6a0dad",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "15px"
  },
  error: {
    background: "#ffebee",
    color: "#d32f2f",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px"
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    marginTop: "20px"
  },
  title: {
    color: "#6a0dad",
    marginBottom: "10px"
  },
  sectionTitle: {
    marginTop: "15px",
    color: "#4a0072"
  }
};
