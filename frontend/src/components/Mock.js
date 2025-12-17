import React, { useState } from "react";

export default function MockInterview() {
  const [field, setField] = useState("");
  const [question, setQuestion] = useState("Enter your field to get an interview question.");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userResponse, setUserResponse] = useState("");

  const BACKEND_AI_URL = "https://educonnect-platform-backend.onrender.com/api/ask";

  // -----------------------------
  // Generate Interview Question
  // -----------------------------
  const startInterview = async () => {
    if (!field.trim()) {
      setQuestion("Please enter a field of study or job role.");
      return;
    }

    setLoading(true);
    setQuestion("Generating interview question...");
    setFeedback("");

    try {
      const res = await fetch(BACKEND_AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You act as an interviewer. Generate domain-specific mock interview questions.",
            },
            {
              role: "user",
              content: `Provide a mock interview question for a ${field} candidate.`,
            },
          ],
          mode: "general",
        }),
      });

      const data = await res.json();
      const aiQuestion =
        data?.choices?.[0]?.message?.content ||
        "No question generated. Try again.";

      setQuestion(aiQuestion);
    } catch (err) {
      console.error("Error:", err);
      setQuestion("Error generating question. Try again.");
    }

    setLoading(false);
  };

  // -----------------------------
  // Voice Recognition
  // -----------------------------
  const startListening = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser.");
        return;
      }

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (e) => {
        setUserResponse(e.results[0][0].transcript);
      };

      rec.start();
    } catch (err) {
      console.error("Speech Error:", err);
    }
  };

  // -----------------------------
  // Get Feedback On User Answer
  // -----------------------------
  const getFeedback = async () => {
    if (!userResponse) {
      setFeedback("Please provide an answer first.");
      return;
    }

    setLoading(true);
    setFeedback("Analyzing your response...");

    try {
      const res = await fetch(BACKEND_AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You evaluate interview responses and give constructive feedback.",
            },
            {
              role: "user",
              content: `Provide feedback on this interview answer.\nQuestion: "${question}"\nAnswer: "${userResponse}"`,
            },
          ],
          mode: "general",
        }),
      });

      const data = await res.json();
      const aiFeedback =
        data?.choices?.[0]?.message?.content ||
        "No feedback generated.";

      setFeedback(aiFeedback);
    } catch (err) {
      console.error("Feedback Error:", err);
      setFeedback("Error generating feedback.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>AI Mock Interview</h1>

      <div style={styles.box}>
        <p style={styles.label}>Enter your field to begin:</p>

        <input
          type="text"
          value={field}
          onChange={(e) => setField(e.target.value)}
          placeholder="e.g., Software Engineer, Data Scientist"
          style={styles.input}
        />

        <button onClick={startInterview} style={styles.button}>
          Start Interview
        </button>

        <div style={styles.responseBox}>
          {loading ? (
            <p style={styles.loading}>Loading...</p>
          ) : (
            <p>{question}</p>
          )}
        </div>

        {question && !question.startsWith("Enter your field") && (
          <button onClick={startListening} style={styles.voiceButton}>
            {isListening ? "Listening..." : "Answer with Voice"}
          </button>
        )}

        {userResponse && (
          <p style={styles.userResponse}>Your Answer: {userResponse}</p>
        )}

        {userResponse && (
          <button onClick={getFeedback} style={styles.feedbackButton}>
            Get Feedback
          </button>
        )}

        <div style={styles.feedbackBox}>
          {feedback && <p>{feedback}</p>}
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// STYLES
// -----------------------------
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0d0d0d",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    fontSize: "2.2rem",
    marginBottom: "20px",
    color: "#A855F7",
  },
  box: {
    backgroundColor: "#1a1a2e",
    padding: "25px",
    borderRadius: "12px",
    width: "80%",
    maxWidth: "700px",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(168,85,247,0.5)",
  },
  label: {
    marginBottom: "10px",
    fontSize: "1.1rem",
  },
  input: {
    width: "70%",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    marginBottom: "15px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#A855F7",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },
  responseBox: {
    marginTop: "20px",
    backgroundColor: "#2c2c54",
    padding: "15px",
    borderRadius: "8px",
    minHeight: "50px",
  },
  voiceButton: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#ffcc00",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
  },
  userResponse: {
    marginTop: "15px",
    color: "#FFD700",
    fontSize: "1.1rem",
  },
  feedbackButton: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#32CD32",
    borderRadius: "6px",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  feedbackBox: {
    marginTop: "15px",
    backgroundColor: "#2c2c54",
    padding: "15px",
    borderRadius: "8px",
    color: "#FFD700",
  },
};
