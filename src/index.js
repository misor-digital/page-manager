import React    from "react";
import ReactDOM from 'react-dom/client';

import './popup.css';
import './popup.js';
import App from './App.js';

window.React = React;

const root = ReactDOM.createRoot(document.getElementById('app'));

root.render(
  <App />
);
