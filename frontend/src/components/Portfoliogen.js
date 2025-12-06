import React, { useState } from "react";
import html2pdf from "html2pdf.js";

const PortfolioGenerator = () => {
  const [userData, setUserData] = useState({
    name: "",
    role: "",
    skills: "",
    experience: "",
    education: "",
    projects: "",
    image: null,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePortfolio = () => {
    if (!userData.name || !userData.skills) {
      setError("Please enter at least your name and skills.");
      return;
    }

    setError(null);

    const portfolioContent = `
      <div style="font-family: 'Poppins', sans-serif; background: linear-gradient(to right, #1e3c72, #2a5298); color: white; text-align: center; padding: 20px; max-width: 800px; margin: auto; border-radius: 15px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);">
        ${userData.image ? `<img src='${userData.image}' alt='Profile Image' style='width: 180px; height: 180px; border-radius: 50%; margin-bottom: 20px; border: 5px solid #ffcc00;' />` : ""}
        <h1 style="color: #ffcc00; font-weight: bold;">${userData.name}</h1>
        <h2>${userData.role}</h2>
        <p><strong>Skills:</strong> ${userData.skills}</p>
        <p><strong>Experience:</strong> ${userData.experience}</p>
        <p><strong>Education:</strong> ${userData.education}</p>
        <p><strong>Projects:</strong> ${userData.projects}</p>
      </div>
    `;

    const portfolioElement = document.createElement("div");
    portfolioElement.innerHTML = portfolioContent;
    html2pdf().from(portfolioElement).save(`${userData.name}_Portfolio.pdf`);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Poppins, sans-serif" }}>
      <h2 style={{ color: "#6a11cb" }}>✨ AI Portfolio Generator ✨</h2>
      <p style={{ fontSize: "18px", color: "#333" }}>Transform your professional experience into a stunning portfolio with AI</p>
      <input type="text" name="name" placeholder="Enter your Name" onChange={handleChange} style={{ padding: "10px", margin: "5px", borderRadius: "5px" }} /><br/>
      <input type="text" name="role" placeholder="Your Role (e.g., Software Developer)" onChange={handleChange} style={{ padding: "10px", margin: "5px", borderRadius: "5px" }} /><br/>
      <input type="text" name="skills" placeholder="Your Skills (comma-separated)" onChange={handleChange} style={{ padding: "10px", margin: "5px", borderRadius: "5px" }} /><br/>
      <input type="text" name="experience" placeholder="Your Experience (e.g., 3 years)" onChange={handleChange} style={{ padding: "10px", margin: "5px", borderRadius: "5px" }} /><br/>
      <input type="text" name="education" placeholder="Your Education (e.g., B.Tech in CSE)" onChange={handleChange} style={{ padding: "10px", margin: "5px", borderRadius: "5px" }} /><br/>
      <input type="text" name="projects" placeholder="Your Key Projects" onChange={handleChange} style={{ padding: "10px", margin: "5px", borderRadius: "5px" }} /><br/>
      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ padding: "10px", margin: "10px" }} /><br/><br/>
      <button onClick={generatePortfolio} style={{ padding: "12px 20px", background: "#6a11cb", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        Download Portfolio as PDF
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default PortfolioGenerator;