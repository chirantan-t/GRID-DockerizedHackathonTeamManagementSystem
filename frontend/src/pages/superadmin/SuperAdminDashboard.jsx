import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Layers, Users, Activity, Plus, Settings, Calendar, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { StatCard } from '../../components/common/StatCard';
import GlassSurface from '../../components/GlassSurface';
import dashboardService from '../../services/dashboardService';
import { mockSuperAdminStats, mockPlatformActivityData } from '../../data/mockData';

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [adminStats, setAdminStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAdminDashboard = async () => {
      try {
        const data = await dashboardService.getAdminDashboard();
        if (data && isMounted) {
          setAdminStats(data);
        }
      } catch (err) {
        console.warn('Could not fetch admin dashboard from API, using fallback:', err);
      }
    };
    fetchAdminDashboard();
    return () => { isMounted = false; };
  }, []);

  const organizersCount = adminStats?.totalOrganizers ?? mockSuperAdminStats.organizers;
  const hackathonsCount = adminStats?.totalHackathons ?? mockSuperAdminStats.hackathons;
  const usersCount = adminStats?.totalUsers ?? mockSuperAdminStats.totalUsers;
  const activityCount = adminStats?.totalSubmissions ? `${adminStats.totalSubmissions} Subs` : mockSuperAdminStats.platformActivity;

  return (
    <div className="grid-page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Welcome Banner */}
      <div style={{ marginBottom: '4px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--grid-text)', letterSpacing: '-0.025em', marginBottom: '4px' }}>
          Welcome back, <span style={{ color: 'var(--grid-green)' }}>Super Admin</span>.
        </h1>
        <p style={{ color: 'var(--grid-muted)', fontSize: '13.5px', margin: 0 }}>
          Oversee the entire GRID platform from one place.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '8px'
      }}>
        <StatCard label="Organizers" value={String(organizersCount)} icon={Shield} />
        <StatCard label="Hackathons" value={String(hackathonsCount)} icon={Layers} />
        <StatCard label="Total Users" value={String(usersCount)} icon={Users} />
        <StatCard label="Platform Activity" value={String(activityCount)} icon={Activity} color="var(--grid-green)" />
      </div>

      {/* Main Grid: Activity Chart + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Platform Activity Wave */}
        <GlassSurface className="grid-event-card" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--grid-text)', margin: 0 }}>
                Platform Activity
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--grid-muted)', margin: '2px 0 0' }}>
                System-wide engagement and live event traffic.
              </p>
            </div>
            <span className="grid-status grid-status-ongoing" style={{ fontSize: '11px', padding: '4px 10px' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--grid-green)' }} />
              Live Telemetry
            </span>
          </div>

          <div style={{ width: '100%', height: 210 }}>
            <ResponsiveContainer>
              <AreaChart data={mockPlatformActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f58a" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#00f58a" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="var(--grid-muted)" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(16, 22, 20, 0.9)',
                    backdropFilter: 'blur(16px)',
                    borderColor: 'rgba(0,245,138,0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="activity" stroke="#00f58a" strokeWidth={3} fillOpacity={1} fill="url(#neonGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassSurface>

        {/* Quick Actions Card */}
        <GlassSurface className="grid-event-card" style={{ padding: '26px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--grid-text)', marginBottom: '18px' }}>
            Quick Actions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => navigate('/admin/organizers')}
              className="grid-button"
              style={{ justifyContent: 'space-between', padding: '13px 16px', borderRadius: '14px' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600 }}>
                <Plus size={16} color="var(--grid-green)" /> Add Organizer
              </span>
              <ArrowRight size={14} color="var(--grid-muted)" />
            </button>

            <button
              onClick={() => navigate('/admin/hackathons')}
              className="grid-button"
              style={{ justifyContent: 'space-between', padding: '13px 16px', borderRadius: '14px' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600 }}>
                <Calendar size={16} color="var(--grid-green)" /> Oversee Hackathons
              </span>
              <ArrowRight size={14} color="var(--grid-muted)" />
            </button>

            <button
              onClick={() => navigate('/admin/settings')}
              className="grid-button"
              style={{ justifyContent: 'space-between', padding: '13px 16px', borderRadius: '14px' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600 }}>
                <Settings size={16} color="var(--grid-green)" /> Platform Settings
              </span>
              <ArrowRight size={14} color="var(--grid-muted)" />
            </button>
          </div>
        </GlassSurface>
      </div>
    </div>
  );
};
