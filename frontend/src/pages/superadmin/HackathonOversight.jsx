import React, { useState, useEffect, useRef } from 'react';
import { Filter, MoreHorizontal, ExternalLink } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { mockPlatformHackathons } from '../../data/mockData';
import hackathonService from '../../services/hackathonService';

// Row action dropdown for each hackathon
const HackathonActionMenu = ({ item }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button className="grid-btn grid-btn-secondary" style={{ padding: '6px 10px' }} onClick={() => setOpen(p => !p)}>
        <MoreHorizontal size={14} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '110%', zIndex: 999,
          background: 'rgba(18, 22, 28, 0.98)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '12px', padding: '6px', minWidth: '150px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)', backdropFilter: 'blur(24px)'
        }}>
          {[
            { label: '👁 View Details', action: () => alert(`Hackathon: ${item.title}\nOrganizer: ${item.organizer}\nStatus: ${item.status}`) },
            { label: '🔗 Open in New Tab', action: () => window.open('http://localhost:8081/organizer/hackathons', '_blank') }
          ].map(({ label, action }) => (
            <button key={label} onClick={() => { setOpen(false); action(); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: 'transparent', border: 'none', color: 'var(--grid-text)',
                padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
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

export const HackathonOversight = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [hackathonsList, setHackathonsList] = useState(mockPlatformHackathons);

  useEffect(() => {
    let isMounted = true;
    const fetchAllHackathons = async () => {
      try {
        const live = await hackathonService.getAll();
        if (live && live.length > 0 && isMounted) {
          const mapped = live.map(h => ({
            id: h.id,
            title: h.title,
            organizer: h.organizerName || 'VIT Events Coordinator',
            teams: h.registrationsCount || 24,
            status: h.status === 'PUBLISHED' ? 'Upcoming' : (h.status === 'ONGOING' ? 'Ongoing' : 'Completed')
          }));
          const merged = [...mapped];
          mockPlatformHackathons.forEach(mh => {
            if (!merged.some(m => m.title.toLowerCase() === mh.title.toLowerCase())) {
              merged.push(mh);
            }
          });
          setHackathonsList(merged);
        }
      } catch (err) {
        console.warn('Could not fetch all hackathons from API, using fallback:', err);
      }
    };
    fetchAllHackathons();
    return () => { isMounted = false; };
  }, []);

  const tabs = [
    { label: 'All', count: hackathonsList.length },
    { label: 'Ongoing', count: hackathonsList.filter(h => h.status === 'Ongoing').length },
    { label: 'Upcoming', count: hackathonsList.filter(h => h.status === 'Upcoming' || h.status === 'Registration Open').length },
    { label: 'Completed', count: hackathonsList.filter(h => h.status === 'Completed').length }
  ];

  const filtered = hackathonsList.filter(h => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Ongoing') return h.status === 'Ongoing';
    if (activeTab === 'Upcoming') return h.status === 'Upcoming' || h.status === 'Registration Open';
    if (activeTab === 'Completed') return h.status === 'Completed';
    return true;
  });

  return (
    <div className="grid-page-container">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Hackathon Oversight
          </h1>
          <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>
            Global oversight and monitoring across all platform events.
          </p>
        </div>

        <button className="grid-btn grid-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={15} /> Filter
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
              <th>Organizer</th>
              <th>Teams</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{item.title}</span>
                </td>
                <td style={{ color: 'var(--grid-text-secondary)' }}>
                  {item.organizer}
                </td>
                <td style={{ color: 'var(--grid-text-secondary)' }}>
                  {item.teams}
                </td>
                <td>
                  <Badge variant={item.status}>{item.status}</Badge>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <HackathonActionMenu item={item} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

