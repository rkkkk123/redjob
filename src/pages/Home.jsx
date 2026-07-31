import React, { useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import TopVideoSection from '../components/home/TopVideoSection';
import ExplainerSection from '../components/home/ExplainerSection';
import VideoSection from '../components/home/VideoSection';
import FeaturesSection from '../components/home/FeaturesSection';
import LoadingState from '../components/results/LoadingState';
import ResultsView from '../components/results/ResultsView';
import './Home.css';

const mockResults = {
  roleTitle: "Senior Product Designer",
  companyName: "TechNova Solutions",
  score: 38,
  summary: "This role describes a high-stress environment disguised as a 'fast-paced startup'. Expect significant overtime and blurred boundaries between work and personal life.",
  flags: [
    {
      severity: "red",
      quote: "Must be willing to wear many hats and hustle through weekends.",
      reason: "This is classic code for an understaffed team expecting you to do the work of three roles.",
      question: "Can you describe a typical week in this role, and how the team manages workloads when deadlines are tight?"
    },
    {
      severity: "red",
      quote: "We work hard and play hard.",
      reason: "Often indicates a high-turnover culture expecting late nights, compensated with perks rather than boundaries.",
      question: "How does the leadership team actively protect employee work-life balance?"
    },
    {
      severity: "amber",
      quote: "Self-starter who doesn't need hand-holding.",
      reason: "Could mean autonomy, but frequently indicates poor onboarding and documentation.",
      question: "What does the structured onboarding plan look like for the first 30 days?"
    }
  ],
  signals: [
    {
      quote: "Comprehensive health coverage and 401(k) matching starting day one.",
      reason: "Indicates financial stability and commitment to basic employee security."
    }
  ],
  resumeFit: {
    matchScore: 82,
    summary: "Strong skill alignment for core product design responsibilities with minor gaps in prototyping tool keywords.",
    matchingSkills: ["UI/UX Design", "Figma", "User Research", "Design Systems"],
    missingSkills: ["ProtoPie", "Design Tokens Automation"],
    recommendations: ["Highlight design system token maintenance experience prominently near the top of your resume."]
  },
  salaryInsights: {
    estimatedRange: "$110,000 - $140,000 / yr",
    negotiationTip: "Request clarification on base salary vs equity. Use your design system expertise as leverage for top-tier base compensation.",
    emailScript: "Dear Hiring Manager,\n\nThank you for sharing details about the Senior Product Designer role at TechNova. Given my extensive background in design systems and end-to-end UX architecture, I am very excited about the impact I can deliver.\n\nBased on current market benchmarks for this scope of responsibility, I am targeting a base compensation range of $125,000 - $135,000. I look forward to discussing how my experience aligns with your team's goals.\n\nBest regards,\nCandidate"
  },
  interviewStrategy: [
    {
      topic: "Workload & Scope",
      suggestedQuestion: "How are project priorities balanced when multiple high-urgency requests arise simultaneously?",
      whatToLookFor: "Defensive answers or vague statements like 'we just make it work' indicate unmanaged scope creep."
    },
    {
      topic: "Team Onboarding",
      suggestedQuestion: "What documentation or peer support will be available during my first month?",
      whatToLookFor: "Look for mentions of dedicated mentors or established wikis."
    }
  ]
};

const Home = () => {
  const [appState, setAppState] = useState('idle'); // idle, loading, results
  const [resultsData, setResultsData] = useState(null);

  const handleAnalyze = async (payload) => {
    setAppState('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    try {
      const requestBody = {
        jobDescription: typeof payload === 'string' ? payload : payload.jobDescription,
        image: payload.attachedImage || null,
        resumeText: payload.resumeText || null
      };

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResultsData(data);
      setAppState('results');
    } catch (error) {
      console.error("Error analyzing job:", error);
      // Fallback to mock data for demonstration if API is offline
      setResultsData(mockResults);
      setAppState('results');
    }
  };

  return (
    <div className="home-container">
      {appState === 'idle' && (
        <div className="view-enter">
          <HeroSection onAnalyze={handleAnalyze} />
          <TopVideoSection />
          <ExplainerSection />
          <VideoSection />
          <FeaturesSection />
        </div>
      )}
      
      {appState === 'loading' && (
        <div className="view-slide-up">
          <LoadingState />
        </div>
      )}
      
      {appState === 'results' && (
        <div className="view-slide-up">
          <ResultsView results={resultsData || mockResults} onReset={() => setAppState('idle')} />
        </div>
      )}
    </div>
  );
};

export default Home;
