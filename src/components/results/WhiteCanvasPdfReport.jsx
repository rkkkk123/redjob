import React, { forwardRef } from 'react';
import './WhiteCanvasPdfReport.css';

const WhiteCanvasPdfReport = forwardRef(({ results }, ref) => {
  if (!results) return null;

  const {
    roleTitle = '360° Job Intelligence Audit',
    companyName = 'Target Hiring Company',
    score = 75,
    summary = '',
    flags = [],
    signals = [],
    hiringMetrics = {},
    compensationComparison = {},
    futureProofIndex = {},
    resumeFit = {},
    salaryInsights = {},
    interviewStrategy = []
  } = results;

  const scoreColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="pdf-white-canvas" ref={ref}>
      {/* PDF Document Header */}
      <div className="pdf-header">
        <div className="pdf-brand font-display">
          <div className="pdf-logo-box">R</div>
          <div>
            <h1 className="pdf-title">REDJOB EXECUTIVE AUDIT REPORT</h1>
            <p className="pdf-subtitle">Confidential Corporate Culture & Job Intelligence Audit</p>
          </div>
        </div>
        <div className="pdf-date-badge">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <hr className="pdf-divider" />

      {/* Role & Health Score Overview */}
      <div className="pdf-overview-grid">
        <div className="pdf-role-info">
          <h2 className="pdf-role-title">{roleTitle}</h2>
          <div className="pdf-company-name">Target Organization: <strong>{companyName}</strong></div>
          <p className="pdf-summary-box">"{summary}"</p>
        </div>

        <div className="pdf-score-box" style={{ borderColor: scoreColor }}>
          <div className="pdf-score-number" style={{ color: scoreColor }}>{score}</div>
          <div className="pdf-score-label">HEALTH SCORE</div>
        </div>
      </div>

      {/* Key Benchmark Metrics */}
      <div className="pdf-section-title">1. EXECUTIVE MARKET METRICS</div>
      <div className="pdf-metrics-grid">
        <div className="pdf-metric-card">
          <div className="pdf-metric-value">${compensationComparison.roleBase?.toLocaleString() || '118,000'} / yr</div>
          <div className="pdf-metric-label">Estimated Role Base Salary</div>
        </div>
        <div className="pdf-metric-card">
          <div className="pdf-metric-value">${compensationComparison.marketAvg?.toLocaleString() || '105,000'} / yr</div>
          <div className="pdf-metric-label">Industry Market Average</div>
        </div>
        <div className="pdf-metric-card">
          <div className="pdf-metric-value">{futureProofIndex.aiAutomationRisk || 22}%</div>
          <div className="pdf-metric-label">AI Automation Risk Index</div>
        </div>
        <div className="pdf-metric-card">
          <div className="pdf-metric-value">{hiringMetrics.hiringVelocityDays || 24} Days</div>
          <div className="pdf-metric-label">Average Time-to-Hire</div>
        </div>
      </div>

      {/* Flags & Culture Signals */}
      <div className="pdf-section-title">2. CULTURE RED FLAGS & POSITIVE SIGNALS</div>
      <div className="pdf-flags-container">
        {flags.map((flag, idx) => (
          <div key={idx} className={`pdf-flag-card pdf-${flag.severity}-flag`}>
            <div className="pdf-flag-header">
              <span className={`pdf-pill pdf-pill-${flag.severity}`}>
                {flag.severity === 'red' ? 'CRITICAL RED FLAG' : 'AMBER RISK SIGNAL'}
              </span>
              <span className="pdf-quote">"{flag.quote}"</span>
            </div>
            <p className="pdf-reason">{flag.reason}</p>
            {flag.question && (
              <div className="pdf-question">
                <strong>Interview Strategy Question:</strong> "{flag.question}"
              </div>
            )}
          </div>
        ))}

        {signals.map((sig, idx) => (
          <div key={`sig-${idx}`} className="pdf-flag-card pdf-green-flag">
            <div className="pdf-flag-header">
              <span className="pdf-pill pdf-pill-green">POSITIVE GREEN SIGNAL</span>
              <span className="pdf-quote">"{sig.quote}"</span>
            </div>
            <p className="pdf-reason">{sig.reason}</p>
          </div>
        ))}
      </div>

      {/* Resume Fit & ATS Analysis */}
      {resumeFit?.matchScore && (
        <>
          <div className="pdf-section-title">3. RESUME ATS MATCH ANALYSIS</div>
          <div className="pdf-resume-box">
            <div className="pdf-resume-score">ATS Match Score: <strong>{resumeFit.matchScore}%</strong></div>
            <p>{resumeFit.summary}</p>
            {resumeFit.missingSkills?.length > 0 && (
              <div className="pdf-skills-missing">
                <strong>Recommended ATS Keywords to Add:</strong> {resumeFit.missingSkills.join(', ')}
              </div>
            )}
          </div>
        </>
      )}

      {/* Salary Negotiation Script */}
      {salaryInsights?.emailScript && (
        <>
          <div className="pdf-section-title">4. SALARY NEGOTIATION SCRIPT DRAFT</div>
          <div className="pdf-script-box">
            <pre>{salaryInsights.emailScript}</pre>
          </div>
        </>
      )}

      {/* PDF Footer Disclaimer */}
      <div className="pdf-footer">
        Generated by RedJob AI Intelligence Platform • Confidential Executive Document
      </div>
    </div>
  );
});

export default WhiteCanvasPdfReport;
