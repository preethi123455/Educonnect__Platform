import React, { useState } from "react";
import Tesseract from "tesseract.js";

const DoubtSolver = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [imageText, setImageText] = useState("");

  const API_KEY = "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"; // Replace with valid API key

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      extractTextFromImage(file);
    }
  };

  // Extract text from image using OCR (Tesseract.js)
  const extractTextFromImage = async (file) => {
    setLoading(true);
    setImageText("");
    try {
      const { data } = await Tesseract.recognize(file, "eng");
      setImageText(data.text.trim());
    } catch (err) {
      setError("Failed to extract text from image.");
    }
    setLoading(false);
  };

  // Send query to AI
  const handleAskAI = async () => {
    const inputText = imageText || query;
    if (!inputText.trim()) {
      setError("Please enter a doubt or upload an image.");
      return;
    }

    setLoading(true);
    setResponse("");
    setError(null);

    try {
      const requestBody = {
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are an AI tutor specializing in English and Tamil language learning. Provide grammar corrections, vocabulary suggestions, and explanations."
          },
          { role: "user", content: inputText }
        ],
      };

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      console.log("API Response:", data); // Debugging API response

      if (res.status !== 200) {
        throw new Error(data.error?.message || "Unexpected API error");
      }

      if (data.choices && data.choices.length > 0) {
        setResponse(data.choices[0].message.content);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setError(error.message || "Error fetching response. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Doubt-Solving AI</h2>

      {/* Text Input */}
      <textarea
        style={styles.textarea}
        placeholder="Enter your doubt here..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Image Upload */}
      <input type="file" accept="image/*" onChange={handleImageUpload} style={styles.fileInput} />
      
      {/* Show Uploaded Image */}
      {image && <img src={image} alt="Uploaded Doubt" style={styles.image} />}
      
      {/* Show Extracted Text */}
      {imageText && (
        <div style={styles.extractedText}>
          <strong>Extracted Text:</strong> {imageText}
        </div>
      )}

      {/* Solve Doubt Button */}
      <button style={styles.button} onClick={handleAskAI} disabled={loading}>
        {loading ? "Thinking..." : "Solve Doubt"}
      </button>

      {/* Error Message */}
      {error && <div style={styles.error}>{error}</div>}

      {/* AI Response */}
      {response && <div style={styles.response}>{response}</div>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    backgroundColor: "#f5f0ff",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  heading: { color: "#6a0dad" },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #6a0dad",
    outline: "none",
    resize: "none",
  },
  fileInput: {
    marginTop: "10px",
  },
  image: {
    marginTop: "10px",
    width: "100%",
    maxHeight: "200px",
    objectFit: "cover",
    borderRadius: "5px",
    border: "1px solid #6a0dad",
  },
  extractedText: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#fff8e1",
    borderRadius: "5px",
    border: "1px solid #ffa000",
    textAlign: "left",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#6a0dad",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  response: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "white",
    border: "1px solid #6a0dad",
    borderRadius: "5px",
    textAlign: "left",
  },
  error: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#ffcccc",
    color: "#d8000c",
    border: "1px solid #d8000c",
    borderRadius: "5px",
    textAlign: "center",
  },
};

export default DoubtSolver;
