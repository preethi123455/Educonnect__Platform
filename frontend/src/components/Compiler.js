import React, { useState } from "react";

const Compiler = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");

  const runCode = async () => {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer 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`, // Replace with your actual API key
        },
        body: JSON.stringify({
          model: "llama3-8b-8192", // Ensure this model is correct
          messages: [
            {
              role: "system",
              content: `You are a code execution assistant. Execute the following ${language} code and provide the output.`
            },
            {
              role: "user",
              content: `Execute this ${language} code:\n${code}`
            }
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      setOutput(data.choices[0]?.message?.content || "No output received");
    } catch (error) {
      setOutput("Error executing code");
    }
  };

  return (
    <div className="flex flex-col items-center p-5 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Multi-Language Compiler</h2>
      <select
        className="p-2 mb-4 border rounded-lg"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
      </select>
      <textarea
        rows="7"
        cols="50"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
        className="border rounded-lg p-2 w-3/4 mb-4 shadow-lg"
      ></textarea>
      <button
        onClick={runCode}
        className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700"
      >
        Run Code
      </button>
      <pre className="bg-gray-200 p-4 mt-4 w-3/4 rounded-lg shadow-inner">
        {output}
      </pre>
    </div>
  );
};

export default Compiler;