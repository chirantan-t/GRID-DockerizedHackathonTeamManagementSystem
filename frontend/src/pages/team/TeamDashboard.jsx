import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import GlassSurface from '../../components/GlassSurface';
import dashboardService from '../../services/dashboardService';
import teamService from '../../services/teamService';
import registrationService from '../../services/registrationService';
import hackathonService from '../../services/hackathonService';
import { Bookmark, FileText, Clock, CheckCircle2, ArrowRight, Calendar, Users, RefreshCw } from 'lucide-react';

export const TeamDashboard = () => {
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [teamName, setTeamName] = useState('Team Alpha');
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    let combinedRegs = [];

    // 1. Fetch server dashboard API (real MySQL data)
    try {
      const data = await dashboardService.getTeamDashboard();
      if (data) {
        setDashboard(data);
        if (data.registrations && data.registrations.length > 0) {
          data.registrations.forEach(r => {
            combinedRegs.push({
              ...r,
              id: r.id,
              hackathonId: r.hackathonId,
              hackathon: {
                title: r.hackathonTitle || 'Hackathon Event',
                status: r.status || r.registrationStatus
              }
            });
          });
        }
      }
    } catch (err) {
      console.warn('Dashboard API response note:', err);
    }

    // 2. Fetch team info and registrations directly by team IDs
    try {
      const myTeams = await teamService.getMyTeams();
      if (myTeams && myTeams.length > 0) {
        setTeamName(myTeams[0].teamName || myTeams[0].name || 'Team Alpha');

        for (const t of myTeams) {
          try {
            const regs = await registrationService.getByTeam(t.id);
            if (regs && regs.length > 0) {
              for (const reg of regs) {
                if (!combinedRegs.some(c => String(c.hackathonId) === String(reg.hackathonId))) {
                  try {
                    const h = await hackathonService.getById(reg.hackathonId);
                    combinedRegs.push({ ...reg, hackathon: h });
                  } catch (_hErr) {
                    combinedRegs.push({
                      ...reg,
                      hackathon: { title: reg.hackathonTitle || 'Hackathon' }
                    });
                  }
                }
              }
            }
          } catch (_rErr) {}
        }
      }
    } catch (_tErr) {}

    // 3. Fallback to localStorage cached entries
    try {
      const localCached = JSON.parse(localStorage.getItem('grid_user_registrations') || '[]');
      if (Array.isArray(localCached)) {
        localCached.forEach(lc => {
          if (!combinedRegs.some(c => String(c.hackathonId) === String(lc.hackathonId))) {
            combinedRegs.push(lc);
          }
        });
      }
    } catch (_cErr) {}

    setRegisteredEvents(combinedRegs);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, [role, isAuthenticated]);

  const displayName = dashboard?.teamName || teamName;
  const regCount = dashboard?.registeredHackathonsCount ?? registeredEvents.length;
  const subCount = dashboard?.activeSubmissionsCount ?? 0;
  const inProgCount = dashboard?.inProgressHackathonsCount ?? (regCount > 0 ? regCount : 0);
  const compCount = dashboard?.completedHackathonsCount ?? 0;

  return (
    <div className="grid-page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Welcome Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '4px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--grid-text)', letterSpacing: '-0.025em', marginBottom: '4px' }}>
            Good Morning, <span style={{ color: 'var(--grid-green)' }}>{displayName}</span>.
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--grid-muted)', margin: 0 }}>
            Here's your real-time hackathon journey backed by live database records.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={fetchAll}
            title="Refresh database records"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              padding: '6px 14px',
              color: 'var(--grid-muted)',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={13} /> Sync Data
          </button>
          <span className="grid-status grid-status-ongoing">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--grid-green)', boxShadow: '0 0 8px var(--grid-green)' }} />
            {regCount} Active Participations
          </span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '8px' }}>
        <StatCard icon={Bookmark} label="Registrations" value={String(regCount)} />
        <StatCard icon={FileText} label="Submissions" value={String(subCount)} />
        <StatCard icon={Clock} label="In Progress" value={String(inProgCount)} />
        <StatCard icon={CheckCircle2} label="Completed" value={String(compCount)} />
      </div>

      {/* Registered Hackathons Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--grid-text)', margin: 0 }}>
            Your Registered Hackathons ({registeredEvents.length})
          </h2>
          <button
            onClick={() => navigate('/team/explore')}
            style={{ background: 'transparent', border: 'none', color: 'var(--grid-green)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Explore More <ArrowRight size={14} />
          </button>
        </div>

        {registeredEvents.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {registeredEvents.map((reg, idx) => {
              const h = reg.hackathon || {};
              const title = h.title || reg.hackathonTitle || 'Hackathon Event';
              const status = reg.registrationStatus || reg.status || 'PENDING';
              return (
                <GlassSurface key={reg.id || idx} className="grid-event-card" style={{ padding: '24px', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #09121a 0%, #032b1a 60%, var(--grid-green) 120%)',
                        border: '1px solid rgba(0, 245, 138, 0.3)',
                        boxShadow: '0 0 16px rgba(0, 245, 138, 0.25)',
                        flexShrink: 0
                      }} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--grid-text)', margin: 0 }}>
                            {title}
                          </h3>
                          <span className={`grid-status ${status === 'APPROVED' ? 'grid-status-ongoing' : 'grid-status-pending'}`}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: status === 'APPROVED' ? 'var(--grid-green)' : '#f59e0b', boxShadow: status === 'APPROVED' ? '0 0 6px var(--grid-green)' : 'none' }} />
                            {status}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--grid-muted)', display: 'flex', gap: '16px', marginTop: '4px', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Calendar size={13} color="var(--grid-muted)" />
                            {reg.registeredAt ? new Date(reg.registeredAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Nov 2026'}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Users size={13} color="var(--grid-muted)" />
                            Squad: {reg.teamName || displayName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/team/workspace')}
                      className="grid-button grid-button-primary"
                      style={{ padding: '8px 18px', fontSize: '13px' }}
                    >
                      Project Workspace <ArrowRight size={14} />
                    </button>
                  </div>
                </GlassSurface>
              );
            })}
          </div>
        ) : (
          <GlassSurface className="grid-event-card" style={{ padding: '36px', textAlign: 'center' }}>
            <Bookmark size={32} color="var(--grid-muted)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ color: 'var(--grid-text)', fontSize: '17px', fontWeight: 600, marginBottom: '6px' }}>
              No Registrations Found
            </h3>
            <p style={{ color: 'var(--grid-muted)', fontSize: '13px', marginBottom: '18px' }}>
              You have not registered for any hackathons yet.
            </p>
            <button onClick={() => navigate('/team/explore')} className="grid-button grid-button-primary" style={{ margin: '0 auto' }}>
              Browse & Register Now <ArrowRight size={14} />
            </button>
          </GlassSurface>
        )}
      </div>
    </div>
  );
};
