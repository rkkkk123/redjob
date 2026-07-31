import React from 'react';
import { HelpCircle } from 'lucide-react';
import './FlagCard.css';

const severityConfig = {
  red: {
    color: 'var(--semantic-red)',
    bg: 'var(--semantic-red-bg)',
    label: 'Red Flag'
  },
  amber: {
    color: 'var(--semantic-amber)',
    bg: 'var(--semantic-amber-bg)',
    label: 'Yellow Flag'
  },
  green: {
    color: 'var(--semantic-green)',
    bg: 'var(--semantic-green-bg)',
    label: 'Positive Signal'
  }
};

const FlagCard = ({ severity = 'red', quote, reason, question, index = 0 }) => {
  const config = severityConfig[severity];
  
  // Calculate stagger class (max 4 to loop if many cards)
  const staggerClass = `animate-stagger-${(index % 4) + 1}`;

  return (
    <div 
      className={`flag-card ${staggerClass}`}
      style={{
        borderLeftColor: config.color,
        backgroundColor: `color-mix(in srgb, ${config.bg} 30%, var(--surface))`
      }}
    >
      <div 
        className="flag-pill"
        style={{
          color: config.color,
          backgroundColor: config.bg,
          borderColor: `color-mix(in srgb, ${config.color} 30%, transparent)`
        }}
      >
        {config.label}
      </div>
      
      <div className="flag-quote">"{quote}"</div>
      
      <p className="flag-reason">{reason}</p>
      
      {question && (
        <div className="flag-question">
          <HelpCircle size={14} className="flag-question-icon" />
          <span>{question}</span>
        </div>
      )}
    </div>
  );
};

export default FlagCard;
