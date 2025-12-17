import React, { useState } from "react";

const Games = () => {
  const [activeGame, setActiveGame] = useState(null);

  const openGame = (game) => setActiveGame(game);
  const closeGame = () => setActiveGame(null);

  return (
    <div style={{ textAlign: "center", padding: "20px", background: "#20002c", color: "white" }}>
      <h1 style={{ color: "#bb86fc" }}>Game Hub</h1>

      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "20px", 
        flexWrap: "wrap" 
      }}>
        {["Chess", "TicTacToe", "Snake", "WordGame"].map((game) => (
          <button 
            key={game} 
            onClick={() => openGame(game)}
            style={{
              background: "#bb86fc",
              color: "white",
              padding: "15px 30px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "18px"
            }}
          >
            {game}
          </button>
        ))}
      </div>

      {activeGame && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "80vw",
            height: "80vh",
            overflow: "auto"
          }}>
            <button 
              onClick={closeGame} 
              style={{
                float: "right",
                padding: "5px 10px",
                fontSize: "16px",
                cursor: "pointer"
              }}
            >
              X
            </button>

            <h2>{activeGame}</h2>

            {activeGame === "Chess" && <ChessGame />}
            {activeGame === "TicTacToe" && <TicTacToe />}
            {activeGame === "Snake" && <SnakeGame />}
            {activeGame === "WordGame" && <WordGame />}
          </div>
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------
// STATIC GAMES
// -----------------------------------------------------
const ChessGame = () => <p>Chess Game Coming Soon!</p>;
const TicTacToe = () => <p>Tic-Tac-Toe Game Coming Soon!</p>;
const SnakeGame = () => <p>Snake Game Coming Soon!</p>;

// -----------------------------------------------------
// WORD GAME WITH BACKEND AI (NO API KEY IN FRONTEND)
// -----------------------------------------------------
const WordGame = () => {
  const [word, setWord] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAIResponse = async () => {
    if (!word.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        "https://educonnect-platform-backend.onrender.com/api/ask",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { role: "system", content: "You generate example sentences for English learning." },
              { role: "user", content: `Make a simple sentence using the word: ${word}` }
            ],
            mode: "general"
          })
        }
      );

      const data = await res.json();

      const aiText =
        data?.choices?.[0]?.message?.content ||
        "Unable to generate a sentence.";

      setResponse(aiText);
    } catch (err) {
      setResponse("Error contacting AI. Try again.");
    }

    setLoading(false);
  };

  return (
    <div>
      <input 
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter a word"
        style={{ padding: "10px", fontSize: "16px", width: "250px" }}
      />

      <button
        onClick={fetchAIResponse}
        style={{
          padding: "10px",
          marginLeft: "10px",
          fontSize: "16px",
          cursor: "pointer",
          background: "#6a0dad",
          color: "white",
          borderRadius: "6px",
          border: "none"
        }}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Submit"}
      </button>

      <p style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>
        {response}
      </p>
    </div>
  );
};

export default Games;
