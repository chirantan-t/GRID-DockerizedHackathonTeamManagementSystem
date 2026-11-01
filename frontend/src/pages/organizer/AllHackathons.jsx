import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreHorizontal, ExternalLink } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { mockHackathons } from '../../data/mockData';

export const AllHackathons = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const tabs = [
    { label: 'All', count: 6 },
    { label: 'Draft', count: 1 },
    { label: 'Published', count: 4 },
    { label: 'Ongoing', count: 1 },
    { label: 'Completed', count: 0 }
  ];

  const filteredHackathons = mockHackathons.filter(h => {
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
            Hackathons
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

      {/* Hackathons Table */}
      <div className="grid-table-container">
        <table className="grid-table">
          <thead>
            <tr>
              <th>Hackathon</th>
              <th>Status</th>
              <th>Teams</th>
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
                  {h.registeredTeams || '-'}
                </td>
                <td style={{ color: 'var(--grid-text-secondary)' }}>
                  {h.submissions || '-'}
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
                    >
                      <ExternalLink size={13} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="grid-btn grid-btn-secondary"
                      style={{ padding: '6px 10px' }}
                    >
                      <MoreHorizontal size={14} />
                    </button>
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

