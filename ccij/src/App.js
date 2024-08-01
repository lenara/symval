import React, { useState } from 'react';
import logo from './logo.png';
import './App.css';
function App() {
  const [ethAddress, setEthAddress] = useState("0x1234567890abcdef");

  function generateCCIJNFT(name) {
    return `
      <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:rgb(70,130,180);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(0,191,255);stop-opacity:1" />
          </linearGradient>
        </defs>
        <!-- Background -->
        <rect width="800" height="400" fill="url(#grad1)" />

        <!-- CCIJ Logo -->
        <image href="${logo}" x="20" y="20" height="60px" width="160px"/>

        <!-- Message -->
        <text x="20" y="150" font-family="Arial" font-size="24" fill="#FFF" text-shadow="2px 2px 4px #000000">
          CCIJ thanks <tspan font-weight="bold">${name}</tspan> for your support
        </text>
      </svg>
    `;
  }

  const nftSvg = generateCCIJNFT(ethAddress);

  return (
    <div className="App">
      <header className="App-header">
        {/*
          <img src={logo} className="App-logo" alt="logo" />
        <p>
          CCIJ token design
        </p>
        <a
          className="App-link"
          href="https://ccij.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          CCIJ website
        </a>
        */}
        <div dangerouslySetInnerHTML={{ __html: nftSvg }} />
      </header>
    </div>
  );
}

export default App;
