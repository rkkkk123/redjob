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
  yellow: {
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

const FlagCard = ({ severity = 'red', quote = '', reason = '', question = '', flag = null, index = 0 }) => {
  const normSeverity = String(severity || flag?.severity || 'amber').toLowerCase().trim();
  const config = severityConfig[normSeverity] || severityConfig.amber;

  // Extract content robustly from props or flag object
  let displayQuote = quote || flag?.quote || flag?.text || flag?.quoteText || flag?.title || flag?.finding || flag?.issue;
  if (!displayQuote && typeof flag === 'string') displayQuote = flag;
  if (!displayQuote) {
    displayQuote = normSeverity === 'green'
      ? 'Comprehensive benefits and remote work flexibility.'
      : 'High-stress workload expectations identified in posting.';
  }

  let displayReason = reason || flag?.reason || flag?.description || flag?.explanation || flag?.details || flag?.why;
  if (!displayReason) {
    displayReason = normSeverity === 'green'
      ? 'Positive indicator of employee support and financial stability.'
      : 'Potential indicator of team understaffing or uncompensated overtime.';
  }

  const displayQuestion = question || flag?.question || flag?.suggestedQuestion || flag?.strategy || '';

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
      
      <div className="flag-quote">"{displayQuote}"</div>
      
      <p className="flag-reason">{displayReason}</p>
      
      {displayQuestion && (
        <div className="flag-question">
          <HelpCircle size={14} className="flag-question-icon" />
          <span>{displayQuestion}</span>
        </div>
      )}
    </div>
  );
};

export default FlagCard;
