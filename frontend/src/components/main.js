import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './AppContext';

// Create container for rendering
const container = document.getElementById('root') || document.body;
const renderDiv = document.createElement('div');
renderDiv.id = 'renderDiv';
container.appendChild(renderDiv);

// Apply global styles
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.fontFamily = 'Poppins, system-ui, sans-serif';
document.body.style.boxSizing = 'border-box';
document.body.style.background = '#f9f5ff';

// Render the application
const root = ReactDOM.createRoot(renderDiv);
root.render(
  <AppProvider>
    <App />
  </AppProvider>
);