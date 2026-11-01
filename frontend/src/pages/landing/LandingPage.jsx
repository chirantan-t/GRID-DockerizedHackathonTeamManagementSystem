import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Shield, Cpu, Users } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'about' | 'features' | null
  const [imgLoaded, setImgLoaded] = useState(false);

  React.useEffect(() => {
    setIsTransitioning(false);
  }, []);

  const handleEnter = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/login');
    }, 600);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        userSelect: 'none'
      }}
    >
      {/* 3D Floating Laptop Stage with canonical 1670:941 aspect ratio */}
      <div
        style={{
          position: 'relative',
          width: 'min(100vw, 177.47vh)',
          height: 'min(100vh, 56.35vw)',
          maxWidth: '100vw',
          maxHeight: '100vh',
          aspectRatio: '1670 / 941',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformOrigin: '48.20% 59.83%',
          transform: isTransitioning ? 'scale(3.8)' : 'scale(1)',
          opacity: isTransitioning ? 0 : 1,
          transition: isTransitioning
            ? 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.55s ease-in'
            : 'transform 0.3s ease, opacity 0.3s ease'
        }}
      >
        {/* Photorealistic Canonical Render Base Image */}
        <img
          src="/assets/landing-hero.png"
          alt="GRID Laptop Command Center"
          onLoad={() => setImgLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
            display: 'block'
          }}
        />

        {/* 1. Hotspot: Top Left Logo (GRID.) */}
        <div
          onClick={() => window.location.reload()}
          title="GRID Home"
          style={{
            position: 'absolute',
            left: '4.5%',
            top: '2.5%',
            width: '9%',
            height: '5.5%',
            cursor: 'pointer',
            borderRadius: '8px',
            zIndex: 30
          }}
        />

        {/* 2. Hotspot: Top Right 'About' */}
        <div
          onClick={() => setActiveModal('about')}
          title="About GRID"
          style={{
            position: 'absolute',
            left: '76.0%',
            top: '2.5%',
            width: '5.5%',
            height: '5.5%',
            cursor: 'pointer',
            borderRadius: '8px',
            zIndex: 30
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        />

        {/* 3. Hotspot: Top Right 'Features' */}
        <div
          onClick={() => setActiveModal('features')}
          title="GRID Features"
          style={{
            position: 'absolute',
            left: '82.5%',
            top: '2.5%',
            width: '6.5%',
            height: '5.5%',
            cursor: 'pointer',
            borderRadius: '8px',
            zIndex: 30
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        />

        {/* 4. Hotspot: Top Right 'Docs' */}
        <div
          onClick={handleEnter}
          title="Documentation & Portal Access"
          style={{
            position: 'absolute',
            left: '90.2%',
            top: '2.2%',
            width: '5.8%',
            height: '5.6%',
            borderRadius: '9999px',
            cursor: 'pointer',
            zIndex: 30,
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 245, 138, 0.5), inset 0 0 10px rgba(0, 245, 138, 0.2)';
            e.currentTarget.style.background = 'rgba(0, 245, 138, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.background = 'transparent';
          }}
        />

        {/* 5. Hotspot & Interactive Glow: Center "Enter GRID ->" Button */}
        <button
          onClick={handleEnter}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          title="Enter GRID"
          style={{
            position: 'absolute',
            left: '40.0%',
            top: '54.83%',
            width: '16.41%',
            height: '9.99%',
            borderRadius: '9999px',
            background: isHovered ? 'rgba(0, 245, 138, 0.12)' : 'transparent',
            border: isHovered
              ? '1.6px solid rgba(0, 245, 138, 0.9)'
              : '1.6px solid transparent',
            boxShadow: isHovered
              ? '0 0 35px rgba(0, 245, 138, 0.8), inset 0 0 16px rgba(0, 245, 138, 0.35)'
              : 'none',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 35
          }}
        />

        {/* 6. Hotspot & Interactive Indicator: Bottom Mouse Scroll Capsule */}
        <div
          onClick={handleEnter}
          title="Enter GRID"
          style={{
            position: 'absolute',
            left: '48.20%',
            top: '84.0%',
            transform: 'translateX(-50%)',
            width: '3.6%',
            height: '9.0%',
            borderRadius: '16px',
            cursor: 'pointer',
            zIndex: 30,
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 245, 138, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* About Modal */}
      {activeModal === 'about' && (
        <div
          onClick={() => setActiveModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(15, 20, 18, 0.9)',
              border: '1px solid rgba(0, 245, 138, 0.35)',
              borderRadius: '24px',
              padding: '36px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 245, 138, 0.15)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'transparent',
                border: 'none',
                color: '#9aa1ad',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Sparkles size={24} color="#00f58a" />
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff' }}>About GRID</h2>
            </div>

            <p style={{ color: '#9aa1ad', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
              GRID is the Command Center for Hackathons — built for developer teams, organizers, and platform administrators to discover, participate, evaluate, and scale engineering events with zero friction.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: '#00f58a', fontWeight: 600, fontSize: '18px' }}>3 Roles</div>
                <div style={{ color: '#717882', fontSize: '12px' }}>Team, Organizer, Admin</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: '#00f58a', fontWeight: 600, fontSize: '18px' }}>Glass UI</div>
                <div style={{ color: '#717882', fontSize: '12px' }}>Apple-inspired ergonomics</div>
              </div>
            </div>

            <button
              onClick={handleEnter}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: '#00f58a',
                border: 'none',
                color: '#050706',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 0 24px rgba(0, 245, 138, 0.4)'
              }}
            >
              Launch GRID Platform →
            </button>
          </div>
        </div>
      )}

      {/* Features Modal */}
      {activeModal === 'features' && (
        <div
          onClick={() => setActiveModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(15, 20, 18, 0.9)',
              border: '1px solid rgba(0, 245, 138, 0.35)',
              borderRadius: '24px',
              padding: '36px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 245, 138, 0.15)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'transparent',
                border: 'none',
                color: '#9aa1ad',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>
              Platform Capabilities
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Users size={20} color="#00f58a" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '15px' }}>Team Experience</div>
                  <div style={{ color: '#9aa1ad', fontSize: '13px' }}>Discover hackathons, assemble squads, collaborate in project workspaces, and track real-time submission verdicts.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Cpu size={20} color="#00f58a" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '15px' }}>Organizer Hub</div>
                  <div style={{ color: '#9aa1ad', fontSize: '13px' }}>Multi-step wizard for hackathon creation, team approval queues, live criteria scoring matrices, and broadcast announcements.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Shield size={20} color="#00f58a" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '15px' }}>Super Admin Oversight</div>
                  <div style={{ color: '#9aa1ad', fontSize: '13px' }}>Platform telemetry, organizer provisioning, role permissions, infrastructure health monitoring, and system metrics.</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleEnter}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: '#00f58a',
                border: 'none',
                color: '#050706',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 0 24px rgba(0, 245, 138, 0.4)'
              }}
            >
              Enter GRID Portal →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
