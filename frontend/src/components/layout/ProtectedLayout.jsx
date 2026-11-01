import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../common/Sidebar';
import { Navbar } from '../common/Navbar';
import { GridAtmosphere } from '../common/GridAtmosphere';
import { useAuth } from '../../context/AuthContext';

export const ProtectedLayout = ({ children, title }) => {
  const { role, switchRole } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/organizer') && role !== 'ORGANIZER') {
      switchRole('ORGANIZER');
    } else if (location.pathname.startsWith('/admin') && role !== 'SUPER_ADMIN') {
      switchRole('SUPER_ADMIN');
    } else if (location.pathname.startsWith('/team') && role !== 'TEAM') {
      switchRole('TEAM');
    }
  }, [location.pathname, role, switchRole]);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        background: '#040507',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* Background Luminous Neon Ribbons & Misty Nebula */}
      <div className="grid-background" />
      <GridAtmosphere />

      {/* Floating Glassmorphic Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: 10 }}>
        <Navbar title={title} />
        <main style={{ flex: 1, padding: '16px 36px 36px', maxWidth: '1440px', width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
