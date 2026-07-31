import React, { useEffect } from 'react';
import './Developers.css';

const Developers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const codeSnippet = `const axios = require('axios');

async function checkJob(jobDescription) {
  const response = await axios.post('https://api.redjob.ai/v1/analyze', {
    jobDescription: jobDescription,
    options: {
      strictMode: true,
      extractSignals: true
    }
  }, {
    headers: {
      'Authorization': \`Bearer \${process.env.REDJOB_API_KEY}\`
    }
  });

  return response.data;
}

// Returns: { score: 38, flags: [...], signals: [...] }`;

  return (
    <div className="developers-page">
      <div className="gradient-glow blue-glow"></div>

      <header className="dev-header animate-stagger-1">
        <h1 className="dev-title">Integrate the truth.</h1>
        <p className="dev-subtitle text-body">
          Plug Red Job's extraction engine directly into your ATS or job board with our simple, scalable REST API.
        </p>
      </header>

      <section className="dev-content animate-stagger-2">
        <div className="terminal-container glass-panel">
          <div className="terminal-header">
            <div className="window-controls">
              <span className="control close"></span>
              <span className="control minimize"></span>
              <span className="control maximize"></span>
            </div>
            <div className="window-title">bash — integration.js</div>
          </div>
          <div className="terminal-body">
            <pre>
              <code>{codeSnippet}</code>
            </pre>
          </div>
        </div>

        <div className="api-features bento-grid">
          <div className="bento-item dev-card">
            <h4><span className="dot green"></span> 99.99% Uptime</h4>
            <p className="text-secondary">Enterprise-grade reliability powered by Vercel and NVIDIA infrastructure.</p>
          </div>
          <div className="bento-item dev-card">
            <h4><span className="dot blue"></span> Webhooks Support</h4>
            <p className="text-secondary">Receive real-time notifications when async analyses complete.</p>
          </div>
          <div className="bento-item dev-card">
            <h4><span className="dot amber"></span> Vision API Ready</h4>
            <p className="text-secondary">Send base64 images directly to our endpoints for OCR parsing.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Developers;
