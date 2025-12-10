import React, { useState } from 'react';
import styles from "./styles";

const AIAssistant = () => {

  const groqApiKey = process.env.REACT_APP_GROQ_API_KEY; // ⭐ NEW

  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your AI learning assistant. How can I help you today?" }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('general');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const currentMessages = [...messages, userMessage];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: mode === 'general' ? 'llama-3.1-8b-instant' : 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content:
                mode === 'general'
                  ? 'You are an AI learning assistant helping students.'
                  : 'You are a coding expert helping programmers.',
            },
            ...currentMessages
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.",
        },
      ]);

    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Error connecting to AI. Try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 140px)' }}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>AI Learning Assistant</h2>

        <button
          onClick={() => setMode('general')}
          style={{
            ...styles.button,
            background: mode === 'general' ? '#6a0dad' : '#f0e6ff',
            color: mode === 'general' ? 'white' : '#6a0dad',
          }}
        >
          General Help
        </button>
      </div>

      <div style={{ ...styles.card, height: 'calc(100% - 70px)', marginTop: '15px', display: 'flex', flexDirection: 'column' }}>
        <div style={styles.chatMessages}>
          {messages.map((msg, i) => (
            <div key={i} style={msg.role === 'user' ? styles.messageUser : styles.messageBot}>
              {msg.content}
            </div>
          ))}
          {loading && <div style={styles.messageBot}>Thinking...</div>}
        </div>

        <div style={{ display: 'flex', gap: '10px', padding: '15px', borderTop: '1px solid #f0f0f0' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask the assistant...`}
            style={{
              flex: 1,
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '14px',
            }}
          />

          <button onClick={handleSend} style={styles.button} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
