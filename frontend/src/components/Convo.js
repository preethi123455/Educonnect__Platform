import React, { useState } from "react";

const AiBot = () => {
  const [input, setInput] = useState("");
  const [convo, setConvo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChat = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-70b-8192", // Updated model
          messages: [
            { role: "system", content: "You are an AI tutor specializing in English and Tamil language learning. You provide grammar corrections, vocabulary suggestions, and interactive learning for students." },
            { role: "user", content: input }
          ],
          temperature: 0.7,
          max_tokens: 300,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const chatResponse = data.choices?.[0]?.message?.content || "No response from AI";

      setConvo((prevConvo) => [...prevConvo, { user: input, ai: chatResponse }]);
      setInput("");
    } catch (error) {
      setError(`Error: ${error.message}`);
      console.error("Request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📚 AI Language Tutor</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="learn language with me......"
        style={styles.textarea}
      />
      <button onClick={handleChat} style={styles.button} disabled={loading}>
        {loading ? "Analyzing..." : "Send"}
      </button>
      {error && <p style={styles.error}>{error}</p>}
      <h3 style={styles.convoTitle}>🗨️ Conversation & Feedback</h3>
      <div style={styles.convoContainer}>
        {convo.length === 0 ? (
          <p style={styles.noConvo}>Start a conversation to improve your language skills!</p>
        ) : (
          convo.map((msg, index) => (
            <div key={index} style={styles.message}>
              <p><strong>👤 You:</strong> {msg.user}</p>
              <p><strong>🤖 AI:</strong> {msg.ai}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "600px",
    margin: "20px auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
    borderRadius: "5px",
    fontSize: "16px",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#27ae60",
    color: "white",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
  convoTitle: {
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "left",
  },
  convoContainer: {
    backgroundColor: "#34495e",
    padding: "10px",
    borderRadius: "5px",
    marginTop: "10px",
    textAlign: "left",
    maxHeight: "300px",
    overflowY: "auto",
  },
  noConvo: {
    color: "#ccc",
    fontStyle: "italic",
  },
  message: {
    padding: "10px",
    borderBottom: "1px solid #fff",
    marginBottom: "5px",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};

export default AiBot;