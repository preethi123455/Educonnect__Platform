import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "./AppContext";

export default function StudySchedulePlanner() {
  const BACKEND_URL = "https://educonnect-platform-backend.onrender.com/api/ask";

  const { addPoints } = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const notificationSound = new Audio("/notification.mp3");

  // -----------------------------
  // Load saved schedule
  // -----------------------------
  useEffect(() => {
    const saved = localStorage.getItem("studySchedule");
    if (saved) {
      try {
        setSchedule(JSON.parse(saved));
      } catch {
        console.error("Schedule parse error");
      }
    }
  }, []);

  // Save schedule on change
  useEffect(() => {
    localStorage.setItem("studySchedule", JSON.stringify(schedule));
  }, [schedule]);

  // -----------------------------
  // Generate study plan via backend AI
  // -----------------------------
  const generatePlan = async () => {
    if (!userInput.trim()) {
      setError("Please enter your study topics.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "general",
          messages: [
            {
              role: "system",
              content: `Return ONLY a valid JSON array of study plan items.
Each item must follow this exact structure:

{
  "start": "9:00 AM",
  "end": "10:30 AM",
  "task": "Study topic",
  "break": "5-minute break"
}

No extra text. No formatting outside JSON.`
            },
            {
              role: "user",
              content: `Generate a structured study plan for ${selectedDate.toDateString()}
Topics: ${userInput}`
            }
          ]
        })
      });

      const data = await res.json();
      const raw = data?.choices?.[0]?.message?.content?.trim() || "";

      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("AI returned invalid JSON.");

      const parsed = JSON.parse(jsonMatch[0]);
      setSchedule(parsed);
      addPoints(10);
    } catch (err) {
      console.error(err);
      setError("Failed to generate study plan. Try again.");
    }

    setLoading(false);
  };

  // -----------------------------
  // Notification sound
  // -----------------------------
  const playNotification = () => {
    notificationSound.play().catch(() => {});
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>📚 AI Study Schedule Planner</h2>

      {/* Date Picker */}
      <div style={styles.inputBlock}>
        <label style={styles.label}>Select Date</label>
        <input
          type="date"
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          style={styles.input}
        />
      </div>

      {/* Topic Input */}
      <div style={styles.inputBlock}>
        <label style={styles.label}>Study Topics</label>
        <input
          type="text"
          placeholder="e.g., ML, DSA, English Grammar"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={styles.input}
        />
      </div>

      <button onClick={generatePlan} disabled={loading} style={styles.button}>
        {loading ? "Generating..." : "Generate Plan"}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {/* Schedule Display */}
      {schedule.length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.subheading}>📅 Study Plan for {selectedDate.toDateString()}</h3>

          <ul style={styles.list}>
            {schedule.map((block, i) => (
              <li
                key={i}
                onClick={playNotification}
                style={styles.listItem}
              >
                <strong>{block.start} - {block.end}</strong>  
                <br />
                {block.task}
                <br />
                <em>Break: {block.break}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// -----------------------------
// INTERNAL CSS (AiAssistance.js STYLE)
// -----------------------------
const styles = {
  wrapper: {
    maxWidth: "650px",
    margin: "30px auto",
    padding: "20px",
    background: "#f5f0ff",
    borderRadius: "12px"
  },
  heading: {
    textAlign: "center",
    color: "#6a0dad",
    fontSize: "26px",
    marginBottom: "20px"
  },
  inputBlock: {
    marginBottom: "15px"
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "6px",
    color: "#4b0082"
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#6a0dad",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px"
  },
  error: {
    marginTop: "10px",
    color: "red",
    textAlign: "center"
  },
  card: {
    marginTop: "20px",
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #ddd"
  },
  subheading: {
    color: "#6a0dad",
    marginBottom: "10px"
  },
  list: {
    listStyle: "none",
    padding: "0"
  },
  listItem: {
    background: "#e8dbff",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
    cursor: "pointer"
  }
};
