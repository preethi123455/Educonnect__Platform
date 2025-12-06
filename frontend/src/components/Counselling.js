import React, { useState } from "react";

export default function CareerCounselor() {
  const [careerInput, setCareerInput] = useState("");
  const [result, setResult] = useState("Enter your ambition to get career advice.");
  const [loading, setLoading] = useState(false);

  const getCareerAdvice = async () => {
    if (!careerInput.trim()) {
      setResult("Please enter your ambition or interest.");
      return;
    }

    setLoading(true);
    setResult("Fetching career advice...");

    const apiKey = "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"; // Replace with your actual API key
    const url = "https://api.groq.com/openai/v1/chat/completions";

    const requestBody = {
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "You provide career advice based on user interest." },
        { role: "user", content: `What are the best career options for someone interested in ${careerInput}?` }
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
        setResult(data.choices[0].message.content.replace(/\n/g, "<br/>")); // Ensuring line breaks work
      } else {
        setResult("No career suggestions found. Try a different ambition.");
      }
    } catch (error) {
      console.error("Error fetching career data:", error);
      setResult("Error fetching job details. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-white text-white p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg w-full text-center">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-4">Career Counseling</h1>
        <p className="text-gray-700 text-lg mb-6">Enter your ambition or area of interest:</p>
        
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={careerInput}
            onChange={(e) => setCareerInput(e.target.value)}
            placeholder="e.g., Software Engineer, Doctor"
            className="flex-1 p-3 border-2 border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 transition duration-300"
          />
          <button
            onClick={getCareerAdvice}
            className="px-4 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-900 transition duration-300"
          >
            Get Advice
          </button>
        </div>

        <div className="mt-6 p-4 bg-purple-100 text-purple-900 rounded-lg shadow-md text-left">
          {loading ? (
            <p className="animate-pulse">Fetching career advice...</p>
          ) : (
            <p dangerouslySetInnerHTML={{ __html: result }}></p> // Render text with line breaks
          )}
        </div>
      </div>
    </div>
  );
}
