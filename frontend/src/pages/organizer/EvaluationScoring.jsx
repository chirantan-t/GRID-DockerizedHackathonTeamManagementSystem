import React, { useState } from 'react';
import { ExternalLink, Check, Award } from 'lucide-react';
import { mockEvaluationTeams } from '../../data/mockData';
import evaluationService from '../../services/evaluationService';

export const EvaluationScoring = () => {
  const [selectedTeamId, setSelectedTeamId] = useState(mockEvaluationTeams[0].id);
  const [scores, setScores] = useState({
    innovation: 27,
    technical: 25,
    impact: 18,
    presentation: 17
  });
  const [saved, setSaved] = useState(false);

  const selectedTeam = mockEvaluationTeams.find(t => t.id === selectedTeamId) || mockEvaluationTeams[0];
  const totalScore = scores.innovation + scores.technical + scores.impact + scores.presentation;

  const handleScoreChange = (category, value) => {
    setScores(prev => ({ ...prev, [category]: Number(value) }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaved(true);
    try {
      const submissionNumericId = typeof selectedTeamId === 'number' ? selectedTeamId : 1;
      await evaluationService.createEvaluation({
        submissionId: submissionNumericId,
        innovationScore: Number(scores.innovation),
        technicalScore: Number(scores.technical),
        presentationScore: Number(scores.presentation),
        impactScore: Number(scores.impact),
        feedback: 'Evaluated via GRID Organizer console.'
      });
    } catch (apiErr) {
      console.warn('Could not persist evaluation to API:', apiErr);
    }
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="grid-page-container">
      {/* Title & Subtitle */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
          Evaluate Submissions
        </h1>
        <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>
          Review projects, assign scores, and select winners.
        </p>
      </div>

      {/* Main Grid: Left Team List + Right Scoring Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left: Team List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {mockEvaluationTeams.map((team) => {
            const isSelected = team.id === selectedTeamId;
            return (
              <div
                key={team.id}
                onClick={() => {
                  setSelectedTeamId(team.id);
                  setScores(team.initialScores);
                }}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(0, 255, 102, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '1px solid var(--grid-neon)' : '1px solid var(--grid-border-light)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600, color: isSelected ? 'var(--grid-neon)' : '#fff', marginBottom: '2px' }}>
                  {team.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--grid-text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {team.projectTitle}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Evaluation Card */}
        <div className="grid-card" style={{ padding: '28px' }}>
          {/* Header of evaluated team */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', borderBottom: '1px solid var(--grid-border-light)', paddingBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
                {selectedTeam.name}
              </h2>
              <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px', margin: 0 }}>
                {selectedTeam.projectTitle}
              </p>
            </div>

            <a
              href="https://github.com/teamalpha/scwm"
              target="_blank"
              rel="noreferrer"
              className="grid-btn grid-btn-secondary"
              style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              View Submission <ExternalLink size={14} />
            </a>
          </div>

          {/* Scoring Sliders & Live Score Box */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '32px', alignItems: 'center' }}>
            {/* Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#fff', fontWeight: 500 }}>Innovation (30%)</span>
                  <span style={{ color: 'var(--grid-neon)', fontWeight: 600 }}>{scores.innovation} / 30</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={scores.innovation}
                  onChange={(e) => handleScoreChange('innovation', e.target.value)}
                  className="grid-slider"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#fff', fontWeight: 500 }}>Technical Implementation (30%)</span>
                  <span style={{ color: 'var(--grid-neon)', fontWeight: 600 }}>{scores.technical} / 30</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={scores.technical}
                  onChange={(e) => handleScoreChange('technical', e.target.value)}
                  className="grid-slider"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#fff', fontWeight: 500 }}>Impact & Usefulness (20%)</span>
                  <span style={{ color: 'var(--grid-neon)', fontWeight: 600 }}>{scores.impact} / 20</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={scores.impact}
                  onChange={(e) => handleScoreChange('impact', e.target.value)}
                  className="grid-slider"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#fff', fontWeight: 500 }}>Presentation (20%)</span>
                  <span style={{ color: 'var(--grid-neon)', fontWeight: 600 }}>{scores.presentation} / 20</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={scores.presentation}
                  onChange={(e) => handleScoreChange('presentation', e.target.value)}
                  className="grid-slider"
                />
              </div>
            </div>

            {/* Total Score Ring Display */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 255, 102, 0.05)',
              border: '1px solid rgba(0, 255, 102, 0.2)',
              borderRadius: '16px',
              padding: '24px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: 'var(--grid-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Total Score
              </div>
              <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--grid-neon)', lineHeight: 1 }}>
                {totalScore}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--grid-text-secondary)', marginTop: '4px', marginBottom: '18px' }}>
                / 100
              </div>
              <button
                onClick={handleSave}
                className="grid-btn grid-btn-primary"
                style={{ width: '100%', fontSize: '13px', justifyContent: 'center' }}
              >
                {saved ? (
                  <>
                    <Check size={14} /> Saved!
                  </>
                ) : 'Save Score'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

