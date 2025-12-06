import React from "react";
import ReactDOM from "react-dom/client"; // Import from react-dom/client in React 18
import App from "./App";
import { AppProvider } from "./components/AppContext"; // Import AppProvider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppProvider> 
      <App />
    </AppProvider>
  </React.StrictMode>
);
