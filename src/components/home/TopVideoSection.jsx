import React from 'react';
import './TopVideoSection.css';

const TopVideoSection = () => {
  return (
    <section className="top-video-section">
      <video 
        className="top-video-bg"
        autoPlay 
        loop 
        muted 
        playsInline
        src="/background2.mp4"
      />
      <div className="top-video-overlay"></div>
      <div className="top-video-content">
        <h2 className="black-text">Life is easier than you think. Get the right choice.</h2>
      </div>
    </section>
  );
};

export default TopVideoSection;
