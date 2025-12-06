import React, { useState } from "react";

const QuizGenerator = () => {
  const groqApiKey = "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"; // Replace with your actual API key
  const [userInput, setUserInput] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);

  const handleContentSubmit = async () => {
    if (!userInput.trim()) {
      setError("Please enter a topic before generating a quiz.");
      return;
    }

    setLoading(true);
    setError(null);
    setQuiz([]);
    setFeedback(null);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: `Generate a multiple-choice quiz with 3 questions on the given topic.
                        Format response as a JSON array. Each object should have:
                        - "question": string
                        - "options": array of 4 strings
                        - "correctAnswer": string`,
            },
            { role: "user", content: userInput },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Raw API Response:", data.choices[0].message.content); // Debugging

      // ✅ Extract JSON portion correctly
      const match = data.choices[0].message.content.match(/\[([\s\S]*)\]/);
      if (!match) throw new Error("Invalid JSON format received.");
      const parsedQuiz = JSON.parse(match[0]);

      setQuiz(parsedQuiz);
      setAnswers({});
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError(error.message || "Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setAnswers({ ...answers, [questionIndex]: selectedOption });
  };

  const handleSubmitAnswers = () => {
    let correctCount = 0;
    let recommendations = [];

    quiz.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      } else {
        recommendations.push(userInput); // Suggest related topic as course
      }
    });

    setFeedback({
      score: `${correctCount} / ${quiz.length}`,
      message: correctCount === quiz.length ? "Great job! Keep it up!" : "You can improve! Here are some suggestions.",
      recommendations: [...new Set(recommendations)].map((topic) => `Consider learning more about ${topic}.`),
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>AI Quiz Generator</h2>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter a topic (e.g., Science, History, JavaScript)"
        style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      <button
        onClick={handleContentSubmit}
        style={{ padding: "10px 15px", backgroundColor: "#6a0dad", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Quiz"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {quiz.length > 0 && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
          <h3>Quiz:</h3>
          {quiz.map((q, index) => (
            <div key={index}>
              <p><strong>{q.question}</strong></p>
              {q.options.map((option, optionIndex) => (
                <label key={optionIndex} style={{ display: "block", marginBottom: "5px" }}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => handleAnswerChange(index, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button
            onClick={handleSubmitAnswers}
            style={{ marginTop: "10px", padding: "10px 15px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Submit Answers
          </button>
        </div>
      )}

      {feedback && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
          <h3>Results:</h3>
          <p>Score: {feedback.score}</p>
          <p>{feedback.message}</p>
          {feedback.recommendations.length > 0 && (
            <div>
              <h4>Course Recommendations:</h4>
              <ul>
                {feedback.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;
