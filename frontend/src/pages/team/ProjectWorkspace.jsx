import React, { useState, useEffect } from 'react';
import { MOCK_TEAMS } from '../../data/mockData';
import GlassSurface from '../../components/GlassSurface';
import teamService from '../../services/teamService';
import submissionService from '../../services/submissionService';
import { CheckCircle2, Circle, Edit3, Github, FileText, ArrowUpRight, Check, X } from 'lucide-react';

export const ProjectWorkspace = () => {
  const [team, setTeam] = useState(MOCK_TEAMS[0]); // Team Alpha
  const [submissionId, setSubmissionId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    projectTitle: team.projectTitle,
    projectDescription: team.projectDescription,
    domain: team.domain,
    repoUrl: team.repoUrl,
    docsUrl: team.docsUrl || 'https://docs.teamalpha.dev'
  });

  useEffect(() => {
    let isMounted = true;
    const fetchLiveSubmission = async () => {
      try {
        const teams = await teamService.getMyTeams();
        if (teams && teams.length > 0) {
          const teamId = teams[0].id;
          const subs = await submissionService.getByTeam(teamId);
          if (subs && subs.length > 0 && isMounted) {
            const liveSub = subs[0];
            setSubmissionId(liveSub.id);
            setTeam(prev => ({
              ...prev,
              projectTitle: liveSub.projectTitle || prev.projectTitle,
              projectDescription: liveSub.projectDescription || prev.projectDescription,
              repoUrl: liveSub.repositoryUrl || prev.repoUrl,
              docsUrl: liveSub.documentationUrl || prev.docsUrl
            }));
            setEditForm(prev => ({
              ...prev,
              projectTitle: liveSub.projectTitle || prev.projectTitle,
              projectDescription: liveSub.projectDescription || prev.projectDescription,
              repoUrl: liveSub.repositoryUrl || prev.repoUrl,
              docsUrl: liveSub.documentationUrl || prev.docsUrl
            }));
          }
        }
      } catch (err) {
        console.warn('Could not fetch live submission data:', err);
      }
    };
    fetchLiveSubmission();
    return () => { isMounted = false; };
  }, []);

  const [tasks, setTasks] = useState([
    { id: 1, label: 'Ideation & Architecture Planning', completed: true },
    { id: 2, label: 'Backend REST API & Database Setup', completed: true },
    { id: 3, label: 'React SPA UI Implementation', completed: true },
    { id: 4, label: 'Automated Testing (Selenium & Unit Tests)', completed: false },
    { id: 5, label: 'Final Deployment & Video Demo Submission', completed: false }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setTeam({
      ...team,
      ...editForm
    });
    setIsEditing(false);

    if (submissionId) {
      try {
        await submissionService.updateSubmission(submissionId, {
          projectTitle: editForm.projectTitle,
          projectDescription: editForm.projectDescription,
          repositoryUrl: editForm.repoUrl,
          documentationUrl: editForm.docsUrl
        });
      } catch (apiErr) {
        console.warn('Could not persist submission edit to API:', apiErr);
      }
    }
  };

  return (
    <div className="grid-page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Glass Surface */}
      <GlassSurface style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--grid-text)', margin: 0, letterSpacing: '-0.02em' }}>
                {team.projectTitle}
              </h1>
              <span className="grid-status grid-status-ongoing">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--grid-green)', boxShadow: '0 0 6px var(--grid-green)' }} />
                In Progress
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--grid-muted)', maxWidth: '750px', margin: 0, lineHeight: 1.6 }}>
              {team.projectDescription}
            </p>
          </div>

          {/* Edit Project: Apple-style Glass Box with Rounded Corners (NOT white background) */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              background: isEditing ? 'rgba(0, 245, 138, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: isEditing ? '1px solid rgba(0, 245, 138, 0.5)' : '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(24px) saturate(140%)',
              WebkitBackdropFilter: 'blur(24px) saturate(140%)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 24px rgba(0, 0, 0, 0.28)',
              color: isEditing ? 'var(--grid-green)' : 'var(--grid-text)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isEditing ? 'rgba(0, 245, 138, 0.22)' : 'rgba(255, 255, 255, 0.09)';
              e.currentTarget.style.borderColor = 'rgba(0, 245, 138, 0.45)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 245, 138, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isEditing ? 'rgba(0, 245, 138, 0.15)' : 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = isEditing ? 'rgba(0, 245, 138, 0.5)' : 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 24px rgba(0, 0, 0, 0.28)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            {isEditing ? <X size={15} color="var(--grid-green)" /> : <Edit3 size={15} color="var(--grid-green)" />}
            <span>{isEditing ? 'Cancel Edit' : 'Edit Project'}</span>
          </button>
        </div>

        {/* Inline Edit Project Form inside a Frosted Glass Box */}
        {isEditing && (
          <form onSubmit={handleSaveEdit} style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px', fontWeight: 600 }}>
                  Project Title
                </label>
                <input
                  type="text"
                  value={editForm.projectTitle}
                  onChange={(e) => setEditForm({ ...editForm, projectTitle: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px', fontWeight: 600 }}>
                  Track / Domain
                </label>
                <input
                  type="text"
                  value={editForm.domain}
                  onChange={(e) => setEditForm({ ...editForm, domain: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px', fontWeight: 600 }}>
                  Repository URL
                </label>
                <input
                  type="text"
                  value={editForm.repoUrl}
                  onChange={(e) => setEditForm({ ...editForm, repoUrl: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px', fontWeight: 600 }}>
                  Documentation URL
                </label>
                <input
                  type="text"
                  value={editForm.docsUrl}
                  onChange={(e) => setEditForm({ ...editForm, docsUrl: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px', fontWeight: 600 }}>
                Description
              </label>
              <textarea
                rows={3}
                value={editForm.projectDescription}
                onChange={(e) => setEditForm({ ...editForm, projectDescription: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Check size={15} /> Save Changes
              </button>
            </div>
          </form>
        )}
      </GlassSurface>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Left: Project Info Glass Surface */}
        <GlassSurface style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--grid-text)', marginBottom: '22px' }}>
            Project Information
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--grid-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Domain / Track
              </div>
              <span className="grid-status grid-status-ongoing" style={{ fontSize: '12.5px', padding: '6px 14px' }}>
                {team.domain}
              </span>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--grid-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Tech Stack
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {team.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.045)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.09)',
                      fontSize: '12.5px',
                      color: 'var(--grid-text)',
                      fontWeight: 500
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--grid-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Repository & Deliverables
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href={team.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-panel"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '13px 18px',
                    borderRadius: '14px',
                    color: 'var(--grid-text)',
                    textDecoration: 'none'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Github size={18} color="var(--grid-green)" />
                    <span style={{ fontSize: '13px', fontFamily: 'monospace' }}>{team.repoUrl}</span>
                  </span>
                  <ArrowUpRight size={15} color="var(--grid-green)" />
                </a>

                <a
                  href={editForm.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-panel"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '13px 18px',
                    borderRadius: '14px',
                    color: 'var(--grid-text)',
                    textDecoration: 'none'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={18} color="var(--grid-muted)" />
                    <span style={{ fontSize: '13px', fontFamily: 'monospace' }}>{editForm.docsUrl}</span>
                  </span>
                  <ArrowUpRight size={15} color="var(--grid-green)" />
                </a>
              </div>
            </div>
          </div>
        </GlassSurface>

        {/* Right: Progress & Checklist Glass Surface */}
        <GlassSurface style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--grid-text)', margin: 0 }}>
              Milestone Progress
            </h3>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--grid-green)' }}>
              {progressPercent}%
            </span>
          </div>

          <div style={{ width: '100%', height: 6, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 9999, overflow: 'hidden', marginBottom: '24px' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'var(--grid-green)',
                borderRadius: 9999,
                boxShadow: '0 0 12px var(--grid-green)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="glass-panel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: task.completed ? 'rgba(0, 245, 138, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  borderColor: task.completed ? 'rgba(0, 245, 138, 0.28)' : 'rgba(255, 255, 255, 0.09)',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                {task.completed ? (
                  <CheckCircle2 size={18} color="var(--grid-green)" />
                ) : (
                  <Circle size={18} color="var(--grid-muted)" />
                )}
                <span
                  style={{
                    fontSize: '13px',
                    color: task.completed ? 'var(--grid-text)' : 'var(--grid-muted)',
                    fontWeight: task.completed ? 500 : 400
                  }}
                >
                  {task.label}
                </span>
              </div>
            ))}
          </div>
        </GlassSurface>
      </div>
    </div>
  );
};
