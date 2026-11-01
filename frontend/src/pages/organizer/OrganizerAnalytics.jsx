import React, { useState } from 'react';
import { Layers, Users, FileCheck, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { StatCard } from '../../components/common/StatCard';
import { mockAnalyticsRegistrationTrend, mockTeamStatusDistribution } from '../../data/mockData';

export const OrganizerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  return (
    <div className="grid-page-container">
      {/* Header & Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Analytics & Insights
          </h1>
          <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>
            Insights and performance across your hackathons.
          </p>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="grid-select"
          style={{ width: 'auto', padding: '8px 14px', fontSize: '13px' }}
        >
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
          <option>All Time</option>
        </select>
      </div>

      {/* 4 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <StatCard label="Total Hackathons" value="6" icon={Layers} />
        <StatCard label="Total Teams" value="128" icon={Users} />
        <StatCard label="Total Submissions" value="84" icon={FileCheck} />
        <StatCard label="Avg. Completion" value="76%" icon={CheckCircle2} color="var(--grid-neon)" />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Line Chart: Registrations Over Time */}
        <div className="grid-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>
            Registrations Over Time
          </h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={mockAnalyticsRegistrationTrend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="var(--grid-text-muted)" fontSize={12} tickLine={false} />
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
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#00ff66"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#00ff66' }}
                  activeDot={{ r: 6, fill: '#fff', stroke: '#00ff66' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Team Status */}
        <div className="grid-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>
            Team Status
          </h2>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={mockTeamStatusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockTeamStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#12141A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
            {mockTeamStatusDistribution.map((item) => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--grid-text-secondary)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                  {item.name}
                </div>
                <div style={{ color: '#fff', fontWeight: 600 }}>{item.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

