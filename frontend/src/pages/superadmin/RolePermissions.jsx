import React, { useState } from 'react';
import { Shield, Users, Award, Plus, ArrowRight, Check } from 'lucide-react';
import { mockRolePermissionsList } from '../../data/mockData';

export const RolePermissions = () => {
  const [roles, setRoles] = useState(mockRolePermissionsList);
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <div className="grid-page-container">
      {/* Title & Create Role */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Roles & Permissions
          </h1>
          <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>
            Define roles and control access across the platform.
          </p>
        </div>

        <button className="grid-btn grid-btn-primary">
          <Plus size={16} /> Create Role
        </button>
      </div>

      {/* Role Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {roles.map((role) => {
          const Icon = role.role === 'Super Admin' ? Shield : role.role === 'Organizer' ? Award : Users;
          return (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className="grid-card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '22px 24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(0, 255, 102, 0.08)',
                  border: '1px solid rgba(0, 255, 102, 0.25)',
                  color: 'var(--grid-neon)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: '0 0 3px' }}>
                    {role.role}
                  </h3>
                  <p style={{ color: 'var(--grid-text-secondary)', fontSize: '13px', margin: 0 }}>
                    {role.description}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--grid-neon)', fontWeight: 500 }}>
                  {role.permissionsCount} Permissions
                </span>
                <ArrowRight size={15} color="var(--grid-neon)" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Detail Drawer / Modal if a role is clicked */}
      {selectedRole && (
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
          <div className="grid-card" style={{ width: '90%', maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', margin: 0 }}>
                {selectedRole.role} Permissions
              </h2>
              <button
                onClick={() => setSelectedRole(null)}
                className="grid-btn grid-btn-secondary"
                style={{ padding: '4px 10px', fontSize: '12px' }}
              >
                Close
              </button>
            </div>

            <p style={{ color: 'var(--grid-text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
              {selectedRole.description}
            </p>

            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--grid-border-light)',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '13px' }}>
                <Check size={14} color="var(--grid-neon)" /> View platform analytics & metrics
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '13px' }}>
                <Check size={14} color="var(--grid-neon)" /> Read & write entity records
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '13px' }}>
                <Check size={14} color="var(--grid-neon)" /> Role assignment and member management
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '13px' }}>
                <Check size={14} color="var(--grid-neon)" /> Event creation, updates, and moderation
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

