import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentScheduler = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", time: "" });
  const [loading, setLoading] = useState(false);

  const apiKey = "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"; // Replace with your actual API key
  const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

  useEffect(() => {
    const checkReminders = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
      
      tasks.forEach((task) => {
        if (task.time === currentTime) {
          alert(`Reminder: ${task.title} - ${task.description}`);
          playAlarmSound();
        }
      });
    }, 1000);

    return () => clearInterval(checkReminders);
  }, [tasks]);

  const playAlarmSound = () => {
    const audio = document.getElementById("alarmSound");
    if (audio) {
      audio.play().catch(error => console.error("Audio play blocked:", error));
    }
  };

  const fetchSuggestedSchedule = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        apiUrl,
        {
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: "Generate a student schedule based on tasks." },
            { role: "user", content: JSON.stringify(tasks) }
          ],
        },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );

      const suggestedSchedule = response.data.choices[0].message.content;
      alert("Suggested Schedule:\n" + suggestedSchedule);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
    setLoading(false);
  };

  const addTask = () => {
    if (newTask.title.trim() && newTask.time.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask({ title: "", description: "", time: "" });
    }
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Student Scheduler</h1>
      <input
        type="text"
        placeholder="Task Title"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        style={{ margin: "5px", padding: "8px" }}
      />
      <input
        type="text"
        placeholder="Task Description"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        style={{ margin: "5px", padding: "8px" }}
      />
      <input
        type="time"
        value={newTask.time}
        onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
        style={{ margin: "5px", padding: "8px" }}
      />
      <button onClick={addTask} style={{ margin: "5px", padding: "8px", background: "#6a0dad", color: "white" }}>
        Add Task
      </button>
      
      <div>
        {tasks.map((task, index) => (
          <div key={index} style={{ border: "1px solid #6a0dad", padding: "10px", margin: "10px", borderRadius: "5px" }}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p><b>Reminder at:</b> {task.time}</p>
            <button onClick={() => deleteTask(index)} style={{ background: "red", color: "white", padding: "5px" }}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <button onClick={fetchSuggestedSchedule} disabled={loading} style={{ padding: "10px", background: "#6a0dad", color: "white" }}>
        {loading ? "Loading..." : "Suggest Schedule"}
      </button>

      {/* Hidden Audio Element */}
      <audio id="alarmSound">
        <source src="https://dl.prokerala.com/downloads/ringtones/files/mp3/downloadfile-1-66490.mp3" type="audio/mp3" />
      </audio>

      {/* Test Alarm Button */}
      <button onClick={playAlarmSound} style={{ margin: "10px", padding: "8px", background: "green", color: "white" }}>
        Test Alarm
      </button>
    </div>
  );
};

export default StudentScheduler;
