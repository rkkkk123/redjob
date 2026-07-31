import React from 'react';
import { ClipboardPaste, Search, CheckCircle2 } from 'lucide-react';
import './ExplainerSection.css';

const ExplainerSection = () => {
  const steps = [
    {
      num: '01',
      title: 'Paste',
      desc: 'Drop in any job description.',
      icon: <ClipboardPaste size={20} strokeWidth={1.5} />
    },
    {
      num: '02',
      title: 'Analyze',
      desc: 'We scan for hidden signals.',
      icon: <Search size={20} strokeWidth={1.5} />
    },
    {
      num: '03',
      title: 'Know',
      desc: 'See the real expectations.',
      icon: <CheckCircle2 size={20} strokeWidth={1.5} />
    }
  ];

  return (
    <section className="explainer-section">
      <div className="explainer-container">
        {steps.map((step, index) => (
          <React.Fragment key={step.num}>
            <div className="explainer-step">
              <div className="explainer-bg-num">{step.num}</div>
              <div className="explainer-content">
                <div className="explainer-icon">{step.icon}</div>
                <h3 className="explainer-title">{step.title}</h3>
                <p className="explainer-desc">{step.desc}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="explainer-connector">
                <div className="explainer-dash"></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default ExplainerSection;
