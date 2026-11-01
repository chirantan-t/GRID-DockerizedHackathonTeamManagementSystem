import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Users, Award, Tag, MapPin, Edit3, ArrowRight, Bell, FileText, CheckSquare } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { mockHackathons } from '../../data/mockData';

export const OrganizerHackathonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  const hackathon = mockHackathons.find(h => String(h.id) === String(id)) || mockHackathons[0];

  const tabs = ['Overview', 'Teams', 'Submissions', 'Evaluation', 'Announcements'];

  return (
    <div className="grid-page-container">
      {/* Breadcrumb / Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
              {hackathon.title}
            </h1>
            <Badge variant={hackathon.status}>{hackathon.status}</Badge>
          </div>
          <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px', margin: 0 }}>
            {hackathon.description}
          </p>
        </div>

        <button
          onClick={() => navigate('/organizer/create-hackathon')}
          className="grid-btn grid-btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Edit3 size={15} /> Edit Event
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--grid-border-light)', marginBottom: '24px' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'Teams') navigate('/organizer/teams');
              if (tab === 'Submissions') navigate('/organizer/submissions');
              if (tab === 'Evaluation') navigate('/organizer/evaluation');
              if (tab === 'Announcements') navigate('/organizer/announcements');
            }}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--grid-neon)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--grid-neon)' : 'var(--grid-text-secondary)',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Grid: Details + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Event Specs Card */}
        <div className="grid-card" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Decorative neon sweep */}
          <div style={{
            position: 'absolute',
            bottom: -40,
            right: -40,
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(0,255,102,0.12) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>
            Event Specifications
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', fontSize: '14px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: 'var(--grid-neon)' }}>
                <Calendar size={18} />
              </div>
              <div>
                <div style={{ color: 'var(--grid-text-muted)', fontSize: '12px' }}>Dates & Duration</div>
                <div>{hackathon.dates} ({hackathon.duration})</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', fontSize: '14px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: 'var(--grid-neon)' }}>
                <Users size={18} />
              </div>
              <div>
                <div style={{ color: 'var(--grid-text-muted)', fontSize: '12px' }}>Participating Teams</div>
                <div>{hackathon.registeredTeams || 48} Registered Teams</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', fontSize: '14px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: 'var(--grid-neon)' }}>
                <Award size={18} />
              </div>
              <div>
                <div style={{ color: 'var(--grid-text-muted)', fontSize: '12px' }}>Total Prize Pool</div>
                <div>{hackathon.prizePool}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', fontSize: '14px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: 'var(--grid-neon)' }}>
                <Tag size={18} />
              </div>
              <div>
                <div style={{ color: 'var(--grid-text-muted)', fontSize: '12px' }}>Allowed Tracks</div>
                <div>AI / ML, Sustainability, FinTech, Open Web</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', fontSize: '14px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: 'var(--grid-neon)' }}>
                <MapPin size={18} />
              </div>
              <div>
                <div style={{ color: 'var(--grid-text-muted)', fontSize: '12px' }}>Mode & Location</div>
                <div>{hackathon.mode || 'Offline'} — {hackathon.location || 'VIT Campus, Mumbai'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="grid-card">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '18px' }}>
            Quick Actions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => navigate('/organizer/teams')}
              className="grid-btn grid-btn-secondary"
              style={{ justifyContent: 'space-between', padding: '12px 16px' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="var(--grid-neon)" /> Manage Teams
              </span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => navigate('/organizer/submissions')}
              className="grid-btn grid-btn-secondary"
              style={{ justifyContent: 'space-between', padding: '12px 16px' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} color="var(--grid-neon)" /> View Submissions
              </span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => navigate('/organizer/evaluation')}
              className="grid-btn grid-btn-secondary"
              style={{ justifyContent: 'space-between', padding: '12px 16px' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquare size={16} color="var(--grid-neon)" /> Evaluate & Score
              </span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => navigate('/organizer/announcements')}
              className="grid-btn grid-btn-secondary"
              style={{ justifyContent: 'space-between', padding: '12px 16px' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={16} color="var(--grid-neon)" /> Send Announcement
              </span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

