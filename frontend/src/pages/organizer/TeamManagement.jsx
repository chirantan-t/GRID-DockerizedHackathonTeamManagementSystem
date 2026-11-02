import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Users, Check, X, MoreHorizontal } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { mockRegisteredTeams } from '../../data/mockData';
import registrationService from '../../services/registrationService';

// Inline action dropdown for each team row
const ActionMenu = ({ team, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleAction = async (action) => {
    setOpen(false);
    if (action === 'approve') {
      onStatusChange(team.id, 'Approved');
      if (typeof team.id === 'number' || !isNaN(Number(team.id))) {
        try { await registrationService.updateStatus(Number(team.id), 'APPROVED'); } catch (e) { console.warn(e); }
      }
    } else if (action === 'reject') {
      onStatusChange(team.id, 'Rejected');
      if (typeof team.id === 'number' || !isNaN(Number(team.id))) {
        try { await registrationService.updateStatus(Number(team.id), 'REJECTED'); } catch (e) { console.warn(e); }
      }
    } else if (action === 'view') {
      alert(`Team: ${team.name}\nStatus: ${team.status}\nRegistered: ${team.date || team.registeredOn || 'N/A'}`);
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="grid-btn grid-btn-secondary"
        style={{ padding: '6px 10px' }}
        onClick={() => setOpen(prev => !prev)}
      >
        <MoreHorizontal size={14} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '110%', zIndex: 999,
          background: 'rgba(18, 22, 28, 0.98)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '12px', padding: '6px', minWidth: '140px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(0,245,138,0.08)',
          backdropFilter: 'blur(24px)'
        }}>
          {[
            { label: '👁 View Details', action: 'view' },
            { label: '✅ Approve', action: 'approve' },
            { label: '❌ Reject', action: 'reject' }
          ].map(({ label, action }) => (
            <button
              key={action}
              onClick={() => handleAction(action)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: 'transparent', border: 'none', color: 'var(--grid-text)',
                padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
                fontSize: '13px', transition: 'background 0.15s ease'
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

export const TeamManagement = () => {
  const [teams, setTeams] = useState(mockRegisteredTeams);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchRegistrations = async () => {
      try {
        const live = await registrationService.getByHackathon(1);
        if (live && live.length > 0 && isMounted) {
          const mapped = live.map(r => ({
            id: r.id,
            name: r.teamName,
            members: `${r.membersCount || 2} members`,
            status: r.status === 'APPROVED' ? 'Approved' : (r.status === 'REJECTED' ? 'Rejected' : 'Pending'),
            date: r.registeredAt ? new Date(r.registeredAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' 2026' : '10 Nov 2026'
          }));
          const merged = [...mapped];
          mockRegisteredTeams.forEach(mt => {
            if (!merged.some(m => m.name.toLowerCase() === mt.name.toLowerCase())) {
              merged.push(mt);
            }
          });
          setTeams(merged);
        }
      } catch (err) {
        console.warn('Could not fetch registrations from API, using fallback:', err);
      }
    };
    fetchRegistrations();
    return () => { isMounted = false; };
  }, []);

  const handleSingleStatusChange = (id, newStatus) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.status.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTeams.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTeams.map(t => t.id));
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setTeams(prev => prev.map(t =>
      selectedIds.includes(t.id) ? { ...t, status: newStatus } : t
    ));

    const backendStatus = newStatus === 'Approved' ? 'APPROVED' : (newStatus === 'Rejected' ? 'REJECTED' : 'PENDING');
    for (const regId of selectedIds) {
      if (typeof regId === 'number' || !isNaN(Number(regId))) {
        try {
          await registrationService.updateStatus(Number(regId), backendStatus);
        } catch (apiErr) {
          console.warn(`Could not update registration ${regId} status:`, apiErr);
        }
      }
    }
    setSelectedIds([]);
  };

  return (
    <div className="grid-page-container">
      {/* Title & Subtitle */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
          Registered Teams ({teams.length})
        </h1>
        <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>
          View, approve, or manage team registrations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="var(--grid-text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search teams by name or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="grid-input"
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <button className="grid-btn grid-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={15} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="grid-table-container">
        <table className="grid-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === filteredTeams.length}
                  onChange={toggleSelectAll}
                  style={{ cursor: 'pointer', accentColor: 'var(--grid-neon)' }}
                />
              </th>
              <th>Team Name</th>
              <th>Members</th>
              <th>Status</th>
              <th>Registered On</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.map((team) => (
              <tr key={team.id} style={{ background: selectedIds.includes(team.id) ? 'rgba(0,255,102,0.04)' : undefined }}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(team.id)}
                    onChange={() => toggleSelect(team.id)}
                    style={{ cursor: 'pointer', accentColor: 'var(--grid-neon)' }}
                  />
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{team.name}</span>
                </td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--grid-text-secondary)' }}>
                    <Users size={14} color="var(--grid-text-muted)" /> {team.members}
                  </span>
                </td>
                <td>
                  <Badge variant={team.status}>{team.status}</Badge>
                </td>
                <td style={{ color: 'var(--grid-text-secondary)' }}>
                  {team.registeredOn || team.date || '—'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <ActionMenu team={team} onStatusChange={handleSingleStatusChange} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Action Floating Bar */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(18, 20, 26, 0.75)',
        border: '1px solid var(--grid-border-light)',
        borderRadius: '10px',
        padding: '12px 20px',
        backdropFilter: 'blur(16px)'
      }}>
        <div style={{ fontSize: '13px', color: 'var(--grid-text-secondary)' }}>
          <strong style={{ color: '#fff' }}>{selectedIds.length}</strong> selected
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => handleStatusUpdate('Approved')}
            disabled={selectedIds.length === 0}
            className="grid-btn grid-btn-primary"
            style={{ opacity: selectedIds.length === 0 ? 0.5 : 1, padding: '7px 16px', fontSize: '13px' }}
          >
            <Check size={14} /> Approve
          </button>
          <button
            onClick={() => handleStatusUpdate('Rejected')}
            disabled={selectedIds.length === 0}
            className="grid-btn grid-btn-danger"
            style={{ opacity: selectedIds.length === 0 ? 0.5 : 1, padding: '7px 16px', fontSize: '13px' }}
          >
            <X size={14} /> Reject
          </button>
        </div>
      </div>
    </div>
  );
};

