import React from 'react';
import './VideoSection.css';

const VideoSection = () => {
  return (
    <section className="video-section">
      <video 
        className="video-bg"
        autoPlay 
        loop 
        muted 
        playsInline
        src="/background.mp4"
      />
      <div className="video-overlay"></div>
      <div className="video-content">
        <h2 className="glass-text">Focus on the opportunities with care.</h2>
      </div>
    </section>
  );
};

export default VideoSection;
