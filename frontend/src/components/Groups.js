import React, { useState } from "react";
import { motion } from "framer-motion";

const domains = ["AI & ML", "Web Development", "Cybersecurity", "Blockchain", "Data Science", "Cloud Computing"];
const GROQ_API_KEY = "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"; // Replace with your actual API key
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export default function GroupDiscussionForum() {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [meetLink, setMeetLink] = useState("");
  const [aiInsights, setAiInsights] = useState("");
  const [recommendedTopics, setRecommendedTopics] = useState("");
  const [customMeetLink, setCustomMeetLink] = useState("");

  // Create Meet & Fetch AI Insights
  const createMeet = async (domain) => {
    setSelectedDomain(domain);
    const roomName = domain.replace(/\s+/g, "") + "_" + Date.now();
    const generatedMeetLink = `https://meet.jit.si/${roomName}`;
    setMeetLink(generatedMeetLink);

    try {
      const insightsResponse = await fetchAIResponse(`Give a brief insight about ${domain} (max 20 words).`);
      const topicsResponse = await fetchAIResponse(`Suggest 3 discussion topics for ${domain} (short response).`);

      setAiInsights(insightsResponse);
      setRecommendedTopics(topicsResponse);
    } catch {
      setAiInsights("No insights available.");
      setRecommendedTopics("No topics available.");
    }
  };

  // Fetch AI Response
  const fetchAIResponse = async (prompt) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama3-8b-8192", messages: [{ role: "user", content: prompt }] }),
      });

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "No response.";
    } catch {
      return "Error fetching response.";
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Group Discussion Forum</h1>
      <p style={styles.subtitle}>Join discussions and explore insights.</p>

      <div style={styles.grid}>
        {domains.map((domain, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} style={styles.card} onClick={() => createMeet(domain)}>
            <h2 style={styles.cardTitle}>{domain}</h2>
            <p style={styles.cardText}>Click to generate a meet & AI insights</p>
          </motion.div>
        ))}
      </div>

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

      <motion.div style={styles.resultCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 style={styles.resultTitle}>Add Your Own Meet</h2>
        <input type="text" placeholder="Enter Jitsi Meet link" value={customMeetLink} onChange={(e) => setCustomMeetLink(e.target.value)} style={styles.input} />
        {customMeetLink && (
          <a href={customMeetLink.startsWith("https://meet.jit.si/") ? customMeetLink : `https://meet.jit.si/${customMeetLink}`} target="_blank" rel="noopener noreferrer">
            <button style={styles.button}>Join Custom Meet</button>
          </a>
        )}
      </motion.div>
    </div>
  );
}

// Styles
const styles = {
  container: { minHeight: "100vh", backgroundColor: "#121212", color: "#ffffff", padding: "20px", textAlign: "center" },
  title: { fontSize: "2.5rem", fontWeight: "bold", color: "#facc15" },
  subtitle: { fontSize: "1.2rem", color: "#9ca3af", marginBottom: "20px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", justifyContent: "center" },
  card: { backgroundColor: "#1f2937", border: "2px solid #facc15", padding: "20px", borderRadius: "10px", cursor: "pointer" },
  cardTitle: { fontSize: "1.5rem", fontWeight: "bold", color: "#facc15" },
  cardText: { fontSize: "0.9rem", color: "#d1d5db" },
  resultCard: { backgroundColor: "#1f2937", border: "2px solid #facc15", padding: "20px", borderRadius: "10px", marginTop: "20px" },
  resultTitle: { fontSize: "1.8rem", fontWeight: "bold", color: "#facc15" },
  input: { backgroundColor: "#374151", color: "white", padding: "10px", borderRadius: "5px", border: "none", width: "80%", textAlign: "center", marginTop: "10px" },
  button: { backgroundColor: "#facc15", color: "#121212", padding: "10px 20px", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", border: "none", marginTop: "10px" },
};

