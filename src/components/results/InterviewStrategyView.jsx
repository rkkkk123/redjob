import React from 'react';
import { HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';
import './ResultsView.css';

const InterviewStrategyView = ({ strategies = [] }) => {
  if (!strategies || strategies.length === 0) {
    return (
      <div className="tab-placeholder glass-panel">
        <HelpCircle size={48} className="placeholder-icon" />
        <h3>Interview Strategy Ready</h3>
        <p>No specific interview questions generated for this scan, or review the general flags on the main overview tab.</p>
      </div>
    );
  }

  return (
    <div className="interview-strategy-container animate-slide-up">
      <h3 className="tab-heading">Strategic Questions for the Hiring Manager</h3>
      <p className="tab-subheading">Use these questions during your screen or interview rounds to evaluate team culture and workload realities.</p>

      <div className="strategy-grid">
        {strategies.map((item, index) => (
          <div key={index} className="glass-panel strategy-card">
            <div className="strategy-topic-pill">{item.topic || `Topic #${index + 1}`}</div>
            <h4 className="strategy-question">"{item.suggestedQuestion}"</h4>
            
            <div className="strategy-evaluation">
              <div className="eval-item">
                <CheckCircle size={16} className="eval-green-icon" />
                <div>
                  <strong>Green Flag Answer:</strong> Transparent answer detailing clear processes, boundaries, and supportive management.
                </div>
              </div>
              
              <div className="eval-item">
                <AlertCircle size={16} className="eval-red-icon" />
                <div>
                  <strong>Red Flag Answer:</strong> {item.whatToLookFor || 'Vague responses like "we just do whatever it takes" or defensiveness.'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewStrategyView;
