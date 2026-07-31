import React from 'react';
import { Shield, Zap, Target, Eye } from 'lucide-react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Shield size={24} strokeWidth={1.5} />,
      title: "Bias Detection",
      description: "Our AI is trained to spot subtle red flags and coded language that often disguise toxic work environments.",
      color: "var(--brand-accent)"
    },
    {
      icon: <Eye size={24} strokeWidth={1.5} />,
      title: "Radical Clarity",
      description: "We strip away corporate jargon to reveal the actual expectations of the role, giving you clear insights.",
      color: "var(--semantic-amber)"
    },
    {
      icon: <Zap size={24} strokeWidth={1.5} />,
      title: "Instant Analysis",
      description: "Get a comprehensive breakdown of any job description in seconds, before you invest hours in applying.",
      color: "var(--semantic-green)"
    },
    {
      icon: <Target size={24} strokeWidth={1.5} />,
      title: "Targeted Questions",
      description: "Armed with our insights, you'll know exactly which tough questions to ask during your interview.",
      color: "var(--semantic-red)"
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Precision Insights. <br/><span>No Corporate Speak.</span></h2>
          <p className="features-subtitle">We decode the noise so you can focus on finding a role that respects your boundaries.</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              className={`feature-card animate-stagger-${index + 1}`} 
              key={index}
            >
              <div className="feature-icon-wrapper" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
