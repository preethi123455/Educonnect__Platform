import React, { useState, useContext } from 'react';
import { AppContext } from './AppContext';
import styles from './styles';

const ResumeAnalyzer = () => {
  const { groqApiKey } = useContext(AppContext);
  const [resumeText, setResumeText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);

  const handleResumeInput = (e) => {
    setResumeText(e.target.value);
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError("Please enter a valid resume.");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setAnalysisResults(null);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: `You are a resume analysis AI. Strictly return only a valid JSON response with no explanations, no extra text, and no formatting issues. The JSON must follow this exact structure:
              {
                "skills": [{"name": "JavaScript", "level": 80, "recommendation": "Improve React skills"}],
                "recommendations": ["Take an advanced React course"],
                "strengths": ["Strong problem-solving skills"],
                "weaknesses": ["Limited cloud experience"],
                "jobFit": [{"title": "Frontend Developer", "match": 85, "reason": "Strong JavaScript skills"}]
              }`
            },
            {
              role: 'user',
              content: `Analyze this resume:\n\n${resumeText}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      let rawContent = data.choices[0]?.message?.content?.trim();

      // Extract JSON using regex (Handles extra text issue)
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to extract valid JSON from response.");
      }

      const parsedResults = JSON.parse(jsonMatch[0]);

      setAnalysisResults(parsedResults);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#6a0dad', marginBottom: '20px' }}>AI Resume Analyzer</h2>
      <textarea
        placeholder="Paste your resume text here..."
        style={{ width: '100%', minHeight: '250px', padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0', marginBottom: '20px' }}
        value={resumeText}
        onChange={handleResumeInput}
      />
      {error && <div style={{ color: '#d32f2f', marginBottom: '15px', padding: '10px', background: '#ffebee' }}>{error}</div>}
      <button onClick={analyzeResume} style={styles.button} disabled={!resumeText.trim() || analyzing}>
        {analyzing ? "Analyzing..." : "Analyze Resume"}
      </button>

      {analysisResults && (
        <div style={styles.card}>
          <h3>Analysis Results</h3>

          <h4>✅ Skills:</h4>
          <ul>
            {analysisResults.skills?.map((skill, index) => (
              <li key={index}><strong>{skill.name}</strong>: {skill.level}% - {skill.recommendation}</li>
            ))}
          </ul>

          <h4>🟢 Strengths:</h4>
          <ul>
            {analysisResults.strengths?.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>

          <h4>🟡 Areas for Improvement:</h4>
          <ul>
            {analysisResults.weaknesses?.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>

          <h4>📌 Recommendations:</h4>
          <ul>
            {analysisResults.recommendations?.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>

          <h4>💼 Job Fit Suggestions:</h4>
          <ul>
            {analysisResults.jobFit?.map((job, index) => (
              <li key={index}><strong>{job.title}</strong> - Match: {job.match}% | Reason: {job.reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
