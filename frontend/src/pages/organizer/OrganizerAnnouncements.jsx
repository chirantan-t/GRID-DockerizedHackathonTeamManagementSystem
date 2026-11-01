import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, MoreHorizontal, X, Send } from 'lucide-react';
import { mockOrganizerAnnouncements } from '../../data/mockData';
import announcementService from '../../services/announcementService';

export const OrganizerAnnouncements = () => {
  const [announcements, setAnnouncements] = useState(mockOrganizerAnnouncements);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newHackathon, setNewHackathon] = useState('InnovateX 2026');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchAnnouncements = async () => {
      try {
        const live = await announcementService.getMyAnnouncements();
        if (live && live.length > 0 && isMounted) {
          const mapped = live.map(a => ({
            id: a.id,
            title: a.title,
            hackathon: a.hackathonTitle || 'InnovateX 2026',
            time: a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Today',
            content: a.message || a.content
          }));
          const merged = [...mapped];
          mockOrganizerAnnouncements.forEach(ma => {
            if (!merged.some(m => m.title.toLowerCase() === ma.title.toLowerCase())) {
              merged.push(ma);
            }
          });
          setAnnouncements(merged);
        }
      } catch (err) {
        console.warn('Could not fetch organizer announcements from API, using fallback:', err);
      }
    };
    fetchAnnouncements();
    return () => { isMounted = false; };
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newEntry = {
      id: Date.now(),
      title: newTitle,
      hackathon: newHackathon,
      time: 'Just now',
      content: newContent
    };

    setAnnouncements([newEntry, ...announcements]);
    setNewTitle('');
    setNewContent('');
    setModalOpen(false);

    try {
      await announcementService.createAnnouncement({
        hackathonId: 1,
        title: newTitle,
        content: newContent,
        priority: 'NORMAL'
      });
    } catch (apiErr) {
      console.warn('Could not persist announcement to API:', apiErr);
    }
  };

  return (
    <div className="grid-page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Announcements
          </h1>
          <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>
            Communicate updates, deadlines, and important information to participants.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="grid-btn grid-btn-primary"
        >
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {/* Announcements Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {announcements.map((item) => (
          <div
            key={item.id}
            className="grid-card"
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
              padding: '20px'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(0, 255, 102, 0.1)',
              border: '1px solid rgba(0, 255, 102, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--grid-neon)',
              flexShrink: 0
            }}>
              <Megaphone size={18} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', margin: 0 }}>
                  {item.title}
                </h3>
                <button className="grid-btn grid-btn-secondary" style={{ padding: '4px 8px' }}>
                  <MoreHorizontal size={14} />
                </button>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--grid-neon)', marginBottom: '8px' }}>
                {item.time} — For {item.hackathon}
              </div>

              <p style={{ color: 'var(--grid-text-secondary)', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Announcement */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="grid-card" style={{ width: '90%', maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', margin: 0 }}>
                Broadcast Announcement
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--grid-text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="grid-label">Target Hackathon</label>
                <select
                  value={newHackathon}
                  onChange={(e) => setNewHackathon(e.target.value)}
                  className="grid-select"
                >
                  <option value="InnovateX 2026">InnovateX 2026</option>
                  <option value="BuildForGood">BuildForGood</option>
                  <option value="All Participants">All Hackathons</option>
                </select>
              </div>

              <div>
                <label className="grid-label">Announcement Title</label>
                <input
                  type="text"
                  placeholder="e.g. Final Submission Reminder"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="grid-input"
                  required
                />
              </div>

              <div>
                <label className="grid-label">Message Content</label>
                <textarea
                  placeholder="Type your message to teams and participants..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="grid-input"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="grid-btn grid-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="grid-btn grid-btn-primary"
                >
                  <Send size={14} /> Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

