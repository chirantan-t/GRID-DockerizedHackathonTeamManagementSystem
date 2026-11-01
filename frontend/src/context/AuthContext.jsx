import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext(null);

const SEED_CREDENTIALS = {
  SUPER_ADMIN: { email: 'superadmin@grid.dev', password: 'Grid@2026' },
  ORGANIZER: { email: 'organizer@grid.dev', password: 'Grid@2026' },
  TEAM: { email: 'chirantan@grid.dev', password: 'Grid@2026' }
};

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('grid_active_role') || 'TEAM';
  });

  const [user, setUser] = useState(() => {
    const savedRole = localStorage.getItem('grid_active_role') || 'TEAM';
    return MOCK_USERS.find(u => u.role === savedRole) || MOCK_USERS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('grid_auth') !== 'false';
  });

  const [loading, setLoading] = useState(true);

  // Sync with backend session on mount
  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      try {
        const userData = await authService.getMe();
        if (userData && isMounted) {
          const userRole = userData.roles?.[0] || userData.role?.roleName || 'TEAM';
          setUser({
            id: userData.id,
            name: userData.fullName,
            email: userData.email,
            role: userRole,
            avatar: userData.fullName ? userData.fullName.split(' ').map(n => n[0]).join('') : 'U'
          });
          setRole(userRole);
          setIsAuthenticated(true);
          localStorage.setItem('grid_active_role', userRole);
          localStorage.setItem('grid_auth', 'true');
        }
      } catch (err) {
        // If not authenticated on server, auto-login with default active role for seamless developer UX
        if (isMounted) {
          const currentRole = localStorage.getItem('grid_active_role') || 'TEAM';
          const creds = SEED_CREDENTIALS[currentRole] || SEED_CREDENTIALS.TEAM;
          try {
            await authService.login(creds.email, creds.password);
            const verified = await authService.getMe();
            const userRole = verified.roles?.[0] || currentRole;
            setUser({
              id: verified.id,
              name: verified.fullName,
              email: verified.email,
              role: userRole,
              avatar: verified.fullName ? verified.fullName.split(' ').map(n => n[0]).join('') : 'U'
            });
            setRole(userRole);
            setIsAuthenticated(true);
            localStorage.setItem('grid_active_role', userRole);
            localStorage.setItem('grid_auth', 'true');
          } catch (loginErr) {
            console.warn('Auto-session login failed, using fallback user state:', loginErr);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkSession();
    return () => { isMounted = false; };
  }, []);

  const loginWithCredentials = async (email, password) => {
    try {
      const authResp = await authService.login(email, password);
      const userData = await authService.getMe();
      const userRole = userData.roles?.[0] || authResp.role?.roleName || 'TEAM';
      
      setUser({
        id: userData.id,
        name: userData.fullName,
        email: userData.email,
        role: userRole,
        avatar: userData.fullName ? userData.fullName.split(' ').map(n => n[0]).join('') : 'U'
      });
      setRole(userRole);
      setIsAuthenticated(true);
      localStorage.setItem('grid_active_role', userRole);
      localStorage.setItem('grid_auth', 'true');
      return { success: true, role: userRole };
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const switchRole = async (newRole) => {
    const creds = SEED_CREDENTIALS[newRole] || SEED_CREDENTIALS.TEAM;
    try {
      await authService.login(creds.email, creds.password);
      const verified = await authService.getMe();
      const userRole = verified.roles?.[0] || newRole;
      setUser({
        id: verified.id,
        name: verified.fullName,
        email: verified.email,
        role: userRole,
        avatar: verified.fullName ? verified.fullName.split(' ').map(n => n[0]).join('') : 'U'
      });
      setRole(userRole);
      setIsAuthenticated(true);
      localStorage.setItem('grid_active_role', userRole);
      localStorage.setItem('grid_auth', 'true');
    } catch (err) {
      console.warn('Switch role session failed, falling back to local state:', err);
      setRole(newRole);
      localStorage.setItem('grid_active_role', newRole);
      const matchedUser = MOCK_USERS.find(u => u.role === newRole) || MOCK_USERS[0];
      setUser(matchedUser);
      setIsAuthenticated(true);
      localStorage.setItem('grid_auth', 'true');
    }
  };

  const login = (roleOrEmail = 'TEAM', password = null) => {
    if (password) {
      return loginWithCredentials(roleOrEmail, password);
    }
    // If called with a role name
    return switchRole(roleOrEmail);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setIsAuthenticated(false);
      localStorage.setItem('grid_auth', 'false');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      isAuthenticated,
      isTeam: role === 'TEAM',
      isOrganizer: role === 'ORGANIZER',
      isSuperAdmin: role === 'SUPER_ADMIN',
      loading,
      switchRole,
      login,
      loginWithCredentials,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
