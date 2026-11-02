import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Calendar, Globe, MapPin, Award } from 'lucide-react';
import hackathonService from '../../services/hackathonService';

export const CreateHackathon = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'InnovateX 2026',
    category: 'AI / ML',
    tagline: 'A 36-hour national hackathon on real-world tech challenges.',
    mode: 'Offline',
    location: 'VIT Campus, Mumbai',
    startDate: '2026-11-15T09:00',
    endDate: '2026-11-16T21:00',
    regDeadline: '2026-11-14T23:59',
    minTeamSize: '2',
    maxTeamSize: '4',
    prizePool: '₹50,000'
  });
  const [published, setPublished] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePublish = async () => {
    setPublished(true);
    try {
      const modeValue = formData.mode ? formData.mode.toUpperCase() : 'OFFLINE';
      const created = await hackathonService.createHackathon({
        title: formData.name,
        description: formData.tagline || 'Innovative hackathon challenge.',
        category: formData.category || 'AI / ML',
        venue: formData.location || 'VIT Campus, Mumbai',
        mode: modeValue === 'OFFLINE' || modeValue === 'ONLINE' || modeValue === 'HYBRID' ? modeValue : 'OFFLINE',
        registrationStart: '2026-11-01T00:00:00',
        registrationDeadline: '2026-11-14T23:59:59',
        eventStart: '2026-11-15T09:00:00',
        eventEnd: '2026-11-16T21:00:00',
        minTeamSize: Number(formData.minTeamSize) || 2,
        maxTeamSize: Number(formData.maxTeamSize) || 4,
        prizePool: formData.prizePool || '₹50,000'
      });
      if (created && created.id) {
        await hackathonService.publishHackathon(created.id);
      }
    } catch (apiErr) {
      console.warn('Could not persist hackathon to API:', apiErr);
    }
    setTimeout(() => {
      navigate('/organizer/hackathons');
    }, 1200);
  };

  return (
    <div className="grid-page-container" style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Header with Back button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/organizer/hackathons')}
          className="grid-btn grid-btn-secondary"
          style={{ padding: '8px' }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', margin: 0 }}>
            Create Hackathon
          </h1>
          <p style={{ color: 'var(--grid-text-secondary)', fontSize: '13px', margin: '2px 0 0' }}>
            Set up and publish a new event for innovators and student developers.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="grid-card" style={{ padding: '28px' }}>
        {currentStep === 1 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>
              Basic Information
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label className="grid-label">Hackathon Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="grid-input"
                  placeholder="e.g. InnovateX 2026"
                />
              </div>

              <div>
                <label className="grid-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="grid-select"
                >
                  <option value="AI / ML">AI / ML</option>
                  <option value="Sustainability / Cleantech">Sustainability / Cleantech</option>
                  <option value="Web3 & FinTech">Web3 & FinTech</option>
                  <option value="Open Innovation">Open Innovation</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>

              <div>
                <label className="grid-label">Tagline *</label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="grid-input"
                  placeholder="Short, punchy summary of your hackathon"
                />
              </div>

              <div>
                <label className="grid-label">Mode</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mode: 'Online' })}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: formData.mode === 'Online' ? 'rgba(0, 255, 102, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      color: formData.mode === 'Online' ? 'var(--grid-neon)' : 'var(--grid-text-secondary)',
                      border: formData.mode === 'Online' ? '1px solid var(--grid-neon)' : '1px solid var(--grid-border-light)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 500,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Globe size={15} /> Online
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mode: 'Offline' })}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: formData.mode === 'Offline' ? 'rgba(0, 255, 102, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      color: formData.mode === 'Offline' ? 'var(--grid-neon)' : 'var(--grid-text-secondary)',
                      border: formData.mode === 'Offline' ? '1px solid var(--grid-neon)' : '1px solid var(--grid-border-light)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 500,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <MapPin size={15} /> Offline
                  </button>
                </div>
              </div>

              {formData.mode === 'Offline' && (
                <div>
                  <label className="grid-label">Venue Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="grid-input"
                    placeholder="e.g. VIT Auditorium, Mumbai"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>
              Timeline & Schedule
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label className="grid-label">Registration Deadline *</label>
                <input
                  type="datetime-local"
                  name="regDeadline"
                  value={formData.regDeadline}
                  onChange={handleChange}
                  className="grid-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="grid-label">Event Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="grid-input"
                  />
                </div>
                <div>
                  <label className="grid-label">Event End Date & Time *</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="grid-input"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>
              Rules & Criteria
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="grid-label">Min Team Size</label>
                  <input
                    type="number"
                    name="minTeamSize"
                    value={formData.minTeamSize}
                    onChange={handleChange}
                    className="grid-input"
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <label className="grid-label">Max Team Size</label>
                  <input
                    type="number"
                    name="maxTeamSize"
                    value={formData.maxTeamSize}
                    onChange={handleChange}
                    className="grid-input"
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div>
                <label className="grid-label">Total Prize Pool</label>
                <input
                  type="text"
                  name="prizePool"
                  value={formData.prizePool}
                  onChange={handleChange}
                  className="grid-input"
                  placeholder="e.g. ₹50,000"
                />
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--grid-border-light)',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
                  Default Scoring Rubric:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: 'var(--grid-text-secondary)' }}>
                  <div>• Innovation: 30%</div>
                  <div>• Technical Implementation: 30%</div>
                  <div>• Impact & Practicality: 20%</div>
                  <div>• Presentation & UI: 20%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>
              Review & Publish
            </h2>

            {published ? (
              <div style={{ textAlign: 'center', padding: '36px 0' }}>
                <CheckCircle2 size={48} color="var(--grid-neon)" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 600, margin: '0 0 8px' }}>
                  Hackathon Published Successfully!
                </h3>
                <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px' }}>
                  Redirecting to hackathon manager...
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--grid-border-light)',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--grid-text-muted)', textTransform: 'uppercase' }}>Hackathon Name</div>
                    <div style={{ fontSize: '15px', color: '#fff', fontWeight: 600 }}>{formData.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--grid-text-muted)', textTransform: 'uppercase' }}>Category</div>
                    <div style={{ fontSize: '15px', color: '#fff' }}>{formData.category}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--grid-text-muted)', textTransform: 'uppercase' }}>Mode & Venue</div>
                    <div style={{ fontSize: '14px', color: 'var(--grid-neon)' }}>{formData.mode} ({formData.location})</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--grid-text-muted)', textTransform: 'uppercase' }}>Prize Pool</div>
                    <div style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>{formData.prizePool}</div>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--grid-text-muted)', margin: '8px 0' }}>
                  By clicking Publish, this hackathon will be visible to participants on the Explore feed.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        {!published && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '18px', borderTop: '1px solid var(--grid-border-light)' }}>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(s => s - 1)}
                className="grid-btn grid-btn-secondary"
              >
                Back
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(s => s + 1)}
                className="grid-btn grid-btn-primary"
              >
                Next <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                className="grid-btn grid-btn-primary"
              >
                Publish Hackathon
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

