import React, { useEffect, useRef } from 'react';
import './Features.css';

const Features = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="features-page" ref={containerRef}>
      <div className="gradient-glow"></div>
      
      <header className="features-header animate-stagger-1">
        <h1 className="features-title">Uncover the reality. <br/> <span className="highlight-text">Before you apply.</span></h1>
        <p className="features-subtitle text-body">
          Our advanced NVIDIA NIM-powered AI doesn't just read words—it understands corporate psychology, 
          identifying red flags hidden behind standard jargon.
        </p>
      </header>

      <section className="bento-showcase animate-stagger-2">
        <div className="bento-grid features-grid">
          
          <div className="bento-item feature-card large">
            <div className="feature-icon">🔍</div>
            <h3>Deep Semantic Scanning</h3>
            <p className="text-secondary">
              We process 10,000+ data points per description, comparing phrases against our proprietary database of known toxic workplace indicators.
            </p>
            <div className="demo-visual">
              <div className="scan-line"></div>
              <p className="toxic-phrase">"Must be willing to wear many hats"</p>
              <div className="translation glass-panel">
                <span className="alert-dot red"></span>
                Translation: Understaffed, expect to do the job of 3 people without extra pay.
              </div>
            </div>
          </div>

          <div className="bento-item feature-card">
            <div className="feature-icon">⚡</div>
            <h3>NVIDIA NIM Integration</h3>
            <p className="text-secondary">
              Powered by the industry-leading Llama 3.1 70B model, hosted on ultra-fast NVIDIA infrastructure for near-instant analysis.
            </p>
          </div>

          <div className="bento-item feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Enterprise Grade Security</h3>
            <p className="text-secondary">
              Your job searches are private. We never store your queries permanently and use state-of-the-art encryption.
            </p>
          </div>

          <div className="bento-item feature-card wide">
            <div className="split-content">
              <div className="text-content">
                <h3>Visual Job Extraction</h3>
                <p className="text-secondary">
                  Found a job on an image-only site? Upload a screenshot. Our Vision model reads and parses the text flawlessly.
                </p>
              </div>
              <div className="visual-graphic">
                <div className="mock-image-upload glass-panel">
                  <div className="upload-icon">📷</div>
                  <span>job_desc_screenshot.png</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Features;
