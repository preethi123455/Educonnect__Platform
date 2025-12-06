import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const API_KEY = "your_groq_api_key"; // Replace with your Groq API key

const DailyChallenge = () => {
  const [challenge, setChallenge] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [points, setPoints] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchChallenge();
  }, []);

  const fetchChallenge = async () => {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [{ role: "system", content: "Generate an educational daily challenge question related to English or Tamil language learning." }],
          temperature: 0.7,
          max_tokens: 150,
        })
      });
      const data = await response.json();
      setChallenge(data.choices?.[0]?.message?.content || "Try again later!");
    } catch (error) {
      console.error("Error fetching challenge:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [{ role: "user", content: `Check if this answer is correct: ${userAnswer}` }],
          temperature: 0.7,
          max_tokens: 100,
        })
      });
      const data = await response.json();
      const aiFeedback = data.choices?.[0]?.message?.content || "No response";
      setFeedback(aiFeedback);
      if (aiFeedback.toLowerCase().includes("correct")) {
        setPoints(points + 10);
      }
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  };

  const generateCertificate = () => {
    const doc = new jsPDF();
    doc.setFillColor("#6a0dad");
    doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor("white");
    doc.setFontSize(24);
    doc.text("Certificate of Achievement", 60, 50);
    doc.setFontSize(16);
    doc.text("Awarded to", 90, 80);
    doc.setFontSize(22);
    doc.setTextColor("yellow");
    doc.text("[Your Name]", 85, 100);
    doc.setFontSize(16);
    doc.setTextColor("white");
    doc.text(`For scoring ${points} points in Daily Challenges`, 40, 120);
    doc.save("Certificate.pdf");
  };

  return (
    <div style={styles.container}>
      <h2>📖 Daily Challenge</h2>
      <p style={styles.challenge}>{challenge}</p>
      <textarea 
        value={userAnswer} 
        onChange={(e) => setUserAnswer(e.target.value)} 
        placeholder="Enter your answer..." 
        style={styles.input}
      />
      <button onClick={handleSubmit} style={styles.button}>Submit</button>
      {feedback && <p style={styles.feedback}>{feedback}</p>}
      <p style={styles.points}>🏆 Points: {points}</p>
      <button onClick={generateCertificate} style={styles.certButton}>Download Certificate</button>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#6a0dad",
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "600px",
    margin: "20px auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  challenge: {
    fontSize: "18px",
    margin: "10px 0",
  },
  input: {
    width: "100%",
    height: "80px",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    fontSize: "16px",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#fff",
    color: "#6a0dad",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
  feedback: {
    marginTop: "10px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  points: {
    marginTop: "10px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  certButton: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "yellow",
    color: "black",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default DailyChallenge;
