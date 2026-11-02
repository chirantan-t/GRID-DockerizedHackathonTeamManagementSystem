import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/common/StatCard';
import GlassSurface from '../../components/GlassSurface';
import dashboardService from '../../services/dashboardService';
import teamService from '../../services/teamService';
import registrationService from '../../services/registrationService';
import hackathonService from '../../services/hackathonService';
import { Bookmark, FileText, Clock, CheckCircle2, ArrowRight, Calendar, Users } from 'lucide-react';

export const TeamDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('grid_user_registrations') || '[]');
    } catch (_e) {
      return [];
    }
  });
  const [teamName, setTeamName] = useState('Team Alpha');

  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      let combinedRegs = [];
      try {
        const localCached = JSON.parse(localStorage.getItem('grid_user_registrations') || '[]');
        if (Array.isArray(localCached)) combinedRegs = [...localCached];
      } catch (_e) {}

      // 1. Try server dashboard API
      try {
        const data = await dashboardService.getTeamDashboard();
        if (data && isMounted) {
          setDashboard(data);
          if (data.registrations && data.registrations.length > 0) {
            data.registrations.forEach(r => {
              if (!combinedRegs.some(c => String(c.hackathonId) === String(r.hackathonId))) {
                combinedRegs.push({
                  ...r,
                  hackathon: { title: r.hackathonTitle || 'InnovateX 2026' }
                });
              }
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch team dashboard from API:', err);
      }

      // 2. Fetch team info and registrations
      try {
        const myTeams = await teamService.getMyTeams();
        if (myTeams && myTeams.length > 0 && isMounted) {
          const team = myTeams[0];
          setTeamName(team.teamName || team.name || 'Team Alpha');

          const regs = await registrationService.getByTeam(team.id);
          if (regs && regs.length > 0 && isMounted) {
            const enriched = await Promise.all(regs.map(async (reg) => {
              try {
                const h = await hackathonService.getById(reg.hackathonId);
                return { ...reg, hackathon: h };
              } catch (_e) {
                return { ...reg, hackathon: { title: reg.hackathonTitle || 'Hackathon' } };
              }
            }));
            enriched.forEach(e => {
              if (!combinedRegs.some(c => String(c.hackathonId) === String(e.hackathonId))) {
                combinedRegs.push(e);
              }
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch team registrations:', err);
      }

      if (isMounted && combinedRegs.length > 0) {
        setRegisteredEvents(combinedRegs);
      }
    };
    fetchAll();
    return () => { isMounted = false; };
  }, []);

  const displayName = dashboard?.teamName || teamName;
  const regCount = registeredEvents.length || dashboard?.registeredHackathonsCount || dashboard?.registrationsCount || 2;
  const subCount = dashboard?.activeSubmissionsCount || dashboard?.submissionsCount || 1;
  const inProgCount = dashboard?.inProgressHackathonsCount || dashboard?.inProgressCount || (regCount > 0 ? 1 : 0);
  const compCount = dashboard?.completedHackathonsCount || dashboard?.completedCount || 0;
  const activeHackathon = registeredEvents[0]?.hackathon || dashboard?.activeHackathons?.[0];

  return (
    <div className="grid-page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Welcome Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '4px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--grid-text)', letterSpacing: '-0.025em', marginBottom: '4px' }}>
            Good Morning, <span style={{ color: 'var(--grid-green)' }}>{displayName}</span>.
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--grid-muted)', margin: 0 }}>
            Here's your hackathon journey at a glance.
          </p>
        </div>
        <span className="grid-status grid-status-ongoing">
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--grid-green)', boxShadow: '0 0 8px var(--grid-green)' }} />
          {regCount} Active Participations
        </span>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '8px' }}>
        <StatCard icon={Bookmark} label="Registrations" value={String(regCount)} />
        <StatCard icon={FileText} label="Submissions" value={String(subCount)} />
        <StatCard icon={Clock} label="In Progress" value={String(inProgCount)} />
        <StatCard icon={CheckCircle2} label="Completed" value={String(compCount)} />
      </div>

      {/* Registered / Active Hackathons Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--grid-text)', margin: 0 }}>
            {registeredEvents.length > 0 ? 'Your Registered Hackathons' : 'Active Hackathons'}
          </h2>
          <button
            onClick={() => navigate('/team/explore')}
            style={{ background: 'transparent', border: 'none', color: 'var(--grid-green)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {registeredEvents.length > 0 ? 'Explore More' : 'View All'} <ArrowRight size={14} />
          </button>
        </div>

        {registeredEvents.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {registeredEvents.map((reg) => {
              const h = reg.hackathon;
              return (
                <GlassSurface key={reg.id} className="grid-event-card" style={{ padding: '26px', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #09121a 0%, #032b1a 60%, var(--grid-green) 120%)', border: '1px solid rgba(0, 245, 138, 0.3)', boxShadow: '0 0 20px rgba(0, 245, 138, 0.25)', flexShrink: 0 }} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--grid-text)', margin: 0 }}>
                            {h?.title || 'Hackathon'}
                          </h3>
                          <span className="grid-status grid-status-ongoing">
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--grid-green)', boxShadow: '0 0 6px var(--grid-green)' }} />
                            {reg.registrationStatus || reg.status || 'Registered'}
                          </span>
                        </div>
                        <div style={{ fontSize: '12.5px', color: 'var(--grid-muted)', display: 'flex', gap: '18px', marginTop: '4px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Calendar size={13} color="var(--grid-muted)" />
                            {h?.eventStart ? new Date(h.eventStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Nov 2026'}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Users size={13} color="var(--grid-muted)" /> Team: {displayName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => navigate('/team/workspace')} className="grid-button grid-button-primary">
                      Project Workspace <ArrowRight size={15} />
                    </button>
                  </div>
                </GlassSurface>
              );
            })}
          </div>
        ) : (
          /* Fallback when no registrations are loaded */
          <GlassSurface className="grid-event-card" style={{ padding: '26px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #09121a 0%, #032b1a 60%, var(--grid-green) 120%)', border: '1px solid rgba(0, 245, 138, 0.3)', boxShadow: '0 0 20px rgba(0, 245, 138, 0.25)', flexShrink: 0 }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--grid-text)', margin: 0 }}>
                      {activeHackathon?.title || 'InnovateX 2026'}
                    </h3>
                    <span className="grid-status grid-status-ongoing">
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--grid-green)', boxShadow: '0 0 6px var(--grid-green)' }} />
                      {activeHackathon?.status || 'Ongoing'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--grid-muted)', display: 'flex', gap: '18px', marginTop: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={13} color="var(--grid-muted)" />
                      {activeHackathon?.eventStart ? new Date(activeHackathon.eventStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Nov 2026'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Users size={13} color="var(--grid-muted)" /> Team: {displayName}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => navigate('/team/workspace')} className="grid-button grid-button-primary">
                Project Workspace <ArrowRight size={15} />
              </button>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, marginBottom: '8px' }}>
                <span style={{ color: 'var(--grid-muted)' }}>Submission Progress</span>
                <span style={{ color: 'var(--grid-green)' }}>{subCount > 0 ? '100%' : '60%'}</span>
              </div>
              <div style={{ width: '100%', height: '7px', background: 'rgba(255, 255, 255, 0.07)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: subCount > 0 ? '100%' : '60%', height: '100%', background: 'var(--grid-green)', borderRadius: '9999px', boxShadow: '0 0 15px var(--grid-green)' }} />
              </div>
            </div>
          </GlassSurface>
        )}
      </div>
    </div>
  );
};
