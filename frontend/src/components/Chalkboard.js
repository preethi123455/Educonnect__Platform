import React, { useState, useRef, useEffect } from "react";

const AIChalkboardTutor = () => {
  const [question, setQuestion] = useState("");
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const fetchSolution = async () => {
    setLoading(true);
    setSteps([]);
    speechSynthesis.cancel(); // clear previous audio
    const apiKey = "3gzaAx0VwCSxfNH0psgVxCPJjXz9o3Y4A72tNDw8q5bTbT9Lxf1TxX9IwdnA";

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: Bearer ${apiKey},
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: "You are a math tutor. Break down the given math problem into simple step-by-step explanations. Return only a numbered list of the steps.",
            },
            {
              role: "user",
              content: question,
            },
          ],
        }),
      });

      const data = await response.json();
      const message = data.choices?.[0]?.message?.content;
      const parsedSteps = message.split(/\n\d+\. /).filter(Boolean);
      setSteps(parsedSteps);
      speakSteps(parsedSteps);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  const speakSteps = (steps) => {
    speechSynthesis.cancel(); // ensure clean start
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = steps.join(". ");
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (steps.length > 0) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.font = "20px 'Gloria Hallelujah', cursive";
      ctx.fillStyle = "white";
      ctx.shadowColor = "white";
      ctx.shadowBlur = 3;

      let y = 40;
      steps.forEach((step, i) => {
        setTimeout(() => {
          ctx.fillText(${i + 1}. ${step}, 20, y);
          y += 40;
        }, i * 1000);
      });
    }
  }, [steps]);

  return (
    <div style={styles.container}>
      {/* Google Font Link */}
      <link
        href="https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap"
        rel="stylesheet"
      />

      <h1 style={styles.title}>🧠 AI Chalkboard Tutor</h1>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter a math problem (e.g., Solve 2x + 3 = 7)"
        rows={3}
        style={styles.textarea}
      />
      <button onClick={fetchSolution} style={styles.button} disabled={loading}>
        {loading ? "Solving..." : "Show on Chalkboard"}
      </button>

      {loading && (
        <p style={{ color: "white", textAlign: "center", marginTop: "10px" }}>
          🧠 Thinking...
        </p>
      )}

      <div style={styles.chalkboardWrapper}>
        <canvas ref={canvasRef} width={700} height={400} style={styles.canvas} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "skyblue",
    minHeight: "100vh",
    padding: "30px",
    color: "#000",
  },
  title: {
    textAlign: "center",
    fontSize: "2.2rem",
    color: "white",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "white",
    color: "#000",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
  },
  chalkboardWrapper: {
    marginTop: "30px",
    backgroundColor: "black",
    padding: "20px",
    borderRadius: "15px",
    display: "flex",
    justifyContent: "center",
  },
  canvas: {
    backgroundColor: "#111",
    border: "3px dashed white",
  },
};

export default AIChalkboardTutor;