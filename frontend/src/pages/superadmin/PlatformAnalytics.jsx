import React, { useState } from 'react';
import { Users, Layers, Award, FileText } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { StatCard } from '../../components/common/StatCard';
import { mockUserGrowthTrend, mockRoleParticipationData } from '../../data/mockData';

export const PlatformAnalytics = () => {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  return (
    <div className="grid-page-container">
      {/* Header & Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Platform Analytics
          </h1>
          <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>
            System-wide user adoption, team formation, and submission metrics.
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
        <StatCard label="Total Users" value="2,842" change="+12%" icon={Users} />
        <StatCard label="Total Hackathons" value="36" change="+20%" icon={Layers} />
        <StatCard label="Total Teams" value="712" change="+18%" icon={Award} />
        <StatCard label="Submissions" value="5,921" change="+24%" icon={FileText} color="var(--grid-neon)" />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Line Chart: User Growth */}
        <div className="grid-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>
            User Growth
          </h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={mockUserGrowthTrend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
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
                  dataKey="users"
                  stroke="#00ff66"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#00ff66' }}
                  activeDot={{ r: 6, fill: '#fff', stroke: '#00ff66' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Participation by Role */}
        <div className="grid-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>
            Participation by Role
          </h2>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={mockRoleParticipationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockRoleParticipationData.map((entry, index) => (
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
            {mockRoleParticipationData.map((item) => (
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

