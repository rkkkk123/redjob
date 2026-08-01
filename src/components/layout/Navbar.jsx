import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
            <g transform="rotate(15 16 16)">
              <rect x="4" y="4" width="24" height="24" rx="4" fill="var(--semantic-red)" />
              <path d="M12 9V23H14.5V17H16.5C18.5 17 20 15.5 20 13C20 10.5 18.5 9 16.5 9H12ZM14.5 11.5H16.5C17.3 11.5 17.5 12.2 17.5 13C17.5 13.8 17.3 14.5 16.5 14.5H14.5V11.5ZM16.5 17L20 23H17L14.5 17H16.5Z" fill="white"/>
            </g>
          </svg>
          RedJob
        </Link>

        <div className="navbar-links">
          <Link to="/features" className={`navbar-link ${location.pathname === '/features' ? 'active' : ''}`}>Features</Link>
          <Link to="/developers" className={`navbar-link ${location.pathname === '/developers' ? 'active' : ''}`}>Developers</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className={`navbar-link dashboard-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                <LayoutDashboard size={15} style={{ marginRight: '4px' }} /> History
              </Link>

              <div className="user-profile-badge">
                <User size={14} />
                <span className="user-email-text">
                  {user.user_metadata?.full_name || user.name || user.email}
                </span>
                <button className="logout-icon-btn" onClick={logout} title="Sign Out">
                  <LogOut size={14} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/auth" className="navbar-link">Sign In</Link>
          )}

          <Link to="/pricing" className="navbar-cta">
            <Sparkles size={14} style={{ marginRight: '4px' }} /> Go Pro
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
