import React, { useState, useEffect } from "react";

const AIUpdates = () => {
  const [category, setCategory] = useState("college");
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = "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"; // Replace with your actual Groq API key

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: "You provide the latest educational updates." },
            { role: "user", content: `Give me the latest updates for ${category} students.` }
          ],
          max_tokens: 200
        })
      });

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || "No updates available.";
      setUpdates(aiResponse.split("\n"));
    } catch (error) {
      console.error("Error fetching updates:", error);
      setUpdates(["Failed to fetch updates. Try again later."]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUpdates();
  }, [category]);

  return (
    <div style={{ padding: "20px", backgroundColor: "#F5F3FF", color: "#4B0082", borderRadius: "10px" }}>
      <h2>🔮 AI-Powered Updates</h2>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="college">College Students</option>
        <option value="school">School Students</option>
        <option value="working">Working Professionals</option>
      </select>
      <button 
        onClick={fetchUpdates} 
        disabled={loading} 
        style={{ marginLeft: "10px", padding: "8px", borderRadius: "5px", backgroundColor: "#4B0082", color: "#fff" }}
      >
        {loading ? "Fetching..." : "Get Updates"}
      </button>
      <ul style={{ marginTop: "15px", listStyleType: "none", padding: 0 }}>
        {updates.map((update, index) => (
          <li key={index} style={{ backgroundColor: "#E0D4FF", padding: "8px", marginBottom: "5px", borderRadius: "5px" }}>
            {update}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AIUpdates;
