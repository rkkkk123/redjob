import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ScanDetailModal from '../components/modals/ScanDetailModal';
import { ChevronRight, Trash2, Calendar, ShieldCheck, FileText, Eye } from 'lucide-react';
import './Dashboard.css';

const getScoreColor = (score) => {
  if (score >= 70) return 'var(--semantic-green)';
  if (score >= 40) return 'var(--semantic-amber)';
  return 'var(--semantic-red)';
};

const Dashboard = () => {
  const { scans, deleteScan, user } = useAuth();
  const [selectedScan, setSelectedScan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenScan = (scan) => {
    setSelectedScan(scan);
    setIsModalOpen(true);
  };

  return (
    <div className="dashboard-view animate-stagger-1">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Your Audit History</h1>
          <div className="dashboard-meta">
            {scans.length} {scans.length === 1 ? 'job description' : 'job descriptions'} analyzed
            {user ? ` • Logged in as ${user.email}` : ' • Local session'}
          </div>
        </div>
      </div>

      {scans.length === 0 ? (
        <div className="empty-dashboard glass-panel">
          <FileText size={48} className="empty-icon" />
          <h3>No Scans Yet</h3>
          <p>Go to the Home page to analyze your first job posting and uncover hidden red flags.</p>
        </div>
      ) : (
        <div className="dashboard-list">
          {scans.map((scan) => {
            const formattedDate = scan.created_at || scan.createdAt
              ? new Date(scan.created_at || scan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Recent Scan';

            return (
              <div 
                key={scan.id} 
                className="dashboard-row glass-panel clickable-row"
                onClick={() => handleOpenScan(scan)}
              >
                <div className="row-date">
                  <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {formattedDate}
                </div>
                
                <div className="row-score">
                  <div 
                    className="score-mini-ring"
                    style={{ borderColor: getScoreColor(scan.score), color: getScoreColor(scan.score) }}
                  >
                    {scan.score}
                  </div>
                </div>
                
                <div className="row-summary-wrapper">
                  <div className="row-role">{scan.role_title || scan.roleTitle || 'Job Analysis'}</div>
                  <div className="row-company">{scan.company_name || scan.companyName || 'Corporate Posting'}</div>
                </div>

                <div className="row-flags-badge">
                  <ShieldCheck size={14} />
                  {scan.flags?.length || 0} Flags
                </div>
                
                <div className="row-actions" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="view-scan-btn"
                    onClick={() => handleOpenScan(scan)}
                    title="View Full Audit Report"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    className="delete-scan-btn"
                    onClick={() => deleteScan(scan.id)}
                    title="Delete Scan Record"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Scan Detail Modal */}
      <ScanDetailModal 
        scan={selectedScan}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
