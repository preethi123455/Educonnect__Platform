import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const API_KEY = "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"; // Replace with actual API key
const TOTAL_QUESTIONS = 3;

const DailyChallenge = () => {
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem("points")) || 0);
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("streak")) || 0);
  const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem("badges")) || []);
  const [feedback, setFeedback] = useState("");
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    localStorage.setItem("points", points);
    localStorage.setItem("streak", streak);
    localStorage.setItem("badges", JSON.stringify(badges));
  }, [points, streak, badges]);

  const fetchChallenges = async (selectedSubject) => {
    try {
      const challenges = [];
      for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [{
              role: "system",
              content: `Generate a daily technical quiz or puzzle related to ${selectedSubject}. Provide a question only.`
            }],
            temperature: 0.7,
            max_tokens: 150,
          }),
        });
        const data = await response.json();
        challenges.push(data.choices?.[0]?.message?.content || "Try again later!");
      }
      setQuestions(challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: "You are an AI evaluator. Provide feedback on whether the given answer is correct or incorrect." },
            { role: "user", content: `Question: ${questions[currentQuestionIndex]}\nAnswer: ${userAnswer}` },
          ],
          temperature: 0.7,
          max_tokens: 100,
        }),
      });
      const data = await response.json();
      const aiFeedback = data.choices?.[0]?.message?.content || "No response";
      setFeedback(aiFeedback);

      if (aiFeedback.toLowerCase().includes("correct")) {
        setPoints((prev) => prev + 10);
        setStreak((prev) => prev + 1);
      } else {
        setStreak(0);
      }
      updateBadges();
      setUserAnswer("");
      
      if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setQuizCompleted(true);
      }
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  };

  const updateBadges = () => {
    const newBadges = [];
    if (points >= 50) newBadges.push("Bronze Star ⭐");
    if (points >= 100) newBadges.push("Silver Star 🌟");
    if (points >= 200) newBadges.push("Gold Star 🏆");
    setBadges(newBadges);
  };

  return (
    <div style={styles.container}>
      <h2>📖 Daily Challenge</h2>
      {!subject ? (
        <div>
          <h3>Select your preferred subject:</h3>
          <button onClick={() => { setSubject("Science"); fetchChallenges("Science"); }} style={styles.button}>Science</button>
          <button onClick={() => { setSubject("Math"); fetchChallenges("Math"); }} style={styles.button}>Math</button>
          <button onClick={() => { setSubject("Programming"); fetchChallenges("Programming"); }} style={styles.button}>Programming</button>
        </div>
      ) : quizCompleted ? (
        <div>
          <h3>✅ Quiz Completed!</h3>
          <p>🏆 Points: {points} | 🔥 Streak: {streak}</p>
          <p>🎖 Badges: {badges.join(", ") || "None yet"}</p>
        </div>
      ) : (
        <div>
          <p style={styles.challenge}>{questions[currentQuestionIndex]}</p>
          <textarea value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Enter your answer..." style={styles.input} />
          <button onClick={handleSubmit} style={styles.button}>Submit</button>
          {feedback && <p style={styles.feedback}>{feedback}</p>}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { backgroundColor: "#6a0dad", color: "white", padding: "20px", borderRadius: "10px", maxWidth: "600px", margin: "20px auto", textAlign: "center" },
  challenge: { fontSize: "18px", margin: "10px 0" },
  input: { width: "100%", height: "80px", padding: "10px", borderRadius: "5px", fontSize: "16px" },
  button: { margin: "10px", padding: "10px", backgroundColor: "#fff", color: "#6a0dad", border: "none", borderRadius: "5px", cursor: "pointer" },
  feedback: { marginTop: "10px", fontSize: "16px", fontWeight: "bold" }
};

export default DailyChallenge;