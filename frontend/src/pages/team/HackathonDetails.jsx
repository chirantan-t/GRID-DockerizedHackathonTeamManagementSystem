import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_HACKATHONS } from '../../data/mockData';
import hackathonService from '../../services/hackathonService';
import GlassSurface from '../../components/GlassSurface';
import { Calendar, Users, Trophy, Bookmark, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const HackathonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isFavorited, setIsFavorited] = useState(false);

  const [hackathon, setHackathon] = useState(() => {
    return MOCK_HACKATHONS.find(h => String(h.id) === String(id)) || MOCK_HACKATHONS[0];
  });

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      try {
        const live = await hackathonService.getById(id);
        if (live && isMounted) {
          setHackathon(prev => ({
            ...prev,
            id: String(live.id),
            title: live.title,
            tagline: live.description,
            registrationStatus: live.status === 'PUBLISHED' ? 'Registration Open' : (live.status === 'ONGOING' ? 'Ongoing' : live.status),
            status: live.status,
            dates: live.eventStart ? `${new Date(live.eventStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} 2026` : prev.dates,
            teamSize: `${live.minTeamSize || 2} - ${live.maxTeamSize || 4} Members`,
            prizePool: live.prizePool || prev.prizePool,
            category: live.category || prev.category,
            venue: live.venue || prev.venue
          }));
        }
      } catch (err) {
        console.warn('Could not fetch hackathon details, using fallback:', err);
      }
    };
    if (id) fetchDetail();
    return () => { isMounted = false; };
  }, [id]);

  return (
    <div className="grid-page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Glass Surface */}
      <GlassSurface style={{ padding: '36px', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 320,
            height: 320,
            background: 'radial-gradient(circle, rgba(0,245,138,0.2) 0%, transparent 70%)',
            filter: 'blur(35px)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '34px', fontWeight: 800, color: 'var(--grid-text)', margin: 0 }}>
                {hackathon.title}
              </h1>
              <span className="grid-status grid-status-ongoing">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--grid-green)', boxShadow: '0 0 6px var(--grid-green)' }} />
                {hackathon.registrationStatus}
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--grid-muted)', maxWidth: '750px', margin: 0, lineHeight: 1.6 }}>
              {hackathon.tagline}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="btn-secondary"
            >
              <Bookmark size={16} color={isFavorited ? 'var(--grid-green)' : 'currentColor'} />
              <span>{isFavorited ? 'Favorited' : 'Add to Favorites'}</span>
            </button>
            <button
              onClick={() => navigate(`/hackathons/${hackathon.id}/register`)}
              className="btn-primary"
            >
              <span>Register Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* 3 Metric Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--grid-green)'
              }}
            >
              <Calendar size={18} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--grid-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timeline</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--grid-text)' }}>{hackathon.dates}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--grid-green)'
              }}
            >
              <Users size={18} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--grid-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team Size</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--grid-text)' }}>{hackathon.teamSize}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: 'rgba(0, 245, 138, 0.08)',
                border: '1px solid rgba(0, 245, 138, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--grid-green)'
              }}
            >
              <Trophy size={18} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--grid-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prize Pool</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--grid-green)' }}>{hackathon.prizePool}</div>
            </div>
          </div>
        </div>
      </GlassSurface>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '4px',
          borderRadius: '9999px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          width: 'fit-content',
          backdropFilter: 'blur(16px)'
        }}
      >
        {['Overview', 'Problem Statements', 'Rules', 'Timeline', 'Prizes', 'FAQs'].map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: isActive ? 'var(--grid-green)' : 'transparent',
                color: isActive ? '#00190d' : 'var(--grid-muted)',
                fontWeight: isActive ? 700 : 500,
                border: 'none',
                borderRadius: '9999px',
                padding: '7px 18px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 0 16px rgba(0, 245, 138, 0.35)' : 'none'
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab Contents Glass Surface */}
      <GlassSurface style={{ padding: '32px' }}>
        {activeTab === 'Overview' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--grid-text)', marginBottom: '14px' }}>
              About the Hackathon
            </h3>
            <p style={{ color: 'var(--grid-muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
              {hackathon.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                <div style={{ color: 'var(--grid-green)', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>Organized by</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--grid-text)' }}>{hackathon.organizer}</div>
                <div style={{ color: 'var(--grid-muted)', fontSize: '12px', marginTop: '2px' }}>{hackathon.organizerEmail}</div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                <div style={{ color: 'var(--grid-green)', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>Format & Location</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--grid-text)' }}>{hackathon.mode}</div>
                <div style={{ color: 'var(--grid-muted)', fontSize: '12px', marginTop: '2px' }}>36-hour sprint with live jury pitch</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Problem Statements' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--grid-text)', marginBottom: '16px' }}>
              Challenge Tracks & Problem Statements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                <div style={{ color: 'var(--grid-green)', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                  Track 1: AI & Autonomous Multi-Agent Swarms
                </div>
                <p style={{ color: 'var(--grid-muted)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                  Design self-coordinating autonomous agents that solve complex logistics, search-and-rescue, or real-time disaster mapping.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                <div style={{ color: 'var(--grid-green)', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                  Track 2: Sustainable Urban Computing & IoT
                </div>
                <p style={{ color: 'var(--grid-muted)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                  Optimize municipal waste networks, energy load shedding, and smart grid telemetry using edge neural models.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                <div style={{ color: 'var(--grid-green)', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                  Track 3: Open Innovation & High-Impact Software
                </div>
                <p style={{ color: 'var(--grid-muted)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                  Build breakthrough developer tooling, decentralized systems, or accessibility platforms.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'Overview' && activeTab !== 'Problem Statements' && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--grid-muted)' }}>
            <CheckCircle2 size={36} color="var(--grid-green)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ color: 'var(--grid-text)', fontSize: '16px', marginBottom: '6px' }}>{activeTab} Guidelines Published</h4>
            <p style={{ fontSize: '13px', margin: 0 }}>Official criteria and submission requirements have been verified by {hackathon.organizer}.</p>
          </div>
        )}
      </GlassSurface>
    </div>
  );
};
