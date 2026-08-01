import React, { useState } from 'react';
import { Bot, Sparkles, MessageSquare, X } from 'lucide-react';
import './DancingRobotWidget.css';

const DancingRobotWidget = ({ onOpenChat }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dismissTooltip, setDismissTooltip] = useState(false);

  return (
    <div className="dancing-robot-wrapper">
      {/* Floating Tooltip Bubble */}
      {!dismissTooltip && (
        <div className="robot-speech-bubble animate-bounce">
          <button className="bubble-close-btn" onClick={() => setDismissTooltip(true)}>
            <X size={10} />
          </button>
          <div className="bubble-text">
            <span className="bubble-emoji">🤖</span>
            <span>Hi! I'm <strong>RedJob Robot</strong>! Click to chat career strategy!</span>
          </div>
        </div>
      )}

      {/* Interactive Dancing Robot Body */}
      <button 
        className={`dancing-robot-btn ${isHovered ? 'dancing-fast' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onOpenChat}
        title="Open RedJob AI Career Assistant"
      >
        {/* Floating Sparkle Particles */}
        <div className="robot-sparkles">
          <span className="sparkle s1">✨</span>
          <span className="sparkle s2">🎵</span>
          <span className="sparkle s3">⚡</span>
        </div>

        {/* Dancing Robot Vector Visual */}
        <div className="robot-avatar-container">
          <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="robot-svg">
            {/* Antenna & Pulsing Light */}
            <line x1="32" y1="12" x2="32" y2="4" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" className="robot-antenna-stem" />
            <circle cx="32" cy="4" r="3.5" fill="#f59e0b" className="robot-antenna-light" />
            
            {/* Ears */}
            <rect x="8" y="20" width="4" height="8" rx="2" fill="#64748b" className="robot-ear left-ear" />
            <rect x="52" y="20" width="4" height="8" rx="2" fill="#64748b" className="robot-ear right-ear" />

            {/* Head Box */}
            <rect x="12" y="12" width="40" height="24" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2.5" className="robot-head" />
            
            {/* Animated Eyes */}
            <circle cx="24" cy="22" r="4" fill="#38bdf8" className="robot-eye left-eye" />
            <circle cx="40" cy="22" r="4" fill="#38bdf8" className="robot-eye right-eye" />
            
            {/* Smiling Mouth */}
            <path d="M 24 29 Q 32 35 40 29" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" fill="none" className="robot-mouth" />

            {/* Body */}
            <rect x="16" y="38" width="32" height="20" rx="6" fill="#0f172a" stroke="#ef4444" strokeWidth="2" className="robot-body" />
            {/* Chest Core Indicator */}
            <circle cx="32" cy="48" r="5" fill="#ef4444" className="robot-core" />

            {/* Dancing Arms */}
            <path d="M 16 42 Q 8 46 10 52" stroke="#64748b" strokeWidth="3" strokeLinecap="round" fill="none" className="robot-arm left-arm" />
            <path d="M 48 42 Q 56 46 54 52" stroke="#64748b" strokeWidth="3" strokeLinecap="round" fill="none" className="robot-arm right-arm" />
          </svg>
        </div>

        <div className="robot-badge-icon">
          <Sparkles size={12} />
        </div>
      </button>
    </div>
  );
};

export default DancingRobotWidget;
