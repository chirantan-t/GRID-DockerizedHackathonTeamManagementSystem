import React, { useState, useEffect } from 'react';
import { MOCK_SUBMISSIONS } from '../../data/mockData';
import GlassSurface from '../../components/GlassSurface';
import teamService from '../../services/teamService';
import submissionService from '../../services/submissionService';
import { Plus, ExternalLink, Send, CheckCircle2, X } from 'lucide-react';

export const TeamSubmissions = () => {
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS);
  const [teamId, setTeamId] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newSub, setNewSub] = useState({
    hackathonTitle: 'InnovateX 2026',
    submissionName: '',
    repoUrl: '',
    demoUrl: '',
    videoUrl: ''
  });

  useEffect(() => {
    let isMounted = true;
    const fetchSubmissions = async () => {
      try {
        const teams = await teamService.getMyTeams();
        if (teams && teams.length > 0) {
          const currentTeamId = teams[0].id;
          setTeamId(currentTeamId);
          const subs = await submissionService.getByTeam(currentTeamId);
          if (subs && subs.length > 0 && isMounted) {
            const mapped = subs.map(s => ({
              id: String(s.id),
              teamId: String(s.teamId),
              teamName: s.teamName || 'Team Alpha',
              hackathonTitle: s.hackathonTitle || 'InnovateX 2026',
              projectTitle: s.projectTitle,
              submissionName: s.projectTitle,
              status: s.status === 'SUBMITTED' ? 'Submitted' : 'Draft',
              submittedOn: s.submittedAt ? new Date(s.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' 2026' : '15 Nov 2026',
              repoUrl: s.repositoryUrl,
              demoUrl: s.demoVideoUrl || s.documentationUrl
            }));
            setSubmissions(mapped);
          }
        }
      } catch (err) {
        console.warn('Could not fetch team submissions from API, using fallback:', err);
      }
    };
    fetchSubmissions();
    return () => { isMounted = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const created = {
      id: `sub-${Date.now()}`,
      teamId: String(teamId),
      teamName: 'Team Alpha',
      hackathonTitle: newSub.hackathonTitle,
      projectTitle: newSub.submissionName || 'Smart City Waste Management',
      submissionName: newSub.submissionName || 'Final Release Candidate',
      status: 'Submitted',
      submittedOn: 'Just now',
      repoUrl: newSub.repoUrl,
      demoUrl: newSub.demoUrl
    };
    setSubmissions([created, ...submissions]);
    setShowModal(false);

    try {
      await submissionService.createSubmission({
        registrationId: 1,
        projectTitle: newSub.submissionName || 'Final Release Candidate',
        description: 'Final project deliverables and repository link.',
        repositoryUrl: newSub.repoUrl || 'https://github.com/teamalpha/scwm',
        demoVideoUrl: newSub.videoUrl || newSub.demoUrl || 'https://youtu.be/demo',
        documentationUrl: newSub.demoUrl || 'https://docs.teamalpha.dev',
        techStack: 'React, Spring Boot, MySQL'
      });
    } catch (apiErr) {
      console.warn('Could not persist submission to backend:', apiErr);
    }
  };

  return (
    <div className="grid-page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--grid-text)', marginBottom: '6px' }}>
            Your Submissions
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--grid-muted)', margin: 0 }}>
            Manage and track your project submissions.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} />
          <span>New Submission</span>
        </button>
      </div>

      {/* Submissions Glass Table */}
      <GlassSurface style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--grid-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Hackathon</th>
              <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--grid-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Submission Title</th>
              <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--grid-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--grid-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Submitted On</th>
              <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--grid-muted)', fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr
                key={s.id}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '16px', fontWeight: 600, color: 'var(--grid-text)' }}>{s.hackathonTitle}</td>
                <td style={{ padding: '16px', color: 'var(--grid-text)' }}>{s.submissionName || s.projectTitle}</td>
                <td style={{ padding: '16px' }}>
                  <span className={`grid-status ${s.status === 'Submitted' ? 'grid-status-ongoing' : 'grid-status-open'}`}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.status === 'Submitted' ? 'var(--grid-green)' : '#00eaff' }} />
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: '16px', color: 'var(--grid-muted)', fontSize: '13px' }}>{s.submittedOn}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  {s.repoUrl && (
                    <a
                      href={s.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                    >
                      <ExternalLink size={13} color="var(--grid-green)" />
                      <span>Repo</span>
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassSurface>

      {/* New Submission Glassmorphic Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(15, 20, 18, 0.92)',
              border: '1px solid rgba(0, 245, 138, 0.35)',
              borderRadius: '24px',
              padding: '36px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 245, 138, 0.15)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'transparent',
                border: 'none',
                color: '#9aa1ad',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Submit Project Deliverable
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--grid-muted)', marginBottom: '24px' }}>
              Finalize links and repositories before the event cutoff deadline.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px' }}>
                  Target Hackathon
                </label>
                <select
                  value={newSub.hackathonTitle}
                  onChange={(e) => setNewSub({ ...newSub, hackathonTitle: e.target.value })}
                >
                  <option value="InnovateX 2026">InnovateX 2026</option>
                  <option value="BuildForGood">BuildForGood</option>
                  <option value="CyberShield 2026">CyberShield 2026</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px' }}>
                  Submission Milestone Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Final Build v1.0"
                  value={newSub.submissionName}
                  onChange={(e) => setNewSub({ ...newSub, submissionName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px' }}>
                  GitHub Repository URL *
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/teamalpha/scwm"
                  value={newSub.repoUrl}
                  onChange={(e) => setNewSub({ ...newSub, repoUrl: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px' }}>
                  Live Deployment / Pitch Video URL
                </label>
                <input
                  type="text"
                  placeholder="https://demo.teamalpha.dev or YouTube link"
                  value={newSub.demoUrl}
                  onChange={(e) => setNewSub({ ...newSub, demoUrl: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Confirm Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
