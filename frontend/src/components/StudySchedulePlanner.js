import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from './AppContext'; // Ensure correct path

const API_KEY = "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"; // Replace with your actual API key

const StudySchedulePlanner = () => {
  const { addPoints } = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const notificationAudio = new Audio('/notification.mp3'); // Ensure this file exists

  // Load saved schedule from localStorage
  useEffect(() => {
    const savedSchedule = localStorage.getItem('studySchedule');
    if (savedSchedule) {
      try {
        setSchedule(JSON.parse(savedSchedule));
      } catch (e) {
        console.error('Error loading saved schedule:', e);
      }
    }
  }, []);

  // Save schedule to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('studySchedule', JSON.stringify(schedule));
  }, [schedule]);

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
  };

  const generateStudyPlan = async () => {
    if (!userInput.trim()) {
      alert("Please enter study topics or tasks.");
      return;
    }

    setAiLoading(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: `You are an AI assistant that creates structured study schedules. Return a JSON array of study blocks with start time, end time, task, and break suggestions. No extra text, just JSON.`
            },
            {
              role: "user",
              content: `Create a structured study plan for ${selectedDate.toDateString()}.
                        Topics: ${userInput}.
                        Include study blocks, short breaks, lunch, and relaxation time.
                        Format response as JSON: [{"start": "9:00 AM", "end": "10:30 AM", "task": "Study Data Structures", "break": "5-minute walk"}]`
            }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;

      if (!aiResponse) {
        throw new Error("Invalid AI response.");
      }

      try {
        const parsedSchedule = JSON.parse(aiResponse);
        setSchedule(parsedSchedule);
        addPoints(10); // Award points after a successful plan
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        alert("The AI response could not be parsed. Please try again.");
      }

    } catch (error) {
      console.error("AI Error:", error);
      alert("Failed to generate a study plan. Please try again.");
    }

    setAiLoading(false);
  };

  const playNotification = () => {
    notificationAudio.play().catch(err => console.error("Audio play error:", err));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📚 Study Schedule Planner</h2>

      <div style={styles.inputContainer}>
        <label style={styles.label}>Select Date:</label>
        <input type="date" onChange={handleDateChange} style={styles.input} />
      </div>

      <div style={styles.inputContainer}>
        <label style={styles.label}>Enter Study Topics:</label>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={styles.input}
          placeholder="e.g. Machine Learning, Data Structures"
        />
        <button onClick={generateStudyPlan} style={styles.button} disabled={aiLoading}>
          {aiLoading ? "Generating..." : "Generate Plan"}
        </button>
      </div>

      {schedule.length > 0 && (
        <div style={styles.scheduleContainer}>
          <h3 style={styles.subHeading}>📅 Plan for {selectedDate.toDateString()}</h3>
          <ul style={styles.list}>
            {schedule.map((item, index) => (
              <li key={index} style={styles.listItem} onClick={playNotification}>
                <strong>{item.start} - {item.end}</strong>: {item.task}
                <br /> <em>Break: {item.break}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#F9F3FF",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "600px",
    margin: "auto",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  heading: {
    color: "#6a0dad",
    marginBottom: "20px",
  },
  inputContainer: {
    marginBottom: "15px",
  },
  label: {
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px",
  },
  input: {
    width: "80%",
    padding: "8px",
    border: "1px solid #6a0dad",
    borderRadius: "5px",
  },
  button: {
    backgroundColor: "#6a0dad",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px",
  },
  scheduleContainer: {
    marginTop: "20px",
  },
  subHeading: {
    color: "#6a0dad",
    marginBottom: "10px",
  },
  list: {
    listStyleType: "none",
    padding: "0",
  },
  listItem: {
    backgroundColor: "#EDE7F6",
    padding: "10px",
    margin: "5px 0",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default StudySchedulePlanner;
