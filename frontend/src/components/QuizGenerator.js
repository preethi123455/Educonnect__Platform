import React, { useState } from "react";

export default function QuizGenerator() {
  const BACKEND_URL = "https://educonnect-platform-backend.onrender.com/api/ask";

  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // -----------------------------
  // GENERATE QUIZ FROM AI (uses backend)
  // -----------------------------
  const generateQuiz = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic before generating the quiz.");
      return;
    }

    setLoading(true);
    setError(null);
    setQuiz([]);
    setFeedback(null);

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
                `Generate a JSON array of 3 MCQ questions based on a topic. 
                 Format STRICTLY as:
                 [
                   {
                     "question": "text",
                     "options": ["A", "B", "C", "D"],
                     "correctAnswer": "A"
                   }
                 ]`
            },
            { role: "user", content: `Create a quiz on: ${topic}` },
          ],
        }),
      });

      const data = await res.json();
      const raw = data?.choices?.[0]?.message?.content || "";

      // Extract JSON safely
      const match = raw.match(/\[([\s\S]*)\]/);
      if (!match) throw new Error("Invalid quiz response format.");

      const parsed = JSON.parse(match[0]);
      setQuiz(parsed);
      setAnswers({});
    } catch (err) {
      console.error(err);
      setError("Failed to generate quiz. Try again.");
    }

    setLoading(false);
  };

  // -----------------------------
  // UPDATE ANSWER SELECTION
  // -----------------------------
  const handleAnswerChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  // -----------------------------
  // SUBMIT QUIZ + SHOW FEEDBACK
  // -----------------------------
  const evaluateQuiz = () => {
    let correct = 0;
    let recommendations = [];

    quiz.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
      else recommendations.push(`Revise more about: ${topic}`);
    });

    setFeedback({
      score: `${correct}/${quiz.length}`,
      message: correct === quiz.length ? "Excellent! 💯" : "You can improve!",
      recommendations: [...new Set(recommendations)],
    });
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>AI Quiz Generator</h2>

      <input
        type="text"
        placeholder="Enter a topic (e.g., JavaScript, Science)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={styles.input}
      />

      <button onClick={generateQuiz} disabled={loading} style={styles.button}>
        {loading ? "Generating..." : "Generate Quiz"}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {/* QUIZ DISPLAY */}
      {quiz.length > 0 && (
        <div style={styles.quizBox}>
          <h3 style={{ color: "#6a0dad" }}>Quiz Questions</h3>

          {quiz.map((q, i) => (
            <div key={i} style={styles.questionBlock}>
              <p style={styles.questionText}>
                <strong>{i + 1}. {q.question}</strong>
              </p>

              {q.options.map((opt, idx) => (
                <label key={idx} style={styles.optionRow}>
                  <input
                    type="radio"
                    name={`q-${i}`}
                    value={opt}
                    checked={answers[i] === opt}
                    onChange={() => handleAnswerChange(i, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <button onClick={evaluateQuiz} style={styles.submitBtn}>
            Submit Answers
          </button>
        </div>
      )}

      {/* FEEDBACK DISPLAY */}
      {feedback && (
        <div style={styles.feedbackBox}>
          <h3 style={{ color: "#28a745" }}>Your Result</h3>
          <p><strong>Score:</strong> {feedback.score}</p>
          <p>{feedback.message}</p>

          {feedback.recommendations.length > 0 && (
            <>
              <h4>Recommendations:</h4>
              <ul>
                {feedback.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// -----------------------------
// INTERNAL CSS (Like AiAssistance.js)
// -----------------------------
const styles = {
  wrapper: {
    padding: "20px",
    maxWidth: "700px",
    margin: "40px auto",
    background: "#f5f0ff",
    borderRadius: "12px",
  },
  heading: {
    color: "#6a0dad",
    fontSize: "24px",
    marginBottom: "15px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    background: "#6a0dad",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
  },
  error: {
    marginTop: "10px",
    color: "red",
  },
  quizBox: {
    marginTop: "20px",
    padding: "15px",
    background: "white",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },
  questionBlock: {
    marginBottom: "15px",
  },
  questionText: {
    marginBottom: "8px",
  },
  optionRow: {
    display: "block",
    marginBottom: "6px",
  },
  submitBtn: {
    padding: "10px",
    background: "#28a745",
    color: "white",
    border: "none",
    width: "100%",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
  },
  feedbackBox: {
    marginTop: "20px",
    padding: "15px",
    background: "#fff",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },
};


