import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, MoreHorizontal, X, Check } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { mockOrganizersList } from '../../data/mockData';

const OrganizerActionDropdown = ({ org, onToggleStatus }) => {
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
      alert(`Organizer: ${org.name}\nEmail: ${org.email}\nHackathons Managed: ${org.hackathons}\nStatus: ${org.status}`);
    } else if (type === 'status') {
      onToggleStatus(org.id);
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(p => !p)}
        className="grid-btn grid-btn-secondary"
        style={{ padding: '6px 10px', background: open ? 'rgba(0,245,138,0.15)' : undefined }}
        title="Actions"
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
            { label: '👁 View Profile', type: 'view' },
            { label: org.status === 'Active' ? '⏸ Suspend Account' : '▶ Activate Account', type: 'status' }
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

export const OrganizerManagement = () => {
  const [organizers, setOrganizers] = useState(mockOrganizersList);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [newOrg, setNewOrg] = useState({ name: '', email: '' });

  const filtered = organizers.filter(org =>
    org.name.toLowerCase().includes(search.toLowerCase()) ||
    org.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddOrganizer = (e) => {
    e.preventDefault();
    if (!newOrg.name || !newOrg.email) return;

    const entry = {
      id: Date.now(),
      name: newOrg.name,
      email: newOrg.email,
      hackathons: 0,
      status: 'Active'
    };

    setOrganizers([...organizers, entry]);
    setNewOrg({ name: '', email: '' });
    setModalOpen(false);
  };

  return (
    <div className="grid-page-container">
      {/* Title & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Organizers
          </h1>
          <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>
            Manage platform organizer clubs and institutions.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="grid-btn grid-btn-primary"
        >
          <Plus size={16} /> Add Organizer
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search size={16} color="var(--grid-text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Search organizers by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="grid-input"
          style={{ paddingLeft: '40px' }}
        />
      </div>

      {/* Organizers Table */}
      <div className="grid-table-container">
        <table className="grid-table">
          <thead>
            <tr>
              <th>Organizer</th>
              <th>Email</th>
              <th>Hackathons</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((org) => (
              <tr key={org.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(0,255,102,0.1)',
                      border: '1px solid rgba(0,255,102,0.3)',
                      color: 'var(--grid-neon)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700
                    }}>
                      {org.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{org.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--grid-text-secondary)' }}>
                  {org.email}
                </td>
                <td style={{ color: 'var(--grid-text-secondary)' }}>
                  {org.hackathons}
                </td>
                <td>
                  <Badge variant={org.status}>{org.status}</Badge>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <OrganizerActionDropdown
                    org={org}
                    onToggleStatus={(id) => setOrganizers(prev => prev.map(o => o.id === id ? { ...o, status: o.status === 'Active' ? 'Suspended' : 'Active' } : o))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Organizer Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="grid-card" style={{ width: '90%', maxWidth: '480px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', margin: 0 }}>
                Add New Organizer
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--grid-text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddOrganizer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="grid-label">Organization / Club Name</label>
                <input
                  type="text"
                  placeholder="e.g. Google Developer Student Club"
                  value={newOrg.name}
                  onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                  className="grid-input"
                  required
                />
              </div>

              <div>
                <label className="grid-label">Contact / Official Email</label>
                <input
                  type="email"
                  placeholder="e.g. gdsc@vit.edu.in"
                  value={newOrg.email}
                  onChange={(e) => setNewOrg({ ...newOrg, email: e.target.value })}
                  className="grid-input"
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
                  <Check size={14} /> Add Organizer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

