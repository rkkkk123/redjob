import React, { useState, useEffect, useRef } from 'react';
import ScoreCard from './ScoreCard';
import FlagCard from './FlagCard';
import VisualAnalyticsView from './VisualAnalyticsView';
import ResumeFitView from './ResumeFitView';
import InterviewStrategyView from './InterviewStrategyView';
import NegotiationView from './NegotiationView';
import WhiteCanvasPdfReport from './WhiteCanvasPdfReport';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, BarChart3, FileCheck, HelpCircle, DollarSign, Share2, RefreshCw, Download, Sparkles } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import './ResultsView.css';

const ResultsView = ({ results, onReset }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, analytics, resume, interview, salary
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const pdfReportRef = useRef(null);
  const { saveScan } = useAuth();

  // Auto-save scan to AuthContext / Supabase / LocalStorage on mount
  useEffect(() => {
    if (results && saveScan) {
      saveScan(results);
    }
  }, []);

  const handleShare = () => {
    const text = `RedJob Scan Summary:\nRole: ${results.roleTitle || 'Job Analysis'}\nHealth Score: ${results.score}/100\nVerdict: ${
      results.score >= 70 ? 'Proceed with Confidence' : results.score >= 40 ? 'Proceed with Caution' : 'High Risk Environment'
    }\nRed/Amber Flags Found: ${results.flags?.length || 0}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (!pdfReportRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const element = pdfReportRef.current;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `RedJob_Executive_Audit_${(results.roleTitle || 'Report').replace(/[^a-z0-9]/gi, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF Generation Error:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="results-view animate-fade-in">
      {/* Top Header Bar */}
      <div className="results-header-bar">
        <div className="role-meta font-display">
          <h2>{results.roleTitle || '360° Job Intelligence Audit'}</h2>
          <span className="company-badge">{results.companyName || 'Corporate Posting'}</span>
        </div>

        {/* Tab Switcher */}
        <div className="results-nav-tabs glass-panel">
          <button 
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={16} /> Overview & Flags
          </button>

          <button 
            className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={16} /> Visual Analytics
          </button>

          <button 
            className={`nav-tab ${activeTab === 'resume' ? 'active' : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            <FileCheck size={16} /> Resume Alignment
          </button>

          <button 
            className={`nav-tab ${activeTab === 'interview' ? 'active' : ''}`}
            onClick={() => setActiveTab('interview')}
          >
            <HelpCircle size={16} /> Interview Strategy
          </button>

          <button 
            className={`nav-tab ${activeTab === 'salary' ? 'active' : ''}`}
            onClick={() => setActiveTab('salary')}
          >
            <DollarSign size={16} /> Salary & Negotiation
          </button>
        </div>
      </div>

      {/* Tab 1: Overview & Flags */}
      {activeTab === 'overview' && (
        <div className="tab-content animate-slide-up">
          <div className="bento-grid">
            <div className="bento-item score-bento">
              <ScoreCard score={results.score} summary={results.summary} />
            </div>

            {results.flags && results.flags.map((flag, index) => (
              <div className="bento-item flag-bento" key={index} style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                <FlagCard 
                  severity={flag.severity}
                  quote={flag.quote}
                  reason={flag.reason}
                  question={flag.question}
                  index={index + 1}
                />
              </div>
            ))}

            {results.signals && results.signals.map((signal, index) => (
              <div className="bento-item signal-bento" key={`signal-${index}`} style={{ animationDelay: `${((results.flags?.length || 0) + index + 1) * 100}ms` }}>
                <FlagCard 
                  severity="green"
                  quote={signal.quote}
                  reason={signal.reason}
                  index={(results.flags?.length || 0) + index + 1}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Visual Analytics & Charts */}
      {activeTab === 'analytics' && (
        <VisualAnalyticsView 
          compensation={results.compensationComparison}
          futureProof={results.futureProofIndex}
          hiringMetrics={results.hiringMetrics}
        />
      )}

      {/* Tab 3: Resume Alignment */}
      {activeTab === 'resume' && (
        <ResumeFitView resumeFit={results.resumeFit} />
      )}

      {/* Tab 4: Interview Strategy */}
      {activeTab === 'interview' && (
        <InterviewStrategyView strategies={results.interviewStrategy || results.flags?.map(f => ({ topic: f.quote, suggestedQuestion: f.question }))} />
      )}

      {/* Tab 5: Salary & Negotiation */}
      {activeTab === 'salary' && (
        <NegotiationView salaryInsights={results.salaryInsights} />
      )}

      {/* Bottom Action Footer */}
      <div className="results-actions">
        <button className="secondary-btn" onClick={onReset}>
          <RefreshCw size={16} /> Scan Another Role
        </button>
        <button className="primary-btn" onClick={handleShare}>
          <Share2 size={16} /> {copied ? 'Copied Report Summary!' : 'Share Audit Summary'}
        </button>
        <button className="pdf-btn" onClick={handleDownloadPdf} disabled={isGeneratingPdf}>
          {isGeneratingPdf ? <Sparkles size={16} className="spin-icon" /> : <Download size={16} />}
          {isGeneratingPdf ? 'Generating PDF...' : 'Download Executive PDF'}
        </button>
      </div>

      {/* Hidden White Canvas PDF Template container for HTML2PDF rendering */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <WhiteCanvasPdfReport ref={pdfReportRef} results={results} />
      </div>
    </div>
  );
};

export default ResultsView;
