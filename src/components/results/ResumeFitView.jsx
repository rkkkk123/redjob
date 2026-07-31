import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, FileText } from 'lucide-react';
import './ResultsView.css';

const ResumeFitView = ({ resumeFit }) => {
  if (!resumeFit || !resumeFit.matchScore) {
    return (
      <div className="tab-placeholder glass-panel">
        <FileText size={48} className="placeholder-icon" />
        <h3>No Resume Attached</h3>
        <p>Attach your resume (PDF/DOCX/TXT) on the home screen to unlock instant ATS skill gap analysis and tailored match scores!</p>
      </div>
    );
  }

  const { matchScore, summary, matchingSkills = [], missingSkills = [], recommendations = [] } = resumeFit;

  return (
    <div className="resume-fit-container animate-slide-up">
      <div className="bento-grid">
        {/* Match Score Card */}
        <div className="bento-item glass-panel score-card-bento">
          <div className="fit-score-badge">
            <span className="fit-number">{matchScore}%</span>
            <span className="fit-label">Resume Match</span>
          </div>
          <p className="fit-summary">{summary}</p>
        </div>

        {/* Matching Skills */}
        <div className="bento-item glass-panel">
          <h4 className="card-section-title green-title">
            <CheckCircle2 size={18} /> Matching Skills Found ({matchingSkills.length})
          </h4>
          <div className="skills-tags">
            {matchingSkills.length > 0 ? (
              matchingSkills.map((skill, index) => (
                <span key={index} className="skill-pill matching-pill">{skill}</span>
              ))
            ) : (
              <span className="no-skills">No direct match keywords identified.</span>
            )}
          </div>
        </div>

        {/* Missing Skills & ATS Gaps */}
        <div className="bento-item glass-panel">
          <h4 className="card-section-title red-title">
            <AlertTriangle size={18} /> Missing ATS Keywords ({missingSkills.length})
          </h4>
          <div className="skills-tags">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, index) => (
                <span key={index} className="skill-pill missing-pill">{skill}</span>
              ))
            ) : (
              <span className="no-skills">Great news! No critical missing keywords detected.</span>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations Card */}
      {recommendations.length > 0 && (
        <div className="glass-panel recommendations-card">
          <h4 className="card-section-title amber-title">
            <Lightbulb size={18} /> ATS Optimization Recommendations
          </h4>
          <ul className="recommendations-list">
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeFitView;
