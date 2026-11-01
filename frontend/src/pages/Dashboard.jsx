import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { teamService } from '../services/teamService';
import { memberService } from '../services/memberService';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { TrackBadge } from '../components/TrackBadge';
import {
  Users, CheckCircle2, Clock, Send, Award, AlertCircle, FileText, PlusCircle, ArrowUpRight,
  ShieldCheck, Compass, Code2, Sparkles, UserCheck, Eye, Edit3, Check, XCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from 'recharts';

const WORKFLOW_STEPS = [
  { key: 'DRAFT', label: 'Draft', desc: 'Profile initiated' },
  { key: 'REGISTERED', label: 'Registered', desc: 'Under review' },
  { key: 'APPROVED', label: 'Approved', desc: 'Verified for event' },
  { key: 'IN_PROGRESS', label: 'In Progress', desc: 'Building prototype' },
  { key: 'SUBMITTED', label: 'Submitted', desc: 'Ready for judging' },
  { key: 'COMPLETED', label: 'Completed', desc: 'Evaluated' }
];

const getStatusMessage = (status) => {
  switch (status) {
    case 'DRAFT':
      return 'Your registration is currently saved as a Draft. Complete your project details and enroll teammates, then submit for review.';
    case 'REGISTERED':
      return 'Your team registration is submitted and currently under review by hackathon organizers. Awaiting official verification.';
    case 'APPROVED':
      return 'Congratulations! Your team registration has been approved. You are officially verified to build your prototype.';
    case 'IN_PROGRESS':
      return 'Development is actively underway! Build, test, and prepare your project deliverables for final submission.';
    case 'SUBMITTED':
      return 'Your final deliverables have been submitted. The judging panel is currently reviewing your project.';
    case 'COMPLETED':
      return 'Hackathon evaluation completed! Congratulations on successfully completing your hackathon journey.';
    case 'REJECTED':
      return 'Your team registration was not approved. Please consult event organizers for feedback or next steps.';
    default:
      return 'Status information currently being processed.';
  }
};

export const Dashboard = () => {
  const { user, isAdmin, isOrganizer, isLead } = useAuth();
  const [summary, setSummary] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [trackData, setTrackData] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [myMembers, setMyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [isLead]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      if (isLead) {
        const team = await teamService.getMyTeam();
        setMyTeam(team || null);
        if (team && team.id) {
          try {
            const members = await memberService.getMembers(team.id);
            setMyMembers(members || []);
          } catch (mErr) {
            console.error('Failed to load team members:', mErr);
          }
        }
      } else {
        const [sum, stDist, trDist] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getStatusDistribution(),
          dashboardService.getTrackDistribution()
        ]);
        setSummary(sum);
        setStatusData(stDist);
        setTrackData(trDist);
      }
    } catch (err) {
      setError('Failed to load dashboard data from backend.');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = ['#9ca3af', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f43f5e'];
  const trackColors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading live dashboard statistics...</p>
      </div>
    );
  }

  // Role-specific display configurations
  const roleConfig = isAdmin ? {
    badge: 'Administrator Control Panel',
    icon: ShieldCheck,
    badgeColor: '#ef4444',
    badgeBg: 'rgba(239, 68, 68, 0.12)',
    title: 'Executive Administrator Dashboard',
    subtitle: 'System-wide governance, unrestricted team lifecycle oversight, and platform audit metrics',
    bannerText: 'Full Privileged Access: Authorized to perform cascade deletion, database configuration, and global state machine overrides.'
  } : isOrganizer ? {
    badge: 'Organizer Operations Desk',
    icon: Compass,
    badgeColor: '#f59e0b',
    badgeBg: 'rgba(245, 158, 11, 0.12)',
    title: 'Hackathon Operations & Review Hub',
    subtitle: 'Manage team approvals, monitor submission deadlines, and evaluate category track allocations',
    bannerText: 'Organizer Scope: Authorized to review candidate teams, progress workflow states, and manage track allocations (cannot delete teams).'
  } : {
    badge: 'Participant & Team Lead Portal',
    icon: Code2,
    badgeColor: '#38bdf8',
    badgeBg: 'rgba(56, 189, 248, 0.12)',
    title: 'Team Lead Registry Status',
    subtitle: 'Track your official registration status, manage your project deliverables, and coordinate your roster',
    bannerText: `Welcome, ${user?.fullName || user?.username || 'Team Lead'}! Your access is scoped to registering your project and tracking your registry status.`
  };

  const RoleIcon = roleConfig.icon;
  const currentStepIndex = myTeam ? WORKFLOW_STEPS.findIndex(s => s.key === myTeam.registrationStatus) : -1;

  return (
    <div className="page-wrapper" id="dashboard-page">
      {/* Role-Specific Header Banner */}
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: roleConfig.badgeBg,
              color: roleConfig.badgeColor,
              border: `1px solid ${roleConfig.badgeColor}33`
            }}>
              <RoleIcon size={14} />
              {roleConfig.badge}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Logged in as <strong style={{ color: 'var(--text-primary)' }}>{user?.fullName || user?.username}</strong>
            </span>
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: '800', margin: '0.25rem 0' }}>{roleConfig.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            {roleConfig.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {!isLead && (
            <Link to="/teams" className="btn btn-secondary btn-sm" id="dashboard-view-teams-btn">
              <Users size={16} />
              <span>Browse All Teams</span>
            </Link>
          )}

          {isLead ? (
            myTeam ? (
              <Link to={`/teams/${myTeam.id}`} className="btn btn-primary btn-sm" id="dashboard-manage-team-btn">
                <Users size={16} />
                <span>My Team & Roster</span>
              </Link>
            ) : (
              <Link to="/teams/new" className="btn btn-primary btn-sm" id="dashboard-register-btn">
                <PlusCircle size={16} />
                <span>Register Your Team</span>
              </Link>
            )
          ) : (
            <Link to="/teams/new" className="btn btn-primary btn-sm" id="dashboard-register-btn">
              <PlusCircle size={16} />
              <span>Register Team</span>
            </Link>
          )}
        </div>
      </div>

      {/* Role Notice Banner */}
      <div style={{
        background: roleConfig.badgeBg,
        border: `1px solid ${roleConfig.badgeColor}33`,
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.85rem',
        color: 'var(--text-primary)'
      }}>
        <Sparkles size={18} style={{ color: roleConfig.badgeColor, flexShrink: 0 }} />
        <span>{roleConfig.bannerText}</span>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. TEAM_LEAD VIEW: ONLY MY TEAM REGISTRATION & STATUS     */}
      {/* ======================================================== */}
      {isLead ? (
        myTeam ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Status & Workflow Stage Stepper */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                    Official Registration Status
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                    <StatusBadge status={myTeam.registrationStatus} />
                    <TrackBadge track={myTeam.track} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <Link to={`/teams/${myTeam.id}`} className="grid-btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                    <Eye size={15} />
                    <span>View Roster</span>
                  </Link>
                  <Link to={`/teams/${myTeam.id}/edit`} className="grid-btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                    <Edit3 size={15} />
                    <span>Edit Project</span>
                  </Link>
                </div>
              </div>

              {/* Status Explanation Box */}
              <div style={{
                background: myTeam.registrationStatus === 'REJECTED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.08)',
                border: `1px solid ${myTeam.registrationStatus === 'REJECTED' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.25)'}`,
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                marginBottom: '1.75rem',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                {myTeam.registrationStatus === 'REJECTED' ? (
                  <XCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                ) : (
                  <CheckCircle2 size={18} color="#3b82f6" style={{ flexShrink: 0 }} />
                )}
                <span>{getStatusMessage(myTeam.registrationStatus)}</span>
              </div>

              {/* Workflow Stepper */}
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Hackathon Lifecycle Journey:
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {WORKFLOW_STEPS.map((step, idx) => {
                    const isCompleted = currentStepIndex > idx;
                    const isCurrent = currentStepIndex === idx;

                    return (
                      <div
                        key={step.key}
                        style={{
                          background: isCurrent
                            ? 'rgba(56, 189, 248, 0.12)'
                            : isCompleted
                              ? 'rgba(16, 185, 129, 0.08)'
                              : 'var(--bg-secondary)',
                          border: `1px solid ${
                            isCurrent
                              ? 'rgba(56, 189, 248, 0.5)'
                              : isCompleted
                                ? 'rgba(16, 185, 129, 0.3)'
                                : 'var(--border-subtle)'
                          }`,
                          borderRadius: '8px',
                          padding: '0.85rem 0.75rem',
                          textAlign: 'center',
                          position: 'relative'
                        }}
                      >
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: isCompleted ? '#10b981' : isCurrent ? '#38bdf8' : 'rgba(255,255,255,0.08)',
                          color: '#fff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          marginBottom: '0.4rem'
                        }}>
                          {isCompleted ? <Check size={14} /> : idx + 1}
                        </div>
                        <div style={{
                          fontWeight: isCurrent ? '700' : '500',
                          color: isCurrent ? '#38bdf8' : isCompleted ? '#10b981' : 'var(--text-secondary)',
                          fontSize: '0.85rem'
                        }}>
                          {step.label}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {step.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Team Overview & Roster Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
              {/* Project Card */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>
                      TEAM CODE: {myTeam.teamCode}
                    </span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: '800', margin: '0.25rem 0' }}>{myTeam.teamName}</h3>
                  </div>
                  <TrackBadge track={myTeam.track} />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Project Title
                  </label>
                  <p style={{ fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                    {myTeam.projectTitle}
                  </p>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Project Description
                  </label>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                    {myTeam.projectDescription}
                  </p>
                </div>

                <div style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)'
                }}>
                  <span>Team Lead: <strong style={{ color: '#fff' }}>{myTeam.teamLead}</strong></span>
                  <Link to={`/teams/${myTeam.id}/edit`} className="grid-btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                    <Edit3 size={14} /> Edit Project
                  </Link>
                </div>
              </div>

              {/* Roster Preview Card */}
              <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Active Team Roster</h3>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      background: 'rgba(56, 189, 248, 0.12)',
                      color: '#38bdf8',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px'
                    }}>
                      {myMembers.length} Members
                    </span>
                  </div>

                  {myMembers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                      <Users size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                      <p style={{ fontSize: '0.85rem' }}>No teammates enrolled yet.</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Add members in full team profile.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {myMembers.slice(0, 4).map((m) => (
                        <div
                          key={m.id}
                          style={{
                            background: 'var(--bg-secondary)',
                            borderRadius: '6px',
                            padding: '0.6rem 0.75rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#fff' }}>{m.fullName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.college}</div>
                          </div>
                          <span style={{
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            color: 'var(--accent-primary)',
                            fontWeight: '600'
                          }}>
                            {m.teamRole}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <Link to={`/teams/${myTeam.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    <Users size={16} />
                    <span>Manage Full Team & Members</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State: Team Lead has not registered a team yet */
          <div className="card" style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'linear-gradient(180deg, var(--card-bg) 0%, rgba(26, 33, 56, 0.5) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '16px'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Code2 size={36} color="#38bdf8" />
            </div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              Welcome, {user?.fullName || user?.username}!
            </h3>
            <p style={{
              maxWidth: '560px',
              margin: '0 auto 1.75rem auto',
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: '1.6'
            }}>
              You are signed in with the <strong>Team Lead</strong> account. To enter the hackathon and begin your project lifecycle, register your team specifications below. Once submitted, event organizers will review and verify your registry status.
            </p>

            <Link
              to="/teams/new"
              className="btn btn-primary"
              id="dashboard-register-btn"
              style={{
                padding: '0.85rem 2rem',
                fontSize: '1rem',
                fontWeight: '700',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <PlusCircle size={20} />
              <span>Register Your Hackathon Team Now</span>
            </Link>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginTop: '3rem',
              textAlign: 'left'
            }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: '700', fontSize: '0.85rem' }}>STEP 1</span>
                <h5 style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>Enroll Team & Track</h5>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Define your team name, track focus, and project concept.</p>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: '700', fontSize: '0.85rem' }}>STEP 2</span>
                <h5 style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>Organizer Review</h5>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Organizers verify team credentials and approve participation.</p>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: '700', fontSize: '0.85rem' }}>STEP 3</span>
                <h5 style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>Build & Submit</h5>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Enroll teammates, build prototype, and submit final deliverables.</p>
              </div>
            </div>
          </div>
        )
      ) : (
        /* ======================================================== */
        /* 2. ADMIN & ORGANIZER VIEW: GLOBAL METRICS & DIRECTORY     */
        /* ======================================================== */
        <>
          {/* KPI Stat Cards */}
          <div className="stat-grid">
            <StatCard
              id="stat-total-teams"
              label="Total Teams"
              value={summary?.totalTeams || 0}
              icon={Users}
              color="var(--accent-primary)"
            />
            <StatCard
              id="stat-registered-teams"
              label="Registered"
              value={summary?.registeredTeams || 0}
              icon={FileText}
              color="#3b82f6"
            />
            <StatCard
              id="stat-approved-teams"
              label="Approved"
              value={summary?.approvedTeams || 0}
              icon={CheckCircle2}
              color="var(--accent-emerald)"
            />
            <StatCard
              id="stat-in-progress-teams"
              label="In Progress"
              value={summary?.inProgressTeams || 0}
              icon={Clock}
              color="var(--accent-amber)"
            />
            <StatCard
              id="stat-submitted-teams"
              label="Submitted"
              value={summary?.submittedTeams || 0}
              icon={Send}
              color="var(--accent-purple)"
            />
            <StatCard
              id="stat-completed-teams"
              label="Completed"
              value={summary?.completedTeams || 0}
              icon={Award}
              color="var(--accent-cyan)"
            />
            <StatCard
              id="stat-total-members"
              label="Active Members"
              value={summary?.totalMembers || 0}
              icon={Users}
              color="#a5b4fc"
            />
          </div>

          {/* Analytics Charts Grid */}
          <div className="charts-grid">
            {/* Status Distribution Chart */}
            <div className="card">
              <div className="chart-header">
                <h3 style={{ fontSize: '1.15rem' }}>Team Lifecycle Progression</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Distribution across stages</span>
              </div>
              <div style={{ height: 280, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="label"
                      stroke="var(--text-muted)"
                      fontSize={11}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Track Distribution Chart */}
            <div className="card">
              <div className="chart-header">
                <h3 style={{ fontSize: '1.15rem' }}>Hackathon Tracks Breakdown</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Team distribution by focus area</span>
              </div>
              <div style={{ height: 280, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trackData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="label"
                      stroke="var(--text-muted)"
                      fontSize={11}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {trackData.map((entry, index) => (
                        <Cell key={`cell-tr-${index}`} fill={trackColors[index % trackColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Teams Activity Table */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>Recently Updated Teams</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest submissions and roster modifications</span>
              </div>
              <Link to="/teams" style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span>View All Teams</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Team Name</th>
                    <th>Project Title</th>
                    <th>Lead</th>
                    <th>Track</th>
                    <th>Status</th>
                    <th>Members</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {summary?.recentTeams?.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        No team activity logged yet.
                      </td>
                    </tr>
                  ) : (
                    summary?.recentTeams?.map((t) => (
                      <tr key={t.id}>
                        <td><code>{t.teamCode}</code></td>
                        <td><strong style={{ color: '#fff' }}>{t.teamName}</strong></td>
                        <td>{t.projectTitle}</td>
                        <td>{t.teamLead}</td>
                        <td><TrackBadge track={t.track} /></td>
                        <td><StatusBadge status={t.registrationStatus} /></td>
                        <td>{t.memberCount}</td>
                        <td>
                          <Link to={`/teams/${t.id}`} className="btn btn-secondary btn-sm">
                            {isOrganizer ? 'Review' : 'View'}
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
