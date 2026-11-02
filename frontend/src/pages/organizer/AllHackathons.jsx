import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreHorizontal, ExternalLink } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import hackathonService from '../../services/hackathonService';

const HackathonActionDropdown = ({ hackathon, navigate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAction = (type) => {
    setOpen(false);
    if (type === 'view') {
      navigate(`/organizer/hackathons/${hackathon.id}`);
    } else if (type === 'teams') {
      navigate('/organizer/teams');
    } else if (type === 'submissions') {
      navigate('/organizer/submissions');
    } else if (type === 'copy') {
      try {
        navigator.clipboard?.writeText(`${window.location.origin}/organizer/hackathons/${hackathon.id}`);
      } catch (_e) {}
      alert(`Link copied for ${hackathon.title}!`);
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen(p => !p)}
        className="grid-btn grid-btn-secondary"
        style={{ padding: '6px 10px', background: open ? 'rgba(0,245,138,0.15)' : undefined }}
        title="More Actions"
      >
        <MoreHorizontal size={14} color={open ? 'var(--grid-neon)' : 'currentColor'} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '110%', zIndex: 999,
          background: 'rgba(18, 22, 28, 0.98)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '12px', padding: '6px', minWidth: '160px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(0,245,138,0.08)',
          backdropFilter: 'blur(24px)'
        }}>
          {[
            { label: '👁 View Details', type: 'view' },
            { label: '👥 Registered Teams', type: 'teams' },
            { label: '📝 Submissions', type: 'submissions' },
            { label: '🔗 Copy Share Link', type: 'copy' }
          ].map(({ label, type }) => (
            <button
              key={type}
              onClick={() => handleAction(type)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: 'transparent', border: 'none', color: '#fff',
                padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12.5px',
                fontWeight: 500, transition: 'background 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,245,138,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const AllHackathons = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchHackathons = async () => {
      try {
        const live = await hackathonService.getAll();
        if (live && live.length > 0 && isMounted) {
          const mapped = live.map(h => ({
            id: h.id,
            title: h.title,
            dates: h.eventStart ? `${new Date(h.eventStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} 2026` : 'Nov 2026',
            status: h.status === 'PUBLISHED' ? 'Published' : (h.status === 'ONGOING' ? 'Ongoing' : (h.status === 'DRAFT' ? 'Draft' : 'Completed')),
            registeredTeams: h.registrationsCount ?? 0,
            submissions: h.submissionsCount ?? 0
          }));
          setHackathons(mapped);
        }
      } catch (err) {
        console.warn('Could not fetch hackathons from API:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchHackathons();
    return () => { isMounted = false; };
  }, []);

  const tabs = [
    { label: 'All', count: hackathons.length },
    { label: 'Draft', count: hackathons.filter(h => h.status === 'Draft').length },
    { label: 'Published', count: hackathons.filter(h => h.status === 'Published').length },
    { label: 'Ongoing', count: hackathons.filter(h => h.status === 'Ongoing').length },
    { label: 'Completed', count: hackathons.filter(h => h.status === 'Completed').length }
  ];

  const filteredHackathons = hackathons.filter(h => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Draft') return h.status === 'Draft';
    if (activeTab === 'Published') return h.status === 'Published' || h.status === 'Registration Open';
    if (activeTab === 'Ongoing') return h.status === 'Ongoing';
    if (activeTab === 'Completed') return h.status === 'Completed';
    return true;
  });

  return (
    <div className="grid-page-container">
      {/* Header with Title and Create Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Hackathons ({hackathons.length})
          </h1>
          <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>
            View and manage all hackathons created under your organization.
          </p>
        </div>
        <button
          onClick={() => navigate('/organizer/create-hackathon')}
          className="grid-btn grid-btn-primary"
        >
          <Plus size={16} /> Create Hackathon
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--grid-border-light)', paddingBottom: '12px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            style={{
              background: activeTab === tab.label ? 'rgba(0, 255, 102, 0.12)' : 'transparent',
              color: activeTab === tab.label ? 'var(--grid-neon)' : 'var(--grid-text-secondary)',
              border: activeTab === tab.label ? '1px solid rgba(0, 255, 102, 0.3)' : '1px solid transparent',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="grid-table-container">
        <table className="grid-table">
          <thead>
            <tr>
              <th>Hackathon</th>
              <th>Status</th>
              <th>Registered Teams</th>
              <th>Submissions</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHackathons.map((h) => (
              <tr
                key={h.id}
                onClick={() => navigate(`/organizer/hackathons/${h.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>{h.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--grid-text-muted)' }}>{h.dates}</div>
                </td>
                <td>
                  <Badge variant={h.status}>{h.status}</Badge>
                </td>
                <td style={{ color: 'var(--grid-text-secondary)' }}>
                  {h.registeredTeams ?? 0}
                </td>
                <td style={{ color: 'var(--grid-text-secondary)' }}>
                  {h.submissions ?? 0}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/organizer/hackathons/${h.id}`);
                      }}
                      className="grid-btn grid-btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '12px' }}
                      title="Open Hackathon"
                    >
                      <ExternalLink size={13} />
                    </button>
                    <HackathonActionDropdown hackathon={h} navigate={navigate} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
