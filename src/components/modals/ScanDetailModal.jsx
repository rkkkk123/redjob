import React from 'react';
import ResultsView from '../results/ResultsView';
import { X } from 'lucide-react';
import './UpgradeModal.css'; // Re-use modal glass container styles

const ScanDetailModal = ({ scan, isOpen, onClose }) => {
  if (!isOpen || !scan) return null;

  return (
    <div className="upgrade-modal-overlay" onClick={onClose}>
      <div 
        className="upgrade-modal-content glass-panel animate-scale-up" 
        style={{ maxWidth: '1100px', width: '95%', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="upgrade-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ marginTop: '10px' }}>
          <ResultsView results={scan} onReset={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ScanDetailModal;
