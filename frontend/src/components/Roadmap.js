import React, { useState } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

export default function Roadmap() {
  const BACKEND_URL = "https://educonnect-platform-backend.onrender.com/api/ask";

  const [career, setCareer] = useState("");
  const [roadmapData, setRoadmapData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // -----------------------------
  // FETCH ROADMAP (via backend)
  // -----------------------------
  const fetchRoadmap = async () => {
    if (!career.trim()) {
      setError("Please enter a career field.");
      return;
    }

    setLoading(true);
    setError(null);
    setRoadmapData({ nodes: [], edges: [] });

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "general",
          messages: [
            {
              role: "system",
              content: `Return ONLY valid JSON with no explanation. Use this strict format:

              {
                "nodes": [
                  {"id": "1", "position": {"x": 250, "y": 5}, "data": {"label": "Start"}}
                ],
                "edges": [
                  {"id": "e1-2", "source": "1", "target": "2"}
                ]
              }`
            },
            {
              role: "user",
              content: `Create a step-by-step career roadmap for: ${career}`
            }
          ]
        })
      });

      const data = await res.json();
      const rawText = data?.choices?.[0]?.message?.content?.trim() || "";

      // Extract JSON safely
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid JSON received.");

      const parsed = JSON.parse(jsonMatch[0]);

      if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
        throw new Error("AI returned malformed roadmap.");
      }

      // Ensure labels are strings
      const formattedNodes = parsed.nodes.map((n) => ({
        ...n,
        data: { label: String(n.data?.label || "") }
      }));

      setRoadmapData({ nodes: formattedNodes, edges: parsed.edges });
    } catch (err) {
      console.error(err);
      setError("Failed to generate roadmap. Try again.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>AI Career Roadmap Builder 🚀</h2>
      <p style={styles.subtext}>Enter your dream career and get a visual roadmap powered by AI.</p>

      <input
        type="text"
        placeholder="e.g., Data Scientist, Software Engineer"
        value={career}
        onChange={(e) => setCareer(e.target.value)}
        style={styles.input}
      />

      <button onClick={fetchRoadmap} disabled={loading} style={styles.button}>
        {loading ? "Generating..." : "Generate Roadmap"}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {/* REACT FLOW VISUALIZATION */}
      {roadmapData.nodes.length > 0 && (
        <div style={styles.flowBox}>
          <ReactFlow nodes={roadmapData.nodes} edges={roadmapData.edges} fitView>
            <MiniMap />
            <Controls />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      )}
    </div>
  );
}

// -----------------------------
// INTERNAL CSS (AiAssistance.js style)
// -----------------------------
const styles = {
  wrapper: {
    maxWidth: "900px",
    margin: "20px auto",
    padding: "20px",
    background: "#f5f0ff",
    borderRadius: "12px",
  },
  heading: {
    color: "#6a0dad",
    fontSize: "26px",
    textAlign: "center",
    marginBottom: "10px",
  },
  subtext: {
    textAlign: "center",
    color: "#444",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#6a0dad",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: "10px",
  },
  flowBox: {
    height: "500px",
    marginTop: "20px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    background: "#fff",
  },
};
