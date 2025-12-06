import React, { useState } from "react";

const Games = () => {
  const [activeGame, setActiveGame] = useState(null);

  const openGame = (game) => {
    setActiveGame(game);
  };

  const closeGame = () => {
    setActiveGame(null);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", background: "#20002c", color: "white" }}>
      <h1 style={{ color: "#bb86fc" }}>Game Hub</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
        {['Chess', 'TicTacToe', 'Snake', 'WordGame'].map((game) => (
          <button key={game} onClick={() => openGame(game)}
            style={{ background: "#bb86fc", color: "white", padding: "15px 30px", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "18px" }}>
            {game}
          </button>
        ))}
      </div>
      {activeGame && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0, 0, 0, 0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "10px", width: "80vw", height: "80vh", overflow: "auto" }}>
            <button onClick={closeGame} style={{ float: "right", padding: "5px 10px", fontSize: "16px", cursor: "pointer" }}>X</button>
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

const ChessGame = () => {
  return <p>Chess Game Coming Soon!</p>;
};

const TicTacToe = () => {
  return <p>Tic-Tac-Toe Game Coming Soon!</p>;
};

const SnakeGame = () => {
  return <p>Snake Game Coming Soon!</p>;
};

const WordGame = () => {
  const [word, setWord] = useState("");
  const [response, setResponse] = useState("");

  const fetchAIResponse = async () => {
    const apiKey = "YOUR_GROQ_API_KEY";
    const response = await fetch("https://api.groq.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "llama3-8b-8192", messages: [{ role: "user", content: `Make a sentence with the word: ${word}` }] })
    });
    const data = await response.json();
    setResponse(data.choices[0].message.content);
  };

  return (
    <div>
      <input type="text" value={word} onChange={(e) => setWord(e.target.value)} placeholder="Enter a word" style={{ padding: "10px", fontSize: "16px" }} />
      <button onClick={fetchAIResponse} style={{ padding: "10px", marginLeft: "10px", fontSize: "16px", cursor: "pointer" }}>Submit</button>
      <p>{response}</p>
    </div>
  );
};

export default Games;