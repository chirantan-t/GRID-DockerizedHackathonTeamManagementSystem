import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Shield, FileText, Sliders, Mail, Database } from 'lucide-react';

export const SystemSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('General');
  const [name, setName] = useState('GRID');
  const [tagline, setTagline] = useState('Hackathons. Teams. Innovation.');
  const [saved, setSaved] = useState(false);

  const subNav = [
    { label: 'General', icon: Sliders },
    { label: 'Roles & Permissions', icon: Shield, link: '/admin/roles' },
    { label: 'Platform Policies', icon: FileText },
    { label: 'Integrations', icon: Database },
    { label: 'Email Templates', icon: Mail },
    { label: 'Backup & Logs', icon: Database }
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="grid-page-container">
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
          System Settings
        </h1>
        <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>
          Platform configuration, branding, security policies, and integrations.
        </p>
      </div>

      {/* Main Grid: Left Subnav + Right Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left SubNav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {subNav.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.link) {
                    navigate(item.link);
                  } else {
                    setActiveTab(item.label);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: isSelected ? 'rgba(0, 255, 102, 0.1)' : 'transparent',
                  color: isSelected ? 'var(--grid-neon)' : 'var(--grid-text-secondary)',
                  border: isSelected ? '1px solid rgba(0, 255, 102, 0.25)' : '1px solid transparent',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Settings Form */}
        <div className="grid-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--grid-border-light)' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', margin: 0 }}>
                General Settings
              </h2>
              <p style={{ color: 'var(--grid-text-secondary)', fontSize: '13px', margin: '2px 0 0' }}>
                Manage platform-wide identity and metadata.
              </p>
            </div>

            <button
              onClick={handleSave}
              className="grid-btn grid-btn-primary"
            >
              {saved ? (
                <>
                  <Check size={14} /> Saved!
                </>
              ) : 'Save Changes'}
            </button>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="grid-label">Platform Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="grid-input"
              />
            </div>

            <div>
              <label className="grid-label">Platform Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="grid-input"
              />
            </div>

            <div>
              <label className="grid-label">Platform Logo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  padding: '12px 24px',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid var(--grid-border-light)',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '20px',
                  letterSpacing: '0.12em',
                  color: '#fff'
                }}>
                  GRID<span style={{ color: 'var(--grid-neon)' }}>.</span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="grid-btn grid-btn-secondary" style={{ fontSize: '12px' }}>
                    Change Logo
                  </button>
                  <button type="button" className="grid-btn grid-btn-secondary" style={{ fontSize: '12px', color: '#ff4d4f' }}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

