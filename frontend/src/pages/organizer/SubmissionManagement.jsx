import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ExternalLink, CheckSquare } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { mockSubmissionsList } from '../../data/mockData';

export const SubmissionManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredSubmissions = mockSubmissionsList.filter(s =>
    s.team.toLowerCase().includes(search.toLowerCase()) ||
    s.projectTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid-page-container">
      {/* Title & Subtitle */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
          Submissions (30)
        </h1>
        <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>
          Review and evaluate team submissions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="var(--grid-text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search submissions by team or project title..."
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
                <input type="checkbox" style={{ accentColor: 'var(--grid-neon)' }} />
              </th>
              <th>Team</th>
              <th>Project Title</th>
              <th>Submitted On</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((sub) => (
              <tr key={sub.id}>
                <td>
                  <input type="checkbox" style={{ accentColor: 'var(--grid-neon)' }} />
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{sub.team}</span>
                </td>
                <td style={{ color: 'var(--grid-text-secondary)' }}>
                  {sub.projectTitle}
                </td>
                <td style={{ color: 'var(--grid-text-secondary)', fontSize: '13px' }}>
                  {sub.submittedOn}
                </td>
                <td>
                  <Badge variant={sub.status}>{sub.status}</Badge>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => navigate('/organizer/evaluation')}
                    className="grid-btn grid-btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <CheckSquare size={13} color="var(--grid-neon)" /> Score
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

