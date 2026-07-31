import React, { useEffect, useState } from 'react';
import './ScoreCard.css';

const getScoreColor = (score) => {
  if (score >= 70) return 'var(--semantic-green)';
  if (score >= 40) return 'var(--semantic-amber)';
  return 'var(--semantic-red)';
};

const getScoreBgColor = (score) => {
  if (score >= 70) return 'var(--semantic-green-bg)';
  if (score >= 40) return 'var(--semantic-amber-bg)';
  return 'var(--semantic-red-bg)';
};

const getVerdict = (score) => {
  if (score >= 70) return 'Proceed with Confidence';
  if (score >= 40) return 'Proceed with Caution';
  return 'High Risk Environment';
};

const ScoreCard = ({ score, summary }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    let start = 0;
    const duration = 600;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-in-out cubic
      const easeProgress = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      setDisplayScore(Math.round(easeProgress * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="score-card animate-stagger-1">
      <div className="score-ring-container">
        <svg className="score-ring-svg" width="80" height="80" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="4"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="score-ring-progress"
          />
        </svg>
        <div className="score-number">{displayScore}</div>
      </div>
      
      <h2 className="score-verdict">{getVerdict(score)}</h2>
      
      <div 
        className="score-badge" 
        style={{ 
          color: getScoreColor(score),
          backgroundColor: getScoreBgColor(score),
          borderColor: `color-mix(in srgb, ${getScoreColor(score)} 30%, transparent)`
        }}
      >
        {score >= 70 ? 'Healthy Signals' : score >= 40 ? 'Mixed Signals' : 'Warning Signals'}
      </div>
      
      <p className="score-summary">{summary}</p>
    </div>
  );
};

export default ScoreCard;
