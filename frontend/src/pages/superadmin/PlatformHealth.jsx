import React from 'react';
import { CheckCircle2, Activity, Globe, Database, HardDrive, KeyRound, Mail } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Badge } from '../../components/common/Badge';
import { mockPlatformHealthServices, mockServerMetrics } from '../../data/mockData';

export const PlatformHealth = () => {
  const getServiceIcon = (name) => {
    switch (name) {
      case 'Web Application': return Globe;
      case 'Database': return Database;
      case 'File Storage': return HardDrive;
      case 'Authentication': return KeyRound;
      case 'Email Service': return Mail;
      default: return Activity;
    }
  };

  const sparklineData = [
    { time: '1', load: 30 },
    { time: '2', load: 38 },
    { time: '3', load: 32 },
    { time: '4', load: 45 },
    { time: '5', load: 34 }
  ];

  return (
    <div className="grid-page-container">
      {/* Title & Overall Status Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Platform Health
          </h1>
          <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>
            Monitor system status, services, and live performance telemetry.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 255, 102, 0.1)',
          border: '1px solid rgba(0, 255, 102, 0.3)',
          borderRadius: '20px',
          padding: '8px 16px',
          color: 'var(--grid-neon)',
          fontSize: '13px',
          fontWeight: 600
        }}>
          <CheckCircle2 size={16} /> All Systems Operational
        </div>
      </div>

      {/* Main Grid: Services Status List + System Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px' }}>
        {/* Left: Services Status List */}
        <div className="grid-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>
            Core Infrastructure Services
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mockPlatformHealthServices.map((svc) => {
              const Icon = getServiceIcon(svc.name);
              return (
                <div
                  key={svc.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--grid-border-light)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', color: 'var(--grid-neon)' }}>
                      <Icon size={18} />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                      {svc.name}
                    </span>
                  </div>

                  <Badge variant={svc.status}>{svc.status}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: System Metrics */}
        <div className="grid-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
            System Metrics
          </h2>

          {/* Sparkline */}
          <div style={{ width: '100%', height: 70, marginBottom: '20px' }}>
            <ResponsiveContainer>
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff66" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00ff66" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="load" stroke="#00ff66" strokeWidth={2} fill="url(#metricGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--grid-border-light)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--grid-text-secondary)', fontSize: '13px' }}>Uptime</span>
              <span style={{ color: 'var(--grid-neon)', fontWeight: 600, fontSize: '14px' }}>{mockServerMetrics.uptime}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--grid-border-light)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--grid-text-secondary)', fontSize: '13px' }}>Response Time</span>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{mockServerMetrics.responseTime}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--grid-border-light)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--grid-text-secondary)', fontSize: '13px' }}>Active Sessions</span>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{mockServerMetrics.activeSessions}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--grid-text-secondary)', fontSize: '13px' }}>Server Load</span>
              <span style={{ color: 'var(--grid-neon)', fontWeight: 600, fontSize: '14px' }}>{mockServerMetrics.serverLoad}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

