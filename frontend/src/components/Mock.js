import React, { useState, useEffect } from "react";

export default function MockInterview() {
  const [field, setField] = useState("");
  const [question, setQuestion] = useState("Enter your field to get an interview question.");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userResponse, setUserResponse] = useState("");
  
  const apiKey = "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"; // Replace with actual API key
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const startInterview = async () => {
    if (!field.trim()) {
      setQuestion("Please enter a field of study or job role.");
      return;
    }

    setLoading(true);
    setQuestion("Generating interview question...");
    setFeedback("");

    const requestBody = {
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "You act as an interviewer providing domain-specific questions and feedback." },
        { role: "user", content: `Provide a mock interview question for a ${field} candidate.` }
      ],
      max_tokens: 200
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setQuestion(data.choices[0].message.content);
      } else {
        setQuestion("No question generated. Try again.");
      }
    } catch (error) {
      console.error("Error fetching interview question:", error);
      setQuestion("Error fetching question. Please try again.");
    }

    setLoading(false);
  };

  const startListening = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserResponse(transcript);
      };

      recognition.start();
    } catch (error) {
      console.error("Speech recognition error:", error);
    }
  };

  const getFeedback = async () => {
    if (!userResponse) {
      setFeedback("Please provide an answer first.");
      return;
    }

    setLoading(true);
    setFeedback("Analyzing your response...");

    const requestBody = {
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "You provide feedback on a candidate’s mock interview answer." },
        { role: "user", content: `Provide feedback on this answer to the question: "${question}" \n Answer: "${userResponse}"` }
      ],
      max_tokens: 200
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setFeedback(data.choices[0].message.content);
      } else {
        setFeedback("No feedback generated. Try again.");
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setFeedback("Error fetching feedback. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>AI Mock Interview</h1>
      <div style={styles.box}>
        <p style={styles.label}>Enter your field to start the mock interview:</p>
        <input
          type="text"
          value={field}
          onChange={(e) => setField(e.target.value)}
          placeholder="e.g., Software Engineer, Data Scientist"
          style={styles.input}
        />
        <button onClick={startInterview} style={styles.button}>Start Interview</button>

        <div style={styles.responseBox}>
          {loading ? <p style={styles.loading}>Loading...</p> : <p dangerouslySetInnerHTML={{ __html: question }}></p>}
        </div>

        {question && !question.startsWith("Enter your field") && (
          <button onClick={startListening} style={styles.voiceButton}>
            {isListening ? "Listening..." : "Answer with Voice"}
          </button>
        )}

        {userResponse && <p style={styles.userResponse}>Your Answer: {userResponse}</p>}

        {userResponse && (
          <button onClick={getFeedback} style={styles.feedbackButton}>Get Feedback</button>
        )}

        <div style={styles.feedbackBox}>
          {feedback && <p dangerouslySetInnerHTML={{ __html: feedback }}></p>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#0d0d0d",
    padding: "20px",
    color: "white",
  },
  header: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#A855F7",
  },
  box: {
    backgroundColor: "#1a1a2e",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 4px 15px rgba(168, 85, 247, 0.5)",
    width: "80%",
    maxWidth: "700px",
    textAlign: "center",
  },
  label: {
    marginBottom: "10px",
    fontSize: "1.1rem",
  },
  input: {
    width: "70%",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#A855F7",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  responseBox: {
    marginTop: "20px",
    backgroundColor: "#2c2c54",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "1.1rem",
    color: "#fff",
  },
  voiceButton: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#ffcc00",
    border: "none",
    color: "black",
    cursor: "pointer",
    borderRadius: "5px",
  },
  userResponse: {
    marginTop: "15px",
    fontSize: "1.1rem",
    color: "#FFD700",
  },
  feedbackButton: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#32CD32",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  },
  feedbackBox: {
    marginTop: "15px",
    backgroundColor: "#2c2c54",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "1.1rem",
    color: "#FFD700",
  },
};
