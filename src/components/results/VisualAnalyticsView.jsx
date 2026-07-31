import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { TrendingUp, ShieldAlert, Cpu, Award, Users, Clock } from 'lucide-react';
import './ResultsView.css';

const VisualAnalyticsView = ({ compensation, futureProof, hiringMetrics }) => {
  // Default values if metric object missing
  const compData = compensation || {
    roleBase: 118000,
    marketAvg: 105000,
    topPercentile: 145000,
    entryLevel: 75000,
    currency: "$"
  };

  const fpData = futureProof || {
    longevityScore: 85,
    aiAutomationRisk: 22,
    growthTrajectory: "+16% Projected 5-Year Industry Growth",
    futureSkillsToLearn: ["System Architecture", "AI Integration & Workflows", "Cross-Functional Leadership"]
  };

  const hmData = hiringMetrics || {
    applicantCompetition: "High (180+ applicants / posting)",
    hiringVelocityDays: 24,
    competitionIndex: 78,
    demandScore: 88
  };

  // Format chart data for Compensation Bar Chart
  const chartData = [
    { name: 'Market Floor', amount: compData.entryLevel, fill: 'var(--text-tertiary)' },
    { name: 'Industry Avg', amount: compData.marketAvg, fill: 'var(--semantic-amber)' },
    { name: 'This Role Target', amount: compData.roleBase, fill: 'var(--semantic-green)' },
    { name: 'Top 10% Ceiling', amount: compData.topPercentile, fill: 'var(--brand-accent)' },
  ];

  // Calculate percentage vs market average
  const diffFromAvg = Math.round(((compData.roleBase - compData.marketAvg) / compData.marketAvg) * 100);

  // Format Radar data for Market Velocity & Longevity
  const radarData = [
    { subject: 'Market Demand', score: hmData.demandScore || 85 },
    { subject: '5-Yr Stability', score: fpData.longevityScore || 80 },
    { subject: 'AI Immunity', score: Math.max(10, 100 - (fpData.aiAutomationRisk || 20)) },
    { subject: 'Offer Velocity', score: Math.max(20, 100 - (hmData.hiringVelocityDays * 2)) },
    { subject: 'Comp Tier', score: Math.min(95, Math.round((compData.roleBase / compData.topPercentile) * 100)) }
  ];

  return (
    <div className="visual-analytics-container animate-slide-up">
      {/* Top Metric Cards Bar */}
      <div className="bento-grid">
        {/* Metric 1: Compensation Delta */}
        <div className="bento-item glass-panel metric-card">
          <div className="metric-header">
            <TrendingUp size={18} className="metric-icon green-icon" />
            <span className="metric-label">Market Comp Variance</span>
          </div>
          <div className="metric-value green-text">
            {diffFromAvg >= 0 ? `+${diffFromAvg}%` : `${diffFromAvg}%`}
          </div>
          <p className="metric-subtext">
            {diffFromAvg >= 0 ? 'Above industry market average' : 'Below industry market average'}
          </p>
        </div>

        {/* Metric 2: AI Automation Risk */}
        <div className="bento-item glass-panel metric-card">
          <div className="metric-header">
            <Cpu size={18} className="metric-icon amber-icon" />
            <span className="metric-label">AI Replacement Risk</span>
          </div>
          <div className="metric-value amber-text">
            {fpData.aiAutomationRisk}%
          </div>
          <p className="metric-subtext">
            {fpData.aiAutomationRisk <= 30 ? 'Low automation risk (High Human Value)' : 'Moderate risk — UPskill required'}
          </p>
        </div>

        {/* Metric 3: Hiring Rate & Competition */}
        <div className="bento-item glass-panel metric-card">
          <div className="metric-header">
            <Users size={18} className="metric-icon brand-icon" />
            <span className="metric-label">Hiring Competition</span>
          </div>
          <div className="metric-value brand-text">
            {hmData.competitionIndex}/100
          </div>
          <p className="metric-subtext">{hmData.applicantCompetition}</p>
        </div>
      </div>

      {/* Main Bar Chart: Compensation Benchmarking */}
      <div className="glass-panel chart-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Compensation Benchmarking vs Related Fields</h3>
            <p className="chart-subtitle">Direct salary target comparison against industry minimums, averages, and top 10% percentiles.</p>
          </div>
          <div className="chart-badge green-badge">
            Target: ${compData.roleBase?.toLocaleString()} / yr
          </div>
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis dataKey="name" stroke="var(--text-tertiary)" tick={{ fontSize: 12 }} />
              <YAxis 
                stroke="var(--text-tertiary)" 
                tick={{ fontSize: 12 }} 
                tickFormatter={(val) => `$${val / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--surface)', 
                  borderColor: 'var(--border)', 
                  borderRadius: '12px',
                  color: 'var(--text-primary)'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Compensation']}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Grid: Radar & Future-Proof Skills */}
      <div className="bento-grid" style={{ marginTop: '20px' }}>
        {/* 5-Year Role Longevity Radar */}
        <div className="bento-item glass-panel chart-card">
          <h4 className="card-section-title brand-title">
            <Award size={18} /> 360° Role Health & Future Index
          </h4>
          <div className="chart-wrapper" style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--text-tertiary)" />
                <Radar name="Role Index" dataKey="score" stroke="var(--brand-accent)" fill="var(--brand-accent)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Future-Proofing & Skills Action Card */}
        <div className="bento-item glass-panel">
          <h4 className="card-section-title green-title">
            <ShieldAlert size={18} /> Future-Proof Career Trajectory
          </h4>
          
          <div className="growth-badge-container">
            <span className="growth-badge">{fpData.growthTrajectory}</span>
          </div>

          <p className="fp-description">
            To stay ahead of AI automation and maximize your market value over the next 5 years, master these recommended skills:
          </p>

          <div className="future-skills-list">
            {fpData.futureSkillsToLearn?.map((skill, index) => (
              <div key={index} className="future-skill-pill">
                <span className="skill-dot"></span>
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualAnalyticsView;
