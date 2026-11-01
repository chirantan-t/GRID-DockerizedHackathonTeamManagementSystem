import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_HACKATHONS } from '../../data/mockData';
import hackathonService from '../../services/hackathonService';
import GlassSurface from '../../components/GlassSurface';
import { Calendar, Users, Trophy, ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export const ExploreHackathons = () => {
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [hackathons, setHackathons] = useState(MOCK_HACKATHONS);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchHackathons = async () => {
      try {
        const live = await hackathonService.getPublished();
        if (live && live.length > 0 && isMounted) {
          const mapped = live.map(h => ({
            id: String(h.id),
            title: h.title,
            tagline: h.description,
            registrationStatus: h.status === 'PUBLISHED' ? 'Registration Open' : (h.status === 'ONGOING' ? 'Ongoing' : h.status),
            status: h.status === 'PUBLISHED' ? 'Registration Open' : (h.status === 'ONGOING' ? 'Ongoing' : 'Completed'),
            dates: h.eventStart ? `${new Date(h.eventStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} 2026` : '15 - 16 Nov 2026',
            teamSize: `${h.minTeamSize || 2} - ${h.maxTeamSize || 4} Members`,
            prizePool: h.prizePool || '₹50,000',
            category: h.category || 'AI / ML'
          }));
          const merged = [...mapped];
          MOCK_HACKATHONS.forEach(mh => {
            if (!merged.some(m => m.title.toLowerCase() === mh.title.toLowerCase())) {
              merged.push(mh);
            }
          });
          setHackathons(merged);
        }
      } catch (err) {
        console.warn('Could not fetch published hackathons, using cached:', err);
      }
    };
    fetchHackathons();
    return () => { isMounted = false; };
  }, []);

  const filtered = hackathons.filter(h => {
    if (filter === 'All') return true;
    if (filter === 'Open') return h.registrationStatus === 'Registration Open' || h.status === 'Registration Open';
    if (filter === 'Ongoing') return h.status === 'Ongoing';
    if (filter === 'Completed') return h.status === 'Completed';
    return true;
  });

  const pageSize = 2;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages - 1);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(0);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  // Group into pages of 2
  const pages = [];
  for (let i = 0; i < filtered.length; i += pageSize) {
    pages.push(filtered.slice(i, i + pageSize));
  }

  return (
    <div className="grid-page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div>
        <div
          style={{
            fontSize: '11px',
            color: 'var(--grid-green)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: '6px'
          }}
        >
          Explore Hackathons
        </div>
        <h1
          style={{
            fontSize: '34px',
            fontWeight: 800,
            color: 'var(--grid-text)',
            letterSpacing: '-0.03em',
            marginBottom: '6px',
            lineHeight: 1.15
          }}
        >
          Find Your Next <span style={{ color: 'var(--grid-green)' }}>Challenge.</span>
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--grid-muted)', margin: 0 }}>
          Discover, register, and build innovative solutions with your team.
        </p>
      </div>

      {/* Filter Tabs & Sort Dropdown */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginTop: '4px',
          marginBottom: '8px'
        }}
      >
        {/* Apple Pill Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.035)',
            padding: '4px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(16px)'
          }}
        >
          {[
            { id: 'All', label: 'All Hackathons' },
            { id: 'Open', label: 'Open' },
            { id: 'Ongoing', label: 'Ongoing' },
            { id: 'Completed', label: 'Completed' }
          ].map(tab => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id)}
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
                  boxShadow: isActive ? '0 0 20px rgba(0, 245, 138, 0.45)' : 'none'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right side: Carousel Nav Arrows & Sort Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Subtle Next/Prev Navigation Arrows */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handlePrevPage}
                title="Previous Hackathons"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--grid-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(16px)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 245, 138, 0.5)';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 245, 138, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextPage}
                title="Next Hackathons"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--grid-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(16px)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 245, 138, 0.5)';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 245, 138, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Sort Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--grid-muted)',
              background: 'rgba(255, 255, 255, 0.035)',
              padding: '7px 14px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
              backdropFilter: 'blur(16px)'
            }}
          >
            Sort by: <span style={{ color: 'var(--grid-text)', fontWeight: 600 }}>Latest</span>
            <ChevronDown size={14} color="var(--grid-muted)" />
          </div>
        </div>
      </div>

      {/* Smooth Carousel Container */}
      <div style={{ overflow: 'hidden', width: '100%', position: 'relative', borderRadius: '24px' }}>
        <div
          style={{
            display: 'flex',
            transform: `translateX(-${(safePage * 100) / Math.max(1, pages.length)}%)`,
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            width: `${Math.max(1, pages.length) * 100}%`
          }}
        >
          {pages.map((pageGroup, pageIdx) => (
            <div
              key={pageIdx}
              style={{
                width: `${100 / Math.max(1, pages.length)}%`,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                gap: '24px',
                padding: '4px',
                boxSizing: 'border-box'
              }}
            >
              {pageGroup.map((hackathon) => (
                <GlassSurface
                  key={hackathon.id}
                  className="grid-event-card"
                  onClick={() => navigate(`/hackathons/${hackathon.id}`)}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '290px',
                    position: 'relative'
                  }}
                >
                  {/* Ambient curved ribbon glow inside card */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -40,
                      right: -30,
                      width: '260px',
                      height: '170px',
                      background: 'radial-gradient(circle at 80% 80%, rgba(0, 245, 138, 0.22) 0%, rgba(0, 245, 138, 0.04) 50%, transparent 75%)',
                      filter: 'blur(26px)',
                      pointerEvents: 'none'
                    }}
                  />

                  <div>
                    {/* Title & Status Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                      <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--grid-text)', letterSpacing: '-0.02em', margin: 0 }}>
                        {hackathon.title}
                      </h3>
                      <span className={`grid-status ${hackathon.status === 'Completed' ? 'grid-status-completed' : 'grid-status-ongoing'}`}>
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: hackathon.status === 'Completed' ? '#a1a8b3' : 'var(--grid-green)',
                            boxShadow: hackathon.status === 'Completed' ? 'none' : '0 0 6px var(--grid-green)'
                          }}
                        />
                        {hackathon.registrationStatus || hackathon.status}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '13px', color: 'var(--grid-muted)', marginBottom: '22px', lineHeight: 1.5, minHeight: '38px' }}>
                      {hackathon.tagline}
                    </p>

                    {/* Specs: Date & Members */}
                    <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '14px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={13} color="var(--grid-muted)" />
                        {hackathon.dates}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={13} color="var(--grid-muted)" />
                        {hackathon.teamSize}
                      </div>
                    </div>

                    {/* Prize Pool */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--grid-text)', fontWeight: 600, marginBottom: '24px' }}>
                      <Trophy size={14} color="var(--grid-green)" />
                      Prize Pool: {hackathon.prizePool}
                    </div>
                  </div>

                  {/* Completely Consistent Solid Neon Green Enter & Participate Button on ALL Cards */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/hackathons/${hackathon.id}`);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 24px',
                      borderRadius: '9999px',
                      background: 'var(--grid-neon, #00f58a)',
                      border: 'none',
                      color: '#030c06',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      outline: 'none',
                      boxShadow: '0 0 20px rgba(0, 245, 138, 0.32)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#18ff9d';
                      e.currentTarget.style.boxShadow = '0 0 32px rgba(0, 245, 138, 0.7)';
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--grid-neon, #00f58a)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 245, 138, 0.32)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    }}
                  >
                    <span>Enter & Participate</span>
                    <ArrowRight size={14} />
                  </button>
                </GlassSurface>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Pagination Carousel Indicator Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '18px' }}>
        {Array.from({ length: totalPages }).map((_, idx) => {
          const isActive = idx === safePage;
          return (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              title={`Page ${idx + 1}`}
              style={{
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                width: isActive ? '28px' : '7px',
                height: '5px',
                borderRadius: '9999px',
                background: isActive ? 'var(--grid-green)' : 'rgba(255, 255, 255, 0.22)',
                boxShadow: isActive ? '0 0 14px var(--grid-green)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
