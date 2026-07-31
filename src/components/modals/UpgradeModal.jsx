import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import './UpgradeModal.css';

const UpgradeModal = ({ isOpen, onClose }) => {
  const [render, setRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setRender(true);
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setRender(false);
  };

  if (!render) return null;

  return (
    <div 
      className={`modal-overlay ${isOpen ? 'open' : 'closed'}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={`modal-card ${isOpen ? 'open' : 'closed'}`}>
        <div className="modal-icon-container">
          <Eye size={24} className="modal-icon" strokeWidth={1.5} />
        </div>
        
        <h2 className="modal-headline">See what they're hiding</h2>
        
        <p className="modal-body">
          You've reached your free limit. Upgrade to Pro to unlock unlimited deep culture scans, interview question generation, and your personal scan history.
        </p>
        
        <div className="modal-price">
          <span className="modal-price-number">$12</span>
          <span className="modal-price-period">/month</span>
        </div>
        
        <button className="modal-cta">Upgrade to Pro</button>
        
        <button className="modal-dismiss" onClick={onClose}>
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default UpgradeModal;
