import React, { useState } from "react";
import { motion } from "framer-motion";

const domains = [
  "AI & ML",
  "Web Development",
  "Cybersecurity",
  "Blockchain",
  "Data Science",
  "Cloud Computing"
];

// BACKEND ROUTE FOR AI
const BACKEND_AI_URL = "https://educonnect-platform-backend.onrender.com/api/ask";

export default function GroupDiscussionForum() {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [meetLink, setMeetLink] = useState("");
  const [aiInsights, setAiInsights] = useState("");
  const [recommendedTopics, setRecommendedTopics] = useState("");
  const [customMeetLink, setCustomMeetLink] = useState("");

  // Create Meet + Fetch AI Insights
  const createMeet = async (domain) => {
    setSelectedDomain(domain);

    // Generate Jitsi link
    const roomName = domain.replace(/\s+/g, "") + "_" + Date.now();
    const generatedMeetLink = `https://meet.jit.si/${roomName}`;
    setMeetLink(generatedMeetLink);

    try {
      const insightPrompt = `Give a brief insight about ${domain} in 20 words.`;
      const topicsPrompt = `Suggest 3 short discussion topics for ${domain}.`;

      const insightResponse = await fetchAIResponse(insightPrompt);
      const topicsResponse = await fetchAIResponse(topicsPrompt);

      setAiInsights(insightResponse);
      setRecommendedTopics(topicsResponse);
    } catch {
      setAiInsights("No insights available.");
      setRecommendedTopics("No topics available.");
    }
  };

  // Ask AI through BACKEND (same as AIAssistance)
  const fetchAIResponse = async (prompt) => {
    try {
      const res = await fetch(BACKEND_AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are an AI assistant that provides crisp insights and topic suggestions for discussions.",
            },
            { role: "user", content: prompt },
          ],
          mode: "general",
        }),
      });

      const data = await res.json();
      return data?.choices?.[0]?.message?.content || "No response.";
    } catch {
      return "Error contacting AI.";
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Group Discussion Forum</h1>
      <p style={styles.subtitle}>Join discussions and explore insights.</p>

      {/* GRID OF DOMAINS */}
      <div style={styles.grid}>
        {domains.map((domain, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            style={styles.card}
            onClick={() => createMeet(domain)}
          >
            <h2 style={styles.cardTitle}>{domain}</h2>
            <p style={styles.cardText}>Click to generate a meet & AI insights</p>
          </motion.div>
        ))}
      </div>

      {/* GENERATED RESULTS */}
      {selectedDomain && (
        <motion.div style={styles.resultCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 style={styles.resultTitle}>{selectedDomain} Discussion</h2>

          <input type="text" value={meetLink} readOnly style={styles.input} />

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>AI Insights</h3>
            <p style={styles.sectionText}>{aiInsights}</p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Suggested Topics</h3>
            <p style={styles.sectionText}>{recommendedTopics}</p>
          </div>

          <a href={meetLink} target="_blank" rel="noopener noreferrer">
            <button style={styles.button}>Join Meet</button>
          </a>
        </motion.div>
      )}

      {/* CUSTOM MEET LINK */}
      <motion.div style={styles.resultCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 style={styles.resultTitle}>Add Your Own Meet</h2>

        <input
          type="text"
          placeholder="Enter Jitsi Meet link"
          value={customMeetLink}
          onChange={(e) => setCustomMeetLink(e.target.value)}
          style={styles.input}
        />

        {customMeetLink && (
          <a
            href={
              customMeetLink.startsWith("https://meet.jit.si/")
                ? customMeetLink
                : `https://meet.jit.si/${customMeetLink}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <button style={styles.button}>Join Custom Meet</button>
          </a>
        )}
      </motion.div>
    </div>
  );
}

// ----------------------------
// STYLES
// ----------------------------
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#121212",
    color: "#ffffff",
    padding: "20px",
    textAlign: "center",
  },
  title: { fontSize: "2.5rem", fontWeight: "bold", color: "#facc15" },
  subtitle: { fontSize: "1.2rem", color: "#9ca3af", marginBottom: "20px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#1f2937",
    border: "2px solid #facc15",
    padding: "20px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  cardTitle: { fontSize: "1.5rem", fontWeight: "bold", color: "#facc15" },
  cardText: { fontSize: "0.9rem", color: "#d1d5db" },

  resultCard: {
    backgroundColor: "#1f2937",
    border: "2px solid #facc15",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "20px",
  },

  resultTitle: { fontSize: "1.8rem", fontWeight: "bold", color: "#facc15" },

  input: {
    backgroundColor: "#374151",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    width: "80%",
    textAlign: "center",
    marginTop: "10px",
  },

  button: {
    backgroundColor: "#facc15",
    color: "#121212",
    padding: "10px 20px",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
    marginTop: "10px",
  },

  section: { marginTop: "15px" },
  sectionTitle: { color: "#facc15", fontSize: "1.2rem" },
  sectionText: { color: "#e5e7eb" },
};
