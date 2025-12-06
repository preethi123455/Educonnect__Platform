import React, { useState, useContext, useRef, useEffect } from "react";
import { AppContext } from "./AppContext";

const BookReader = () => {
  const { groqApiKey, addPoints, voiceEnabled } = useContext(AppContext);
  const [bookText, setBookText] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const speechSynthesisRef = useRef(null);

  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const analyzeContent = async () => {
    if (!bookText.trim()) return;

    setAnalyzing(true);
    setError(null);

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
            { role: "system", content: "You are an expert literary analyst. Analyze the book content." },
            { role: "user", content: `Analyze this book content: ${bookText.substring(0, 5000)}` },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data.choices[0]?.message?.content || "No analysis available.");
      addPoints(50);
    } catch (error) {
      console.error("Error analyzing book content:", error);
      setError("Failed to analyze content. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const readAloud = (text) => {
    if (!voiceEnabled || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
    utterance.onend = () => {
      setIsReading(false);
      speechSynthesisRef.current = null;
    };
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    speechSynthesisRef.current = null;
  };

  return (
    <div style={styles.bookReader}>
      <h2 style={styles.title}>📖 AI Book Reader & Analyzer</h2>
      <div style={styles.inputSection}>
        <input type="text" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} placeholder="Enter book title" style={styles.input} />
        <textarea value={bookText} onChange={(e) => setBookText(e.target.value)} placeholder="Paste book content here..." style={styles.textarea} />
        <button style={styles.analyzeBtn} onClick={analyzeContent} disabled={analyzing}>
          {analyzing ? "Analyzing..." : "Analyze Content"}
        </button>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      
      {analysis && (
        <div style={styles.analysisContainer}>
          <h3 style={styles.analysisTitle}>📚 AI Analysis:</h3>
          <pre style={styles.analysis}>{analysis}</pre>
          <button style={styles.readBtn} onClick={() => readAloud(analysis)} disabled={isReading}>
            {isReading ? "📢 Reading..." : "🔊 Read Aloud"}
          </button>
          {isReading && <button style={styles.stopBtn} onClick={stopReading}>🛑 Stop</button>}
        </div>
      )}
    </div>
  );
};

// Internal CSS styles as a JavaScript object
const styles = {
  bookReader: {
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
    background: "#f5f5f5",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    color: "#6a0dad",
    textAlign: "center",
    marginBottom: "20px",
  },
  inputSection: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "16px",
    height: "150px",
  },
  analyzeBtn: {
    width: "100%",
    padding: "10px",
    background: "#6a0dad",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  analysisContainer: {
    background: "#111",
    color: "lightgreen",
    padding: "15px",
    borderRadius: "5px",
    boxShadow: "0px 2px 6px rgba(0, 255, 0, 0.3)",
    fontFamily: "monospace",
    fontSize: "15px",
    marginTop: "20px",
    overflowX: "auto",
  },
  analysisTitle: {
    color: "white",
    textAlign: "left",
    marginBottom: "10px",
  },
  analysis: {
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    lineHeight: "1.5",
  },
  readBtn: {
    marginTop: "10px",
    padding: "8px 15px",
    background: "#007bff",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
  },
  stopBtn: {
    marginLeft: "10px",
    background: "red",
    color: "white",
  },
};

export default BookReader;
