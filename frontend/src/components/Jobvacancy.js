import React, { useState } from "react";

export default function JobVacancyFinder() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getJobVacancies = async () => {
    if (!jobTitle.trim() || !location.trim()) {
      setError("Please enter both job title and location.");
      return;
    }

    setLoading(true);
    setError("");
    setJobs([]);

    const appId = "3e035bad"; // Replace with your Adzuna App ID
    const appKey = "588698bd9d960ff99aa1ba89ba76e765"; // Replace with your Adzuna API Key

    try {
      const response = await fetch(
        `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=5&what=${jobTitle}&where=${location}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setJobs(data.results);
      } else {
        setError("No job vacancies found. Try a different search.");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to fetch job listings. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-blue-800 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Job Vacancy Finder</h1>
      <div className="bg-white text-black p-6 rounded-xl shadow-lg w-full max-w-md text-center">
        <p className="mb-4">Enter job title and location:</p>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g., Software Engineer"
          className="p-2 border rounded w-3/4 mb-2"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., New York"
          className="p-2 border rounded w-3/4 mb-2"
        />
        <button
          onClick={getJobVacancies}
          className="p-2 bg-blue-700 text-white rounded hover:bg-blue-900"
        >
          Find Jobs
        </button>

        <div className="mt-4 text-left">
          {loading && <p className="text-gray-500">Loading jobs...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {jobs.length > 0 && (
            <ul className="mt-4">
              {jobs.map((job, index) => (
                <li key={index} className="mb-3 p-3 border rounded">
                  <strong>{job.title}</strong>
                  <p className="text-sm text-gray-600">{job.company.display_name}</p>
                  <a
                    href={job.redirect_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Job →
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
