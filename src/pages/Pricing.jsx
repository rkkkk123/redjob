import React from 'react';
import { Check } from 'lucide-react';
import './Pricing.css';

const Pricing = () => {
  return (
    <div className="pricing-view animate-stagger-1">
      <div className="pricing-header">
        <h1 className="pricing-title">Simple, transparent pricing</h1>
        <p className="pricing-subtitle">Invest in your career with clarity.</p>
      </div>

      <div className="pricing-grid">
        {/* Free Tier */}
        <div className="pricing-card">
          <h2 className="tier-name">Free</h2>
          <div className="tier-price">
            <span className="price-number">Free</span>
          </div>
          <p className="tier-desc">For occasional job searches.</p>
          <button className="pricing-cta cta-secondary">Get Started</button>
          
          <ul className="feature-list">
            <li className="feature-item">
              <Check size={16} className="feature-check" />
              <span>3 scans per month</span>
            </li>
            <li className="feature-item">
              <Check size={16} className="feature-check" />
              <span>Basic red flag detection</span>
            </li>
            <li className="feature-item">
              <Check size={16} className="feature-check" />
              <span>Standard support</span>
            </li>
          </ul>
        </div>

        {/* Plus Tier */}
        <div className="pricing-card card-pro">
          <div className="pro-badge">Most Popular</div>
          <h2 className="tier-name">Plus</h2>
          <div className="tier-price">
            <span className="price-number">$9</span>
            <span className="price-period">/month</span>
          </div>
          <p className="tier-desc">For active job seekers.</p>
          <button className="pricing-cta cta-primary">Upgrade to Plus</button>
          <div className="billing-note">Cancel anytime. No questions asked.</div>
          
          <ul className="feature-list">
            <li className="feature-item">
              <Check size={16} className="feature-check" />
              <span>Unlimited scans</span>
            </li>
            <li className="feature-item">
              <Check size={16} className="feature-check" />
              <span>Deep culture signal analysis</span>
            </li>
            <li className="feature-item">
              <Check size={16} className="feature-check" />
              <span>Interview question generation</span>
            </li>
            <li className="feature-item">
              <Check size={16} className="feature-check" />
              <span>Scan history dashboard</span>
            </li>
          </ul>
        </div>

        {/* Pro Tier */}
        <div className="pricing-card card-muted">
          <h2 className="tier-name">Pro</h2>
          <div className="tier-price">
            <span className="price-number">$24</span>
            <span className="price-period">/month</span>
          </div>
          <p className="tier-desc">For power users and career coaches.</p>
          <button className="pricing-cta cta-disabled" disabled>Coming Soon</button>
          
          <ul className="feature-list">
            <li className="feature-item">
              <Check size={16} className="feature-check" />
              <span>Everything in Plus</span>
            </li>
            <li className="feature-item">
              <Check size={16} className="feature-check" />
              <span>Client management</span>
            </li>
            <li className="feature-item">
              <Check size={16} className="feature-check" />
              <span>Custom branding</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
