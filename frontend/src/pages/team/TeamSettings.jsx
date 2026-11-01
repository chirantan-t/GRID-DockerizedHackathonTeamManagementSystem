import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import GlassSurface from '../../components/GlassSurface';
import { User, Bell, Palette, Users, Save, Check } from 'lucide-react';

export const TeamSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Chirantan Tondale',
    email: user?.email || 'chirantan@vit.edu.in',
    teamRole: 'Team Member',
    institution: 'Vellore Institute of Technology',
    github: 'https://github.com/chirantan-t'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="grid-page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--grid-text)', marginBottom: '6px' }}>
          Settings
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--grid-muted)', margin: 0 }}>
          Manage your account profile, credentials, and notification preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Subnav Navigation Glass Surface */}
        <GlassSurface style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { id: 'Profile', icon: User, label: 'Profile' },
            { id: 'Team', icon: Users, label: 'Team' },
            { id: 'Notifications', icon: Bell, label: 'Notifications' },
            { id: 'Appearance', icon: Palette, label: 'Appearance' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 16px',
                  borderRadius: '14px',
                  border: isActive ? '1px solid rgba(0, 245, 138, 0.35)' : '1px solid transparent',
                  background: isActive ? 'rgba(0, 245, 138, 0.12)' : 'transparent',
                  color: isActive ? 'var(--grid-green)' : 'var(--grid-muted)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </GlassSurface>

        {/* Content Glass Surface */}
        <GlassSurface style={{ padding: '32px' }}>
          {activeTab === 'Profile' && (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--grid-text)', margin: 0 }}>
                  Profile
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--grid-muted)', marginTop: '4px' }}>
                  Manage your personal account details.
                </p>
              </div>

              {/* Avatar display matching reference 09 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1f2b23 0%, #0d1712 100%)',
                      border: '2px solid rgba(0, 245, 138, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      fontWeight: 800,
                      color: 'var(--grid-green)',
                      boxShadow: '0 0 20px rgba(0, 245, 138, 0.15)'
                    }}
                  >
                    CT
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      right: 2,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: 'var(--grid-green)',
                      border: '2px solid #050706',
                      boxShadow: '0 0 8px var(--grid-green)'
                    }}
                  />
                </div>

                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--grid-text)' }}>
                    {formData.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--grid-muted)' }}>
                    {formData.email}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px' }}>
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.teamRole}
                    onChange={(e) => setFormData({ ...formData, teamRole: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px' }}>
                    Institution
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
                  {saved ? <Check size={16} /> : <Save size={16} />}
                  <span>{saved ? 'Changes Saved' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab !== 'Profile' && (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--grid-muted)' }}>
              <h4 style={{ color: 'var(--grid-text)', marginBottom: '8px' }}>{activeTab} Preferences</h4>
              <p style={{ fontSize: '13px' }}>Configure organization defaults and telemetry triggers for this workspace.</p>
            </div>
          )}
        </GlassSurface>
      </div>
    </div>
  );
};
