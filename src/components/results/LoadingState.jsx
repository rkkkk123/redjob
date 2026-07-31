import React, { useState, useEffect } from 'react';
import './LoadingState.css';

const phrases = [
  "Reading between the lines…",
  "Checking the signals…",
  "Decoding corporate jargon…",
  "Cross-referencing 10,000 JDs…",
  "Finalizing verdict…"
];

const LoadingState = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-state">
      <div className="scanner-container">
        {/* Mock wireframe of a job description */}
        <div className="wireframe-content">
          <div className="wireframe-line header" />
          <div className="wireframe-line sub" />
          <div className="wireframe-line" style={{width: '90%'}} />
          <div className="wireframe-line" style={{width: '85%'}} />
          <div className="wireframe-line" style={{width: '95%'}} />
          <div className="wireframe-line sub" style={{marginTop: '24px'}} />
          <div className="wireframe-line" style={{width: '80%'}} />
          <div className="wireframe-line" style={{width: '85%'}} />
        </div>
        
        {/* The sweeping laser beam */}
        <div className="scanner-laser" />
        <div className="scanner-glow" />
      </div>

      <div className="loading-phrase-container">
        <div className="loading-spinner"></div>
        {phrases.map((phrase, index) => (
          <div 
            key={index} 
            className={`loading-phrase ${index === phraseIndex ? 'active' : ''}`}
          >
            {phrase}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
