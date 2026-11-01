import React, { useState } from 'react';
import { Download, TrendingUp, CheckCircle2, Star } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { mockMonthlyParticipationData } from '../../data/mockData';

export const PlatformReports = () => {
  const [activeTab, setActiveTab] = useState('Participation');

  const tabs = ['Participation', 'Submissions', 'Hackathons', 'Organizers'];

  return (
    <div className="grid-page-container">
      {/* Title & Export */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Platform Reports
          </h1>
          <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>
            Download comprehensive reports and analyze performance trends.
          </p>
        </div>

        <button className="grid-btn grid-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={15} /> Export Report
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--grid-border-light)', paddingBottom: '12px' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? 'rgba(0, 255, 102, 0.12)' : 'transparent',
              color: activeTab === tab ? 'var(--grid-neon)' : 'var(--grid-text-secondary)',
              border: activeTab === tab ? '1px solid rgba(0, 255, 102, 0.3)' : '1px solid transparent',
              borderRadius: '20px',
              padding: '6px 16px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Grid: Bar Chart + Key Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left: Bar Chart */}
        <div className="grid-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>
            Team Participation
          </h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={mockMonthlyParticipationData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="var(--grid-text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--grid-text-muted)" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#12141A',
                    borderColor: 'rgba(0,255,102,0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="teams" fill="#00ff66" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Key Insights */}
        <div className="grid-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>
            Key Insights
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(0, 255, 102, 0.1)', color: 'var(--grid-neon)' }}>
                <TrendingUp size={16} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>+18% Team Registrations</div>
                <div style={{ fontSize: '12px', color: 'var(--grid-text-secondary)', marginTop: '2px' }}>
                  Significant increase vs. previous cycle.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(0, 255, 102, 0.1)', color: 'var(--grid-neon)' }}>
                <CheckCircle2 size={16} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>76% Submission Rate</div>
                <div style={{ fontSize: '12px', color: 'var(--grid-text-secondary)', marginTop: '2px' }}>
                  Across all active & completed hackathons.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(0, 255, 102, 0.1)', color: 'var(--grid-neon)' }}>
                <Star size={16} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>4.3 / 5 Evaluation Score</div>
                <div style={{ fontSize: '12px', color: 'var(--grid-text-secondary)', marginTop: '2px' }}>
                  Platform-wide average judge evaluation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

