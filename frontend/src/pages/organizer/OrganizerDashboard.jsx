import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Users, FileCheck, Clock, ArrowRight, Calendar, UserCheck } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import GlassSurface from '../../components/GlassSurface';
import dashboardService from '../../services/dashboardService';
import { mockOrganizerStats, mockHackathons } from '../../data/mockData';

export const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const data = await dashboardService.getOrganizerDashboard();
        if (data && isMounted) {
          setDashboard(data);
        }
      } catch (err) {
        console.warn('Could not fetch organizer dashboard from API, using fallback:', err);
      }
    };
    fetchDashboard();
    return () => { isMounted = false; };
  }, []);

  const totalHackathons = dashboard?.ownedHackathonsCount ?? mockOrganizerStats.totalHackathons;
  const registeredTeams = dashboard?.pendingRegistrationsCount ?? mockOrganizerStats.registeredTeams;
  const submissions = dashboard?.submissionsCount ?? mockOrganizerStats.submissions;
  const evaluations = dashboard?.evaluationsCount ?? mockOrganizerStats.ongoing;
  const activeHackathons = dashboard?.ownedHackathons && dashboard.ownedHackathons.length > 0
    ? dashboard.ownedHackathons.map(h => ({
        id: h.id,
        title: h.title,
        tagline: h.description,
        status: h.status === 'PUBLISHED' ? 'Registration Open' : (h.status === 'ONGOING' ? 'Ongoing' : h.status),
        dates: h.eventStart ? `${new Date(h.eventStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} 2026` : '15 – 16 Nov 2026',
        registeredTeams: h.registrationsCount || 24,
        submissions: h.submissionsCount || 18,
        category: h.category || 'AI / ML'
      }))
    : mockHackathons.filter(h => h.status === 'Ongoing' || h.status === 'Registration Open');

  return (
    <div className="grid-page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Welcome Banner */}
      <div style={{ marginBottom: '4px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--grid-text)', letterSpacing: '-0.025em', marginBottom: '4px' }}>
          Good Morning, <span style={{ color: 'var(--grid-green)' }}>{dashboard?.organizerName || 'VIT Events'}</span>.
        </h1>
        <p style={{ color: 'var(--grid-muted)', fontSize: '13.5px', margin: 0 }}>
          Manage your hackathons, teams, and evaluations from one place.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '8px'
      }}>
        <StatCard
          label="Hackathons"
          value={String(totalHackathons)}
          icon={Layers}
        />
        <StatCard
          label="Registered Teams"
          value={String(registeredTeams)}
          icon={Users}
        />
        <StatCard
          label="Submissions"
          value={String(submissions)}
          icon={FileCheck}
        />
        <StatCard
          label="Evaluations"
          value={String(evaluations)}
          icon={Clock}
          color="var(--grid-green)"
        />
      </div>

      {/* Active Hackathons Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--grid-text)', margin: 0 }}>
            Active Hackathons
          </h2>
          <button
            onClick={() => navigate('/organizer/hackathons')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--grid-green)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            View All <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          {activeHackathons.map((h) => (
            <GlassSurface
              key={h.id}
              onClick={() => navigate(`/organizer/hackathons/${h.id}`)}
              className="grid-event-card"
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                minHeight: '200px',
                position: 'relative'
              }}
            >
              {/* Ethereal glowing ribbon curve sweep in card background */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '55%',
                  background: 'radial-gradient(ellipse at 100% 50%, rgba(0, 245, 138, 0.16) 0%, transparent 75%)',
                  pointerEvents: 'none',
                  filter: 'blur(20px)'
                }}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  {/* Glowing fluid ribbon thumbnail box */}
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #09121a 0%, #032b1a 60%, var(--grid-green) 120%)',
                    border: '1px solid rgba(0, 245, 138, 0.3)',
                    boxShadow: '0 0 18px rgba(0, 245, 138, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }} />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--grid-text)', margin: 0 }}>
                        {h.title}
                      </h3>
                      <span className="grid-status grid-status-ongoing">
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--grid-green)', boxShadow: '0 0 6px var(--grid-green)' }} />
                        {h.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', color: 'var(--grid-muted)', fontSize: '12.5px', marginTop: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} color="var(--grid-muted)" />
                        {h.dates}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <UserCheck size={13} color="var(--grid-muted)" />
                        {h.registeredTeams || 48} Teams
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--grid-border)' }}>
                <span style={{ fontSize: '12px', color: 'var(--grid-muted)' }}>
                  {h.submissions || 30} Submissions received
                </span>
                <span style={{ color: 'var(--grid-green)', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Manage <ArrowRight size={14} />
                </span>
              </div>
            </GlassSurface>
          ))}
        </div>
      </div>
    </div>
  );
};
