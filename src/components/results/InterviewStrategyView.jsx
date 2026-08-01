import React from 'react';
import { HelpCircle, CheckCircle, AlertCircle, Compass, ShieldAlert, Award, ChevronRight } from 'lucide-react';
import './ResultsView.css';

const DEFAULT_ROADMAP = [
  {
    stageNumber: 1,
    stageTitle: "Stage 1: Recruiter Screening & Initial Alignment",
    focusArea: "Salary Band & Scope Bounds",
    targetQuestion: "What is the explicit base salary band and working hours expectation for this role?",
    greenFlagSignal: "Transparent salary floor shared immediately ($115k+) with clear remote boundaries.",
    redFlagWarning: "Vague statements like 'compensation depends on candidate fit' without clear numbers."
  },
  {
    stageNumber: 2,
    stageTitle: "Stage 2: Technical Competency & Architecture Audit",
    focusArea: "Code Standards & Tech Debt",
    targetQuestion: "How does the team balance new feature velocity against technical debt refactoring?",
    greenFlagSignal: "Dedicated sprint allocations for tech debt and system reliability.",
    redFlagWarning: "Expectation of continuous feature hacks without refactoring cycles."
  },
  {
    stageNumber: 3,
    stageTitle: "Stage 3: Culture & Workload Boundary Audit",
    focusArea: "After-Hours Support & Burnout",
    targetQuestion: "How are project priorities managed when multiple high-urgency requests collide?",
    greenFlagSignal: "Structured prioritization frameworks (RICE/MoSCoW) and executive shielding.",
    redFlagWarning: "Defensive answers such as 'we all do whatever it takes 24/7'."
  },
  {
    stageNumber: 4,
    stageTitle: "Stage 4: Executive Offer & Counter Negotiation",
    focusArea: "Base Compensation & 90-Day KPIs",
    targetQuestion: "What explicit 90-day KPIs determine performance evaluation and base compensation reviews?",
    greenFlagSignal: "Clear 30-60-90 day deliverables with written performance metrics.",
    redFlagWarning: "Unclear bonus criteria or equity promises lacking vesting documentation."
  }
];

const InterviewStrategyView = ({ strategies = [], roadmap = [], flags = [] }) => {
  const activeRoadmap = Array.isArray(roadmap) && roadmap.length > 0 ? roadmap : DEFAULT_ROADMAP;
  let list = Array.isArray(strategies) && strategies.length > 0 ? strategies : [];

  if (list.length === 0 && Array.isArray(flags) && flags.length > 0) {
    list = flags.map((f, idx) => ({
      topic: f.quote || f.text || `Workplace Focus #${idx + 1}`,
      suggestedQuestion: f.question || f.suggestedQuestion || `How does the leadership team manage priorities when deadlines are tight?`,
      whatToLookFor: f.reason || 'Vague responses or reluctance to share workload metrics.'
    }));
  }

  if (list.length === 0) {
    list = [
      {
        topic: "Workload & Team Capacity",
        suggestedQuestion: "How are project priorities balanced when multiple high-urgency requests arise simultaneously?",
        whatToLookFor: "Defensive answers or vague statements like 'we just make it work' indicate unmanaged scope creep."
      },
      {
        topic: "Onboarding & Mentorship",
        suggestedQuestion: "What structured documentation and team support will be available during my first 30 days?",
        whatToLookFor: "Look for mentions of dedicated mentors or established documentation wikis."
      }
    ];
  }

  return (
    <div className="interview-strategy-container animate-slide-up">
      {/* 1. Planned Interview Roadmap Timeline */}
      <div className="roadmap-header-section glass-panel" style={{ padding: '24px', borderRadius: '16px', marginBottom: '28px' }}>
        <h3 className="tab-heading brand-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={22} className="brand-icon" /> Planned Interview Preparation Roadmap
        </h3>
        <p className="tab-subheading">
          A step-by-step 4-stage strategic roadmap designed by RedJob AI to guide your interview rounds and uncover hidden team risks.
        </p>

        <div className="roadmap-timeline-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '20px' }}>
          {activeRoadmap.map((stage, idx) => (
            <div key={idx} className="roadmap-stage-card glass-panel" style={{ padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--brand-accent)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--brand-accent)', letterSpacing: '0.05em' }}>
                STAGE {stage.stageNumber || idx + 1}
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '4px 0 8px 0', color: 'var(--text-primary)' }}>
                {stage.stageTitle}
              </h4>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                🎯 Focus: <strong>{stage.focusArea}</strong>
              </div>
              <div style={{ fontSize: '12px', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <strong>Key Q:</strong> "{stage.targetQuestion}"
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Targeted Role Questions & Evaluation Cards */}
      <h3 className="tab-heading">Targeted Strategic Questions for Hiring Managers</h3>
      <p className="tab-subheading">Ask these questions during your screen or interview rounds to evaluate team culture and workload realities.</p>

      <div className="strategy-grid">
        {list.map((item, index) => {
          const topic = item.topic || item.subject || item.category || `Strategy Topic #${index + 1}`;
          const question = item.suggestedQuestion || item.question || item.query || "What does a typical work week look like for this team?";
          const redFlagText = item.whatToLookFor || item.redFlagAnswer || item.reason || 'Vague answers or defensive responses regarding hours.';

          return (
            <div key={index} className="glass-panel strategy-card">
              <div className="strategy-topic-pill">{topic}</div>
              <h4 className="strategy-question">"{question}"</h4>
              
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
                    <strong>Red Flag Answer:</strong> {redFlagText}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterviewStrategyView;
