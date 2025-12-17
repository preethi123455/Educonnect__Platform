import React, { useState, useEffect } from "react";

export default function StudentScheduler() {
  const BACKEND_URL = "https://educonnect-platform-backend.onrender.com/api/ask";

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", time: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const notificationSound = new Audio(
    "https://dl.prokerala.com/downloads/ringtones/files/mp3/downloadfile-1-66490.mp3"
  );

  // -----------------------------
  // Reminder checker
  // -----------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);

      tasks.forEach((task) => {
        if (task.time === currentTime) {
          alert(`Reminder: ${task.title} - ${task.description}`);
          notificationSound.play().catch(() => {});
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tasks]);

  // -----------------------------
  // Add task
  // -----------------------------
  const addTask = () => {
    if (!newTask.title.trim() || !newTask.time.trim()) {
      setError("Task title and time are required.");
      return;
    }
    setError(null);
    setTasks((prev) => [...prev, newTask]);
    setNewTask({ title: "", description: "", time: "" });
  };

  // -----------------------------
  // Delete task
  // -----------------------------
  const deleteTask = (index) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  // -----------------------------
  // Ask AI for schedule suggestions (uses backend)
  // -----------------------------
  const suggestSchedule = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "general",
          messages: [
            {
              role: "system",
              content:
                "You analyze student tasks and generate a short optimized schedule. Respond in clean bullet points."
            },
            {
              role: "user",
              content: `Here are my tasks: ${JSON.stringify(tasks)}. Suggest an optimized study schedule.`
            }
          ]
        })
      });

      const data = await res.json();
      const msg = data?.choices?.[0]?.message?.content || "No suggestions available.";
      alert("📌 Suggested Schedule:\n\n" + msg);
    } catch {
      setError("Failed to fetch schedule suggestion.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>📅 Student Scheduler</h2>

      {/* Inputs */}
      <div style={styles.inputRow}>
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          style={styles.input}
        />

        <input
          type="time"
          value={newTask.time}
          onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
          style={styles.input}
        />

        <button style={styles.addBtn} onClick={addTask}>
          Add Task
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Task List */}
      <div style={styles.taskList}>
        {tasks.map((task, i) => (
          <div key={i} style={styles.taskCard}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>
              <strong>⏰ Time:</strong> {task.time}
            </p>

            <button style={styles.deleteBtn} onClick={() => deleteTask(i)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* AI Suggestion Button */}
      <button style={styles.suggestBtn} onClick={suggestSchedule} disabled={loading}>
        {loading ? "Loading..." : "✨ Suggest Schedule"}
      </button>

      {/* Test alarm */}
      <button style={styles.testBtn} onClick={() => notificationSound.play()}>
        🔔 Test Alarm
      </button>
    </div>
  );
}

// -----------------------------
// INTERNAL CSS (AiAssistance style)
// -----------------------------
const styles = {
  wrapper: {
    maxWidth: "750px",
    margin: "40px auto",
    padding: "20px",
    background: "#f5f0ff",
    borderRadius: "12px"
  },
  heading: {
    textAlign: "center",
    color: "#6a0dad",
    marginBottom: "20px"
  },
  inputRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  addBtn: {
    background: "#6a0dad",
    color: "white",
    padding: "10px 15px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer"
  },
  suggestBtn: {
    width: "100%",
    padding: "12px",
    background: "#6a0dad",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px"
  },
  taskList: {
    marginTop: "10px"
  },
  taskCard: {
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "10px"
  },
  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  },
  testBtn: {
    marginTop: "10px",
    padding: "10px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  error: {
    color: "red",
    marginTop: "-10px",
    marginBottom: "15px",
    textAlign: "center"
  }
};

