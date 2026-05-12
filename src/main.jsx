/**
 * @file main.jsx
 * @description Punctul de intrare în aplicația React.
 * @author Crudu Ioana Andreea
 * @contribution Configurarea mediului de execuție și randarea arborelui principal al componentelor.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)