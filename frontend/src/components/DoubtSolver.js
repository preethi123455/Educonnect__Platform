import React, { useState } from "react";
import Tesseract from "tesseract.js";

const DoubtSolver = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! Upload an image or type your doubt. I’ll help you with English and Tamil learning ✨",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageText, setImageText] = useState("");
  const [error, setError] = useState(null);

  // -----------------------------
  // IMAGE UPLOAD + OCR
  // -----------------------------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setLoading(true);
    setError(null);
    setImageText("");

    try {
      const { data } = await Tesseract.recognize(file, "eng");
      setImageText(data.text.trim());
    } catch (err) {
      setError("Failed to extract text from image.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // FORMAT LONG TEXT FOR CLEAN DISPLAY
  // -----------------------------
  const formatText = (text) => {
    return text
      .replace(/\. /g, ".\n\n") // Add spacing after sentences
      .replace(/docker/g, "\ndocker") // New line before each docker command
      .replace(/\n\n\n/g, "\n\n"); // Remove excessive newlines
  };

  // -----------------------------
  // SEND MESSAGE TO BACKEND AI
  // -----------------------------
  const handleSend = async () => {
    const finalInput = imageText || input;

    if (!finalInput.trim()) {
      setError("Please type a doubt or upload an image.");
      return;
    }

    const userMsg = { role: "user", content: finalInput };
    const updated = [...messages, userMsg];

    setMessages(updated);
    setInput("");
    setImageText("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://educonnect-platform-backend.onrender.com/api/ask",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content:
                  "You are an AI tutor specializing in English, Tamil, and technical explanation formatting. Always return clean, aligned, spaced content.",
              },
              ...updated,
            ],
            mode: "general",
          }),
        }
      );

      const data = await res.json();

      const aiResponse =
        data?.choices?.[0]?.message?.content ||
        "Sorry, I couldn't generate a response.";

      // Apply formatting before displaying
      const formatted = formatText(aiResponse);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: formatted },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error connecting to AI. Try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Doubt Solver AI</h2>

      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <div key={i} style={m.role === "user" ? styles.userMsg : styles.botMsg}>
            <pre style={styles.pre}>{m.content}</pre>
          </div>
        ))}
        {loading && <div style={styles.botMsg}>Thinking...</div>}
      </div>

      <textarea
        placeholder="Type your doubt..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={styles.textarea}
      />

      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {image && <img src={image} alt="preview" style={styles.image} />}

      {imageText && (
        <div style={styles.extractedBox}>
          <strong>Extracted Text:</strong>
          <pre style={styles.pre}>{imageText}</pre>
        </div>
      )}

      <button onClick={handleSend} disabled={loading} style={styles.button}>
        Solve Doubt
      </button>

      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: "700px",
    margin: "30px auto",
    padding: "20px",
    background: "#f5f0ff",
    borderRadius: "12px",
  },
  heading: {
    color: "#6a0dad",
    fontSize: "24px",
    marginBottom: "15px",
  },
  chatBox: {
    background: "#fff",
    minHeight: "220px",
    padding: "10px",
    overflowY: "auto",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  userMsg: {
    background: "#e8dbff",
    padding: "8px",
    textAlign: "right",
    marginBottom: "8px",
    borderRadius: "6px",
    whiteSpace: "pre-wrap",
  },
  botMsg: {
    background: "#ffffff",
    border: "1px solid #ddd",
    padding: "8px",
    marginBottom: "8px",
    borderRadius: "6px",
    whiteSpace: "pre-wrap",
  },
  pre: {
    whiteSpace: "pre-wrap",
    fontFamily: "monospace",
    fontSize: "14px",
    margin: 0,
  },
  textarea: {
    width: "100%",
    padding: "10px",
    height: "80px",
    borderRadius: "8px",
    border: "1px solid #6a0dad",
    marginBottom: "10px",
  },
  image: {
    width: "100%",
    borderRadius: "6px",
    marginTop: "10px",
  },
  extractedBox: {
    marginTop: "10px",
    background: "#fff8e1",
    padding: "10px",
    borderRadius: "6px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#6a0dad",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  error: {
    marginTop: "10px",
    background: "#ffdddd",
    padding: "10px",
    borderRadius: "6px",
    color: "red",
  },
};

export default DoubtSolver;
