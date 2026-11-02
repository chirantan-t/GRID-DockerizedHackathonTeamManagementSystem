import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_HACKATHONS } from '../../data/mockData';
import { Stepper } from '../../components/common/Stepper';
import GlassSurface from '../../components/GlassSurface';
import teamService from '../../services/teamService';
import registrationService from '../../services/registrationService';
import { ArrowRight, ArrowLeft, Check, Calendar, Users, Trophy } from 'lucide-react';

export const TeamRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hackathon = MOCK_HACKATHONS.find(h => String(h.id) === String(id)) || MOCK_HACKATHONS[0];

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    teamName: 'Team Alpha',
    teamTag: 'ALPHA',
    projectTitle: 'Smart City Waste Management',
    domain: 'AI / ML',
    members: [
      { name: 'Chirantan Tondale', email: 'chirantan@vit.edu.in', role: 'Team Lead' },
      { name: 'Aarav Deshmukh', email: 'aarav.deshmukh@vit.edu.in', role: 'Developer' }
    ]
  });

  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Developer' });

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;
    setFormData({
      ...formData,
      members: [...formData.members, newMember]
    });
    setNewMember({ name: '', email: '', role: 'Developer' });
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setSubmitting(true);
      try {
        let teamId = null;
        try {
          const myTeams = await teamService.getMyTeams();
          if (myTeams && myTeams.length > 0) {
            teamId = myTeams[0].id;
          }
        } catch (e) {
          console.warn('Could not fetch existing team:', e);
        }

        if (!teamId) {
          const newTeam = await teamService.createTeam({
            teamName: formData.teamName,
            teamCode: (formData.teamTag || formData.teamName.slice(0, 5) + Date.now().toString().slice(-4)).toUpperCase(),
            description: formData.projectTitle || 'Hackathon participating team'
          });
          teamId = newTeam.id;
        }

        const hackathonNumericId = Number(id) || 1;
        try {
          await registrationService.registerTeam(hackathonNumericId, teamId);
        } catch (regErr) {
          console.warn('API registration call notice:', regErr);
        }

        // Save to local cache so it immediately reflects in Team Dashboard
        try {
          const cached = JSON.parse(localStorage.getItem('grid_user_registrations') || '[]');
          const newEntry = {
            id: Date.now(),
            hackathonId: hackathonNumericId,
            hackathonTitle: hackathon.title,
            teamId: teamId,
            teamName: formData.teamName,
            status: 'PENDING',
            registrationStatus: 'PENDING',
            registeredAt: new Date().toISOString(),
            dates: hackathon.dates,
            hackathon: hackathon
          };
          if (!cached.some(c => String(c.hackathonId) === String(hackathonNumericId))) {
            cached.unshift(newEntry);
            localStorage.setItem('grid_user_registrations', JSON.stringify(cached));
          }
        } catch (_cErr) {}

        navigate('/team/dashboard');
      } catch (err) {
        console.warn('Registration completed or already registered:', err);
        navigate('/team/dashboard');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="grid-page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--grid-text)', marginBottom: '6px' }}>
          Register for {hackathon.title}
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--grid-muted)', margin: 0 }}>
          Register your team to participate in {hackathon.title}.
        </p>
      </div>

      {/* Stepper */}
      <Stepper
        steps={['Team Details', 'Members', 'Review']}
        currentStep={step}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Form Area Glass Surface */}
        <GlassSurface style={{ padding: '32px' }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--grid-text)', margin: 0 }}>
                Team Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px', fontWeight: 500 }}>
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px', fontWeight: 500 }}>
                    Team Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.teamTag}
                    onChange={(e) => setFormData({ ...formData, teamTag: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px', fontWeight: 500 }}>
                  Project Title (Tentative) *
                </label>
                <input
                  type="text"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--grid-muted)', marginBottom: '6px', fontWeight: 500 }}>
                  Domain / Track *
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                >
                  <option value="AI / ML">AI / ML</option>
                  <option value="Sustainability & IoT">Sustainability & IoT</option>
                  <option value="CyberSecurity">CyberSecurity</option>
                  <option value="FinTech">FinTech</option>
                  <option value="Open Innovation">Open Innovation</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--grid-text)', margin: 0 }}>
                Manage Team Members ({formData.members.length}/4)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {formData.members.map((m, idx) => (
                  <div
                    key={idx}
                    className="glass-panel"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 18px',
                      borderRadius: '14px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--grid-text)' }}>{m.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--grid-muted)' }}>{m.email}</div>
                    </div>
                    <span className="grid-status grid-status-ongoing" style={{ fontSize: '11px', padding: '4px 12px' }}>
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>

              {formData.members.length < 4 && (
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', marginTop: '12px' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--grid-text)', marginBottom: '12px' }}>
                    Invite Additional Member
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    />
                    <input
                      type="email"
                      placeholder="VIT Student Email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={handleAddMember}
                    className="btn-secondary"
                    style={{ borderRadius: '9999px', fontSize: '12.5px', padding: '7px 16px' }}
                  >
                    + Add to Squad
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--grid-text)', margin: 0 }}>
                Review Registration
              </h3>
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--grid-muted)', textTransform: 'uppercase' }}>Team Name</div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--grid-text)', marginTop: '2px' }}>{formData.teamName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--grid-muted)', textTransform: 'uppercase' }}>Domain</div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--grid-green)', marginTop: '2px' }}>{formData.domain}</div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '11px', color: 'var(--grid-muted)', textTransform: 'uppercase' }}>Project Title</div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--grid-text)', marginTop: '2px' }}>{formData.projectTitle}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary"
                style={{ borderRadius: '9999px' }}
              >
                <ArrowLeft size={15} /> Back
              </button>
            ) : <div />}

            <button
              onClick={handleNext}
              className="btn-primary"
              style={{ borderRadius: '9999px', padding: '10px 24px' }}
            >
              <span>{step === 3 ? 'Confirm & Enter Hackathon' : 'Next'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </GlassSurface>

        {/* Right: Hackathon Info Glass Surface */}
        <GlassSurface style={{ padding: '28px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--grid-text)', marginBottom: '16px' }}>
            Hackathon Info
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar size={18} color="var(--grid-green)" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--grid-muted)' }}>Dates</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--grid-text)' }}>{hackathon.dates}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Users size={18} color="var(--grid-green)" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--grid-muted)' }}>Squad Allowed</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--grid-text)' }}>{hackathon.teamSize}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Trophy size={18} color="var(--grid-green)" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--grid-muted)' }}>Prize Pool</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--grid-green)' }}>{hackathon.prizePool}</div>
              </div>
            </div>
          </div>
        </GlassSurface>
      </div>
    </div>
  );
};
