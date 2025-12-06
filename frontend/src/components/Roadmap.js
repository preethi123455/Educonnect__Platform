import React, { useState } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

const Roadmap = () => {
  const [career, setCareer] = useState("");
  const [roadmapData, setRoadmapData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);
  const apiKey = "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"; // Replace with your actual API key
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const fetchRoadmap = async () => {
    if (!career.trim()) {
      alert("Please enter a career field.");
      return;
    }
    setLoading(true);

    const requestBody = {
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "Respond with valid JSON only. Do not include any additional text before or after. Ensure the JSON is complete and properly formatted.",
        },
        {
          role: "user",
          content: `Create a career roadmap for ${career} in this JSON format:
          {
            "nodes": [
              {"id": "1", "position": {"x": 250, "y": 5}, "data": {"label": "Start"}},
              {"id": "2", "position": {"x": 250, "y": 100}, "data": {"label": "Step 1"}},
              {"id": "3", "position": {"x": 250, "y": 200}, "data": {"label": "Step 2"}}
            ],
            "edges": [
              {"id": "e1-2", "source": "1", "target": "2"},
              {"id": "e2-3", "source": "2", "target": "3"}
            ]
          }`,
        },
      ],
      max_tokens: 1000,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Raw API Response:", data);

      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Invalid response from AI");
      }

      let roadmapText = data.choices[0].message.content.trim();
      console.log("Extracted JSON:", roadmapText);

      // Ensure valid JSON response
      const jsonMatch = roadmapText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No valid JSON found");

      const parsedRoadmap = JSON.parse(jsonMatch[0]);
      console.log("Parsed Roadmap:", parsedRoadmap);

      // Validate nodes and edges
      if (!Array.isArray(parsedRoadmap.nodes) || !Array.isArray(parsedRoadmap.edges)) {
        throw new Error("Invalid roadmap format");
      }

      // Convert labels to strings
      const formattedNodes = parsedRoadmap.nodes.map((node) => ({
        ...node,
        data: { label: String(node.data.label) },
      }));

      setRoadmapData({ nodes: formattedNodes, edges: parsedRoadmap.edges });
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      alert(`Failed to generate roadmap: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        🚀 AI-Powered <span style={styles.highlight}>Career Roadmap</span>
      </h1>
      <p style={styles.description}>
        Enter a career field to generate a <strong>step-by-step roadmap</strong> to success!
      </p>

      <input
        type="text"
        value={career}
        onChange={(e) => setCareer(e.target.value)}
        placeholder="Enter your dream career (e.g. Data Scientist)"
        style={styles.input}
      />
      <button onClick={fetchRoadmap} style={styles.button} disabled={loading}>
        {loading ? "🔄 Generating..." : "🚀 Generate Roadmap"}
      </button>

      {roadmapData.nodes.length > 0 && (
        <div style={styles.flowContainer}>
          <ReactFlow nodes={roadmapData.nodes} edges={roadmapData.edges} fitView>
            <MiniMap style={{ backgroundColor: "#e0f7fa" }} />
            <Controls />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      )}
    </div>
  );
};

// 🎨 Styles
const styles = {
  container: {
    textAlign: "center",
    padding: "30px",
    background: "linear-gradient(135deg, #2196F3, #00BCD4)",
    minHeight: "100vh",
    color: "white",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
  },
  highlight: {
    color: "#FFD700",
  },
  description: {
    fontSize: "16px",
    marginBottom: "20px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    width: "350px",
    borderRadius: "10px",
    border: "none",
    marginBottom: "15px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#FF4081",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginLeft: "10px",
    transition: "0.3s",
  },
  flowContainer: {
    height: "500px",
    width: "90%",
    margin: "20px auto",
    border: "2px solid #FFEB3B",
    borderRadius: "10px",
    backgroundColor: "#fff",
    padding: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
};

export default Roadmap;
