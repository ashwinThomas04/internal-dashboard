import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import CONFIG from './config';

const root = ReactDOM.createRoot(document.getElementById(CONFIG.domBaseID));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);