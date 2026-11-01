import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowRight } from 'lucide-react';
import GlassSurface from '../../components/GlassSurface';
import { GridAtmosphere } from '../../components/common/GridAtmosphere';

export const LoginPage = () => {
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, loginWithCredentials, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (selectedRole) => {
    try {
      if (switchRole) {
        await switchRole(selectedRole);
      } else {
        login(selectedRole);
      }
    } catch (err) {
      console.warn(err);
    }
    if (selectedRole === 'ORGANIZER') {
      navigate('/organizer/dashboard');
    } else if (selectedRole === 'SUPER_ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/team/dashboard');
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const res = await loginWithCredentials(email, password);
      if (res?.role === 'ORGANIZER') {
        navigate('/organizer/dashboard');
      } else if (res?.role === 'SUPER_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/team/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.extractedMessage || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--grid-bg)',
        padding: '24px'
      }}
    >
      {/* Background Luminous Neon Ribbons & Atmospheric Depth */}
      <div className="grid-background" />
      <GridAtmosphere />

      <div
        style={{
          maxWidth: '1080px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Left Hero Branding */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
            {/* Vertical Glowing Neon Bar */}
            <div
              style={{
                width: 4,
                height: 64,
                background: 'var(--grid-green)',
                borderRadius: 9999,
                boxShadow: '0 0 25px rgba(0, 245, 138, 0.8), 0 0 50px rgba(0, 245, 138, 0.4)'
              }}
            />

            <div>
              <div
                style={{
                  fontSize: '44px',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: 'var(--grid-text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>GRID</span>
                <span
                  style={{
                    width: 9,
                    height: 9,
                    background: 'var(--grid-green)',
                    borderRadius: 2,
                    boxShadow: '0 0 16px var(--grid-green)'
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--grid-muted)',
                  marginTop: '6px',
                  letterSpacing: '0.01em'
                }}
              >
                The command center for hackathons.
              </p>
            </div>
          </div>
        </div>

        {/* Right Glassmorphic Card (Using GlassSurface with Mouse-Responsive Lighting) */}
        <GlassSurface className="grid-login-panel">
          <h2
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: 'var(--grid-text)',
              marginBottom: '6px',
              letterSpacing: '-0.02em'
            }}
          >
            Welcome back
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--grid-muted)', marginBottom: '28px' }}>
            Sign in to continue to GRID.
          </p>

          {!emailMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Google Button */}
              <button
                onClick={() => handleSignIn('TEAM')}
                className="grid-button"
                style={{
                  width: '100%',
                  borderRadius: '16px',
                  justifyContent: 'center'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* GitHub Button */}
              <button
                onClick={() => handleSignIn('ORGANIZER')}
                className="grid-button"
                style={{
                  width: '100%',
                  borderRadius: '16px',
                  justifyContent: 'center'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                Continue with GitHub
              </button>

              {/* Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '8px 0',
                  color: 'var(--grid-muted)',
                  fontSize: '12px'
                }}
              >
                <div style={{ flex: 1, height: 1, background: 'var(--grid-border)' }} />
                <span style={{ padding: '0 12px' }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'var(--grid-border)' }} />
              </div>

              {/* Use Email Button */}
              <button
                id="btn-use-email"
                type="button"
                onClick={() => setEmailMode(true)}
                className="grid-button"
                style={{
                  width: '100%',
                  borderRadius: '16px',
                  justifyContent: 'center',
                  borderColor: 'rgba(0, 245, 138, 0.45)',
                  boxShadow: '0 0 15px rgba(0, 245, 138, 0.15)'
                }}
              >
                <Mail size={16} color="var(--grid-green)" />
                Use Email
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleEmailSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              {errorMsg && (
                <div
                  id="login-error"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 75, 75, 0.1)',
                    border: '1px solid rgba(255, 75, 75, 0.3)',
                    color: '#ff6b6b',
                    fontSize: '12.5px'
                  }}
                >
                  {errorMsg}
                </div>
              )}
              <div>
                <label className="grid-label">Email Address</label>
                <input
                  id="username"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@vit.edu.in"
                  className="grid-input"
                  required
                />
              </div>

              <div>
                <label className="grid-label">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="grid-input"
                  required
                />
              </div>

              <button
                type="submit"
                id="login-button"
                disabled={submitting}
                className="grid-button grid-button-primary"
                style={{
                  width: '100%',
                  borderRadius: '16px',
                  marginTop: '8px',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? 'Signing In...' : 'Sign In to GRID'} <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => setEmailMode(false)}
                className="grid-button"
                style={{ width: '100%', borderRadius: '16px', fontSize: '12.5px' }}
              >
                Back to options
              </button>
            </form>
          )}

          {/* Footer */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '24px',
              fontSize: '12.5px',
              color: 'var(--grid-muted)'
            }}
          >
            New to GRID?{' '}
            <button
              onClick={() => handleSignIn('TEAM')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--grid-green)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Create an account
            </button>
          </div>

          {/* Quick Simulation Row */}
          <div
            style={{
              marginTop: '22px',
              paddingTop: '16px',
              borderTop: '1px solid var(--grid-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--grid-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Evaluation Entry:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                id="btn-role-team"
                type="button"
                onClick={() => handleSignIn('TEAM')}
                className="grid-button"
                style={{ padding: '6px 8px', fontSize: '11px', borderRadius: '10px' }}
              >
                Team Lead
              </button>
              <button
                id="btn-role-organizer"
                type="button"
                onClick={() => handleSignIn('ORGANIZER')}
                className="grid-button"
                style={{ padding: '6px 8px', fontSize: '11px', borderRadius: '10px' }}
              >
                Organizer
              </button>
              <button
                id="btn-role-admin"
                type="button"
                onClick={() => handleSignIn('SUPER_ADMIN')}
                className="grid-button"
                style={{ padding: '6px 8px', fontSize: '11px', borderRadius: '10px' }}
              >
                Super Admin
              </button>
            </div>
          </div>
        </GlassSurface>
      </div>
    </div>
  );
};
