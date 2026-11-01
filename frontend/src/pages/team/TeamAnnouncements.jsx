import React, { useState, useEffect } from 'react';
import { MOCK_ANNOUNCEMENTS } from '../../data/mockData';
import GlassSurface from '../../components/GlassSurface';
import announcementService from '../../services/announcementService';
import { Volume2, Calendar, AlertTriangle } from 'lucide-react';

export const TeamAnnouncements = () => {
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);

  useEffect(() => {
    let isMounted = true;
    const fetchAnnouncements = async () => {
      try {
        let live = await announcementService.getMyAnnouncements();
        if (!live || live.length === 0) {
          live = await announcementService.getByHackathon(1);
        }
        if (live && live.length > 0 && isMounted) {
          const mapped = live.map(a => ({
            id: a.id,
            title: a.title,
            hackathonName: a.hackathonTitle || 'InnovateX 2026',
            time: a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Today',
            content: a.message || a.content,
            type: a.priority === 'URGENT' ? 'alert' : 'info'
          }));
          const merged = [...mapped];
          MOCK_ANNOUNCEMENTS.forEach(ma => {
            if (!merged.some(m => m.title.toLowerCase() === ma.title.toLowerCase())) {
              merged.push(ma);
            }
          });
          setAnnouncements(merged);
        }
      } catch (err) {
        console.warn('Could not fetch announcements from API, using fallback:', err);
      }
    };
    fetchAnnouncements();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="grid-page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--grid-text)', marginBottom: '6px' }}>
          Announcements
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--grid-muted)', margin: 0 }}>
          Stay updated with the latest from organizers and jury members.
        </p>
      </div>

      {/* Announcements List with Frosted Glass Boxes & Gaussian Blur */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {announcements.map((item) => {
          let Icon = Volume2;
          let iconColor = 'var(--grid-green)';
          let iconBg = 'rgba(0, 245, 138, 0.12)';
          let iconBorder = 'rgba(0, 245, 138, 0.35)';

          if (item.type === 'alert' || item.title.toLowerCase().includes('maintenance')) {
            Icon = AlertTriangle;
            iconColor = '#ffb300';
            iconBg = 'rgba(255, 179, 0, 0.12)';
            iconBorder = 'rgba(255, 179, 0, 0.35)';
          } else if (item.title.toLowerCase().includes('guideline') || item.title.toLowerCase().includes('shortlist')) {
            Icon = Calendar;
            iconColor = '#00eaff';
            iconBg = 'rgba(0, 234, 255, 0.12)';
            iconBorder = 'rgba(0, 234, 255, 0.35)';
          }

          return (
            <GlassSurface
              key={item.id}
              style={{
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                borderRadius: '20px',
                background: 'rgba(18, 25, 22, 0.62)',
                border: '1px solid rgba(255, 255, 255, 0.11)',
                backdropFilter: 'blur(28px) saturate(150%)',
                WebkitBackdropFilter: 'blur(28px) saturate(150%)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 12px 36px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Left Rounded Glass Icon Badge */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  background: iconBg,
                  border: `1px solid ${iconBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: iconColor,
                  flexShrink: 0,
                  boxShadow: `0 0 16px ${iconBg}`
                }}
              >
                <Icon size={20} />
              </div>

              {/* Main Content inside Glass Box */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--grid-text)', margin: 0 }}>
                    {item.title}
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--grid-muted)' }}>
                    {item.time}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--grid-green)', fontWeight: 600, marginBottom: '8px' }}>
                  {item.hackathonTitle}
                </div>

                <p style={{ fontSize: '13.5px', color: 'var(--grid-muted)', lineHeight: 1.6, margin: 0 }}>
                  {item.content}
                </p>
              </div>
            </GlassSurface>
          );
        })}
      </div>
    </div>
  );
};
