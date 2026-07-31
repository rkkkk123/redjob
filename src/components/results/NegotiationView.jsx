import React, { useState } from 'react';
import { DollarSign, Copy, Check, MessageSquare } from 'lucide-react';
import './ResultsView.css';

const NegotiationView = ({ salaryInsights }) => {
  const [copied, setCopied] = useState(false);

  if (!salaryInsights) {
    return (
      <div className="tab-placeholder glass-panel">
        <DollarSign size={48} className="placeholder-icon" />
        <h3>Salary Insights</h3>
        <p>Salary estimation and negotiation scripts will appear here after analyzing your job posting.</p>
      </div>
    );
  }

  const { estimatedRange, negotiationTip, emailScript } = salaryInsights;

  const handleCopyScript = () => {
    if (emailScript) {
      navigator.clipboard.writeText(emailScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="negotiation-container animate-slide-up">
      <div className="bento-grid">
        {/* Estimated Range */}
        <div className="bento-item glass-panel salary-banner">
          <div className="salary-eyebrow">Estimated Compensation Range</div>
          <h2 className="salary-range-text">{estimatedRange || 'Competitive Market Rate'}</h2>
          <p className="salary-disclaimer">Based on role responsibilities, required seniority, and current market benchmarks.</p>
        </div>

        {/* Strategic Negotiation Tip */}
        <div className="bento-item glass-panel">
          <h4 className="card-section-title brand-title">
            <MessageSquare size={18} /> Negotiation Strategy
          </h4>
          <p className="negotiation-tip-body">{negotiationTip || 'Negotiate based on your unique skill alignment and quantifiable outcomes.'}</p>
        </div>
      </div>

      {/* Draft Email Template */}
      {emailScript && (
        <div className="glass-panel script-card">
          <div className="script-header">
            <h4>Ready-to-Use Negotiation Email Script</h4>
            <button className="copy-script-btn" onClick={handleCopyScript}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy Script'}
            </button>
          </div>
          <pre className="script-body">{emailScript}</pre>
        </div>
      )}
    </div>
  );
};

export default NegotiationView;
