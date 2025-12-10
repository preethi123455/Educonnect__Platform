import React, { useContext, useState } from "react";
import { AppContext } from "./components/AppContext"; 
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import QuizGenerator from "./components/QuizGenerator";
import AIAssistant from "./components/AIAssistant";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import Leaderboard from "./components/Leaderboard";
import ContentExplorer from "./components/ContentExplorer";
import Header from "./components/Header";
import BookReader from "./components/BookReader";
import StudyScheduler from "./components/StudySchedulePlanner";
import styles from "./components/styles"; 
import "./App.css"; 
import Convo from "./components/Convo";
import StudySchedulePlanner from "./components/StudySchedulePlanner";
import Challenges from "./components/Challenges";
import Doubt from "./components/DoubtSolver";
import Counselling from "./components/Counselling";
import Mock from "./components/Mock";
import JobVacancyFinder from "./components/Jobvacancy";
import PortfolioGenerator from "./components/Portfoliogen";
import Games from "./components/Games";
import Latest from "./components/Latestevents";
import Login from "./Login";
import Signup from "./Signup";
import Road from "./components/Roadmap";
import Groups from "./components/Groups";
import Compiler from "./components/Compiler";
import Studie from "./components/Studyscheduler";

const App = () => {

  // ------------------------------
  // NEW: Signup/Login flow handler
  // ------------------------------
  const [authStep, setAuthStep] = useState("signup");  
  // signup → login → dashboard

  const { activeTab } = useContext(AppContext);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "quiz":
        return <QuizGenerator />;
      case "assistant":
        return <AIAssistant />;
      case "leaderboard":
        return <Leaderboard />;
      case "resume":
        return <ResumeAnalyzer />;
      case "content":
        return <ContentExplorer />;
      case "book":
        return <BookReader />;
      case "study":
        return <StudySchedulePlanner />;
      case "convo":
        return <Convo />;
      case "study-schedule":
        return <StudySchedulePlanner />;
      case "challenges":
        return <Challenges />;
      case "doubt":
        return <Doubt />;
      case "counselling":
        return <Counselling />;
      case "mock":
        return <Mock />;
      case "vac":
        return <JobVacancyFinder />;
      case "generator":
        return <PortfolioGenerator />;
      case "games":
        return <Games />;
      case "latest":
        return <Latest />;
      case "road":
        return <Road />;
      case "groups":
        return <Groups />;
      case "compiler":
        return <Compiler />;
      case "studie":
        return <Studie />;
      default:
        return <Dashboard />;
    }
  };

  // ------------------------------------------
  // AUTH FLOW: SIGNUP → LOGIN → DASHBOARD
  // ------------------------------------------

  if (authStep === "signup") {
    return <Signup onSignupSuccess={() => setAuthStep("login")} />;
  }

  if (authStep === "login") {
    return <Login onLoginSuccess={() => setAuthStep("dashboard")} />;
  }

  // After login → show full dashboard UI
  return (
    <div style={styles.appContainer}>
      <Header />
      <div style={styles.mainContent}>
        <Sidebar />
        <div style={styles.contentArea}>{renderActiveComponent()}</div>
      </div>
    </div>
  );
};

export default App;
