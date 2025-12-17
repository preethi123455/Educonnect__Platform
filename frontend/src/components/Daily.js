import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";

const DailyChallenge = () => {
  const [challenge, setChallenge] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChallenge();
  }, []);

  const fetchChallenge = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://educonnect-platform-backend.onrender.com/api/daily-challenge",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "generate" }),
        }
      );

      const data = await response.json();
      setChallenge(data.challenge || "No challenge available today.");
    } catch (error) {
      setChallenge("Error loading challenge. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        "https://educonnect-platform-backend.onrender.com/api/daily-challenge",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "evaluate",
            answer: userAnswer,
            challenge,
          }),
        }
      );

      const data = await response.json();
      setFeedback(data.feedback || "No feedback received.");

      if (data.correct) {
        setPoints((prev) => prev + 10);
      }
    } catch (error) {
      setFeedback("Error evaluating answer.");
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = () => {
    const doc = new jsPDF();
    doc.setFillColor(106, 13, 173);
    doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor("white");
    doc.setFontSize(26);
    doc.text("Certificate of Achievement", 40, 50);
    doc.setFontSize(18);
    doc.text("Awarded for completing Daily Challenges", 30, 90);
    doc.setFontSize(22);
    doc.setTextColor("yellow");
    doc.text(`Score: ${points} points`, 60, 130);
    doc.save("Daily_Challenge_Certificate.pdf");
  };

  return (
    <div style={styles.container}>
      <h2>📘 Daily Language Challenge</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <p style={styles.challenge}>{challenge}</p>
      )}

      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type your answer..."
        style={styles.input}
      />

      <button onClick={handleSubmit} style={styles.button} disabled={loading}>
        Submit Answer
      </button>

      {feedback && <p style={styles.feedback}>{feedback}</p>}

      <p style={styles.points}>🏆 Points: {points}</p>

      {points > 0 && (
        <button onClick={generateCertificate} style={styles.certButton}>
          Download Certificate
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#6a0dad",
    color: "white",
    padding: "25px",
    borderRadius: "12px",
    maxWidth: "600px",
    margin: "30px auto",
    textAlign: "center",
  },
  challenge: {
    fontSize: "18px",
    margin: "15px 0",
  },
  input: {
    width: "100%",
    height: "90px",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    fontSize: "15px",
  },
  button: {
    marginTop: "12px",
    padding: "10px 20px",
    backgroundColor: "#fff",
    color: "#6a0dad",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  feedback: {
    marginTop: "10px",
    fontWeight: "bold",
  },
  points: {
    marginTop: "12px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  certButton: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "yellow",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default DailyChallenge;
