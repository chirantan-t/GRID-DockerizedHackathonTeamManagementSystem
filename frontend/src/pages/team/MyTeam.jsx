import React, { useState, useEffect } from 'react';
import { MOCK_TEAMS } from '../../data/mockData';
import GlassSurface from '../../components/GlassSurface';
import teamService from '../../services/teamService';
import memberService from '../../services/memberService';
import { Users, Edit3, UserPlus, Mail, Shield, Check } from 'lucide-react';

export const MyTeam = () => {
  const [team, setTeam] = useState(MOCK_TEAMS[0]); // Team Alpha fallback
  const [members, setMembers] = useState(MOCK_TEAMS[0].members);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchTeamData = async () => {
      try {
        const teams = await teamService.getMyTeams();
        if (teams && teams.length > 0 && isMounted) {
          const liveTeam = teams[0];
          setTeam(prev => ({
            ...prev,
            id: liveTeam.id,
            name: liveTeam.teamName,
            teamCode: liveTeam.teamCode,
            description: liveTeam.description,
            hackathonName: prev.hackathonName
          }));

          // Fetch real team members
          try {
            const realMembers = await memberService.getMembers(liveTeam.id);
            if (realMembers && realMembers.length > 0 && isMounted) {
              setMembers(realMembers.map(m => ({
                id: m.id,
                name: m.userName,
                email: m.userEmail,
                role: m.memberRole === 'TEAM_LEAD' ? 'Team Lead' : (m.memberRole || 'Developer'),
                avatar: m.userName ? m.userName.split(' ').map(n => n[0]).join('') : 'CT'
              })));
            }
          } catch (memErr) {
            console.warn('Could not fetch real members, keeping fallback:', memErr);
          }
        }
      } catch (err) {
        console.warn('Could not fetch user teams, using cached fallback:', err);
      }
    };
    fetchTeamData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="grid-page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Glass Surface */}
      <GlassSurface style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--grid-text)', margin: 0 }}>
                {team.name}
              </h1>
              <span className="grid-status grid-status-ongoing">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--grid-green)', boxShadow: '0 0 6px var(--grid-green)' }} />
                Team Lead
              </span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--grid-muted)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span>{members.length} Members</span>
              <span>•</span>
              <span>Created on 10 Oct 2026</span>
              <span>•</span>
              <span style={{ color: 'var(--grid-green)' }}>{team.hackathonName}</span>
            </div>
          </div>

          <button
            onClick={() => setEditMode(!editMode)}
            className="btn-secondary"
            style={{ borderRadius: '9999px', padding: '9px 20px', fontSize: '13px' }}
          >
            {editMode ? <Check size={15} color="var(--grid-green)" /> : <Edit3 size={15} color="var(--grid-green)" />}
            <span>{editMode ? 'Done Editing' : 'Edit Team'}</span>
          </button>
        </div>
      </GlassSurface>

      {/* Team Members List */}
      <GlassSurface style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--grid-text)', margin: 0 }}>
            Team Members
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--grid-muted)' }}>
            Max 4 members per team
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {members.map((member, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '14px',
                    background: 'rgba(0, 245, 138, 0.1)',
                    border: '1px solid rgba(0, 245, 138, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: 'var(--grid-green)',
                    boxShadow: '0 0 16px rgba(0, 245, 138, 0.12)'
                  }}
                >
                  {member.avatar || member.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--grid-text)' }}>
                    {member.name}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--grid-muted)' }}>
                    {member.email || `${member.name.toLowerCase().replace(' ', '.')}@vit.edu.in`}
                  </div>
                </div>
              </div>

              <span className={`grid-status ${member.role.toLowerCase().includes('lead') ? 'grid-status-ongoing' : 'grid-status-open'}`}>
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </GlassSurface>
    </div>
  );
};
