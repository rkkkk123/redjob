import React, { useState, useRef } from 'react';
import { Paperclip, X, Image as ImageIcon, Link as LinkIcon, FileText, Sparkles, AlertCircle, FileCheck } from 'lucide-react';
import './HeroSection.css';

const PRESET_EXAMPLES = [
  {
    label: 'Toxic Startup JD',
    text: `We are looking for a Rock Star Developer to join our fast-paced, high-pressure startup! Must be willing to wear 10 different hats, work 70+ hours a week, and hustle through weekends. We work hard and play hard (free pizza on Fridays!). Salary is competitive (equity heavy, below-market base salary). No hand-holding provided—you must be a self-starter who figures things out on your own with zero onboarding.`
  },
  {
    label: 'Enterprise Red Tape',
    text: `Senior Specialist required. 15+ years of experience required in technologies released 3 years ago. Strict hierarchical approval process for code deployments. Expect 15 hours of committee sync meetings per week. On-call rotation required 24/7/365 with zero additional compensation. Salary band strictly non-negotiable.`
  },
  {
    label: 'Healthy Scaleup JD',
    text: `Lead Engineer. We prioritize work-life balance, asynchronous collaboration, and deep work time. 4-day work week option, $2,000 yearly learning stipend, fully flexible remote work, and 100% company-paid healthcare starting day one. Transparent career progression frameworks and clear 30-60-90 day onboarding plan.`
  }
];

const HeroSection = ({ onAnalyze }) => {
  const [inputMode, setInputMode] = useState('text'); // 'text', 'url', 'image'
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [isScrapeLoading, setIsScrapeLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scrapeError, setScrapeError] = useState('');

  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const handleScrapeUrl = async () => {
    if (!jobUrl.trim()) return;
    setIsScrapeLoading(true);
    setScrapeError('');
    try {
      const response = await fetch('/api/scrape-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: jobUrl })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch job URL.');
      setJobDescription(data.text);
      setInputMode('text'); // Switch to text mode with auto-filled JD
    } catch (err) {
      console.error(err);
      setScrapeError(err.message || 'Could not parse job posting URL. Please paste text manually.');
    } finally {
      setIsScrapeLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result);
        setImageFileName(file.name);
        setInputMode('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setResumeText(reader.result);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = () => {
    if (!jobDescription.trim() && !attachedImage && !jobUrl.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      onAnalyze({
        jobDescription,
        attachedImage,
        jobUrl,
        resumeText
      });
      setIsAnalyzing(false);
    }, 600);
  };

  const applyPreset = (presetText) => {
    setJobDescription(presetText);
    setInputMode('text');
  };

  return (
    <section className="hero-section">
      <div className="gradient-glow"></div>
      <div className="hero-eyebrow">
        <Sparkles size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
        AI Corporate Culture & Job Intelligence
      </div>
      <h1 className="hero-headline">Know what they're really offering.</h1>
      <p className="hero-subtext">
        Uncover hidden toxic red flags, decode corporate speak, match your resume for ATS gaps, and get instant interview & salary negotiation strategies.
      </p>

      <div className="hero-input-container">
        {/* Input Mode Selector */}
        <div className="hero-mode-tabs glass-panel">
          <button 
            className={`mode-tab ${inputMode === 'text' ? 'active' : ''}`}
            onClick={() => setInputMode('text')}
          >
            <FileText size={15} /> Paste Text
          </button>
          <button 
            className={`mode-tab ${inputMode === 'url' ? 'active' : ''}`}
            onClick={() => setInputMode('url')}
          >
            <LinkIcon size={15} /> Job Posting URL
          </button>
          <button 
            className={`mode-tab ${inputMode === 'image' ? 'active' : ''}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon size={15} /> Screenshot OCR
          </button>
        </div>

        {/* Text Area or URL Input */}
        <div className="hero-textarea-wrapper glass-panel">
          {inputMode === 'url' ? (
            <div className="hero-url-container">
              <input 
                type="url" 
                className="hero-url-input"
                placeholder="Paste LinkedIn, Indeed, Greenhouse, or Lever Job URL..."
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
              />
              <button 
                className="hero-url-fetch-btn"
                onClick={handleScrapeUrl}
                disabled={!jobUrl.trim() || isScrapeLoading}
              >
                {isScrapeLoading ? 'Fetching Posting...' : 'Import Job Posting'}
              </button>
              {scrapeError && (
                <div className="hero-error-banner">
                  <AlertCircle size={14} /> {scrapeError}
                </div>
              )}
            </div>
          ) : (
            <textarea 
              className="hero-textarea"
              placeholder="Paste the full job description text here, or select a preset example below..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isAnalyzing}
            />
          )}

          {/* Attachment Bar */}
          <div className="hero-attachment-toolbar">
            <div className="attachment-pills">
              {attachedImage && (
                <div className="hero-attachment-pill">
                  <ImageIcon size={14} className="hero-attachment-icon" />
                  <span className="hero-attachment-name">{imageFileName}</span>
                  <button className="hero-attachment-remove" onClick={() => setAttachedImage(null)}>
                    <X size={14} />
                  </button>
                </div>
              )}

              {resumeFileName && (
                <div className="hero-attachment-pill resume-pill">
                  <FileCheck size={14} className="hero-attachment-icon" />
                  <span className="hero-attachment-name">Resume: {resumeFileName}</span>
                  <button className="hero-attachment-remove" onClick={() => { setResumeFileName(''); setResumeText(''); }}>
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="attachment-actions">
              <button 
                className="hero-attach-btn" 
                onClick={() => resumeInputRef.current?.click()}
                title="Attach Candidate Resume for Skill Match"
              >
                <FileText size={18} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*"
                onChange={handleImageChange}
              />
              <input 
                type="file" 
                ref={resumeInputRef} 
                style={{ display: 'none' }} 
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleResumeChange}
              />
            </div>
          </div>
        </div>

        {/* Preset Quick Examples */}
        <div className="hero-presets">
          <span className="preset-label">Try sample postings:</span>
          {PRESET_EXAMPLES.map((preset, index) => (
            <button 
              key={index}
              className="preset-btn"
              onClick={() => applyPreset(preset.text)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button 
          className="hero-analyze-btn" 
          onClick={handleAnalyze}
          disabled={(!jobDescription.trim() && !attachedImage && !jobUrl.trim()) || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Sparkles size={18} className="spin-icon" style={{ marginRight: '8px' }} />
              Auditing Job Intelligence...
            </>
          ) : (
            'Run 360° AI Job Audit'
          )}
        </button>
        <div className="hero-trust-note">🔒 100% Private. Confidential. No data shared with recruiters.</div>
      </div>
    </section>
  );
};

export default HeroSection;
