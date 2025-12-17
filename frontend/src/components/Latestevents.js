import React, { useState, useEffect } from "react";

export default function AIUpdates() {
  const [category, setCategory] = useState("college");
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "https://educonnect-platform-backend.onrender.com/api/ask";

  // Fetch updates from backend AI
  const fetchUpdates = async () => {
    setLoading(true);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You provide the latest educational and career updates in short bullet points."
            },
            {
              role: "user",
              content: `Give me the latest useful updates for ${category} students. Keep it short and list-based.`
            }
          ],
          mode: "general"
        })
      });

      const data = await res.json();

      const content =
        data?.choices?.[0]?.message?.content ||
        "No updates available.";

      // Convert response into bullet lines
      const formatted = content.split("\n").filter((line) => line.trim() !== "");
      setUpdates(formatted);

    } catch (err) {
      console.error("Update fetch error:", err);
      setUpdates(["Failed to fetch updates. Try again later."]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUpdates();
  }, [category]);

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>🔮 AI-Powered Updates</h2>

      <div style={styles.row}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          <option value="college">College Students</option>
          <option value="school">School Students</option>
          <option value="working">Working Professionals</option>
        </select>

        <button
          onClick={fetchUpdates}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Fetching..." : "Refresh"}
        </button>
      </div>

      <ul style={styles.list}>
        {updates.map((item, idx) => (
          <li key={idx} style={styles.listItem}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------
// STYLES (internal CSS - AIAssistance style)
// ---------------------------
const styles = {
  wrapper: {
    padding: "20px",
    backgroundColor: "#F5F3FF",
    borderRadius: "12px",
    maxWidth: "600px",
    margin: "20px auto",
    color: "#4B0082",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  row: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  select: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    flex: 1,
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#4B0082",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  list: {
    marginTop: "20px",
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    backgroundColor: "#E0D4FF",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "8px",
    fontSize: "14px",
  },
};
